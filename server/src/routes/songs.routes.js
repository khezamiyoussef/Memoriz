import { Router } from "express";
import { spawn } from "child_process";
import { rateLimit } from "express-rate-limit";
import { requireUser } from "../middleware/auth.middleware.js";
import { logEvent } from "../logger.js";

const router = Router();

const VIDEO_ID = /^[\w-]{11}$/;
const MAX_QUERY_LENGTH = 100;
const MAX_RUNNING = 4; // yt-dlp processes at once, across all users
const TIMEOUT_MS = 15000;
let running = 0;

const searchLimit = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.userId, // runs after requireUser
  handler: (req, res) => {
    logEvent("rate_limited", { route: req.path, user: req.userId });
    res.status(429).json({ error: "Too many requests" });
  },
});

// Letters (any language), digits, spaces and a little punctuation. Anything
// else, including ":" and "/", is dropped, so the query can never become a
// URL or an option.
function cleanQuery(raw) {
  return raw
    .replace(/[^\p{L}\p{N}\s'.,!?&-]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/^[\s-]+/, "")
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

// GET /api/songs/search?q=Perfect+Ed+Sheeran
// Uses yt-dlp to search YouTube and returns the first video ID.
router.get("/search", requireUser, searchLimit, (req, res) => {
  const raw = req.query.q;
  if (!raw || typeof raw !== "string") {
    return res.status(400).json({ error: "Query required" });
  }

  const query = cleanQuery(raw);
  if (!query) return res.status(400).json({ error: "Invalid query" });

  if (running >= MAX_RUNNING) {
    logEvent("rate_limited", { route: req.path, user: req.userId, reason: "busy" });
    return res.status(503).json({ error: "Busy, try again shortly" });
  }
  running++;

  // No shell; "--" ends the options and the ytsearch1: prefix keeps yt-dlp on
  // YouTube search, never an arbitrary URL. --ignore-config stops config
  // files from adding options such as --exec.
  const ytdlp = spawn("yt-dlp", [
    "--ignore-config",
    "--get-id",
    "--no-playlist",
    "--quiet",
    "--no-warnings",
    "--",
    `ytsearch1:${query}`,
  ]);

  let output = "";
  let done = false;
  const finish = (status, body) => {
    if (done) return;
    done = true;
    running--;
    clearTimeout(timer);
    if (!res.headersSent) res.status(status).json(body);
  };

  const timer = setTimeout(() => {
    ytdlp.kill();
    finish(504, { error: "Search timed out" });
  }, TIMEOUT_MS);

  // Client went away: don't keep the process running
  res.on("close", () => {
    if (!done) ytdlp.kill();
  });

  ytdlp.stdout.on("data", (chunk) => {
    if (output.length < 1000) output += chunk.toString();
  });

  ytdlp.on("error", () => finish(500, { error: "Search failed" }));

  ytdlp.on("close", (code) => {
    const id = output.trim();
    if (code !== 0 || !VIDEO_ID.test(id)) return finish(500, { error: "Search failed" });
    finish(200, { videoId: id });
  });
});

export default router;
