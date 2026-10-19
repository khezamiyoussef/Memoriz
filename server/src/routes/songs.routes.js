import { Router } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const router = Router();

// GET /api/songs/search?q=Perfect+Ed+Sheeran
// Uses yt-dlp to search YouTube and returns the first video ID.
router.get("/search", (req, res) => {
  const raw = req.query.q;
  if (!raw || typeof raw !== "string") {
    return res.status(400).json({ error: "Query required" });
  }

  const query = raw.replace(/[^\w\s\-'.,!?]/g, "").trim().slice(0, 200);
  if (!query) return res.status(400).json({ error: "Invalid query" });

  const ytdlp = spawn("yt-dlp", [
    `ytsearch1:${query}`,
    "--get-id",
    "--no-playlist",
    "--quiet",
    "--no-warnings",
  ]);

  let videoId = "";
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    ytdlp.kill();
    res.status(504).json({ error: "Search timed out" });
  }, 15000);

  ytdlp.stdout.on("data", (chunk) => { videoId += chunk.toString(); });

  ytdlp.on("close", (code) => {
    clearTimeout(timer);
    if (timedOut) return;
    const id = videoId.trim();
    if (code !== 0 || !id) return res.status(500).json({ error: "Search failed" });
    res.json({ videoId: id });
  });
});

// GET /api/songs/stream?q=Perfect+Ed+Sheeran
// Downloads audio to a temp file then serves it with Range support so the
// browser can report a real duration and seeking works correctly.
router.get("/stream", (req, res) => {
  const raw = req.query.q;
  if (!raw || typeof raw !== "string") {
    return res.status(400).json({ error: "Query required" });
  }

  const query = raw.replace(/[^\w\s\-'.,!?]/g, "").trim().slice(0, 200);
  if (!query) return res.status(400).json({ error: "Invalid query" });

  const hash = crypto.createHash("md5").update(query).digest("hex").slice(0, 16);
  const tmpDir = os.tmpdir();
  const tmpBase = `memoriz-${hash}`;

  const getMime = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const types = { ".webm": "audio/webm", ".m4a": "audio/mp4", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".aac": "audio/aac" };
    return types[ext] || "audio/octet-stream";
  };

  const findCached = () => {
    try {
      const files = fs.readdirSync(tmpDir).filter(f => f.startsWith(tmpBase + "."));
      return files.length ? path.join(tmpDir, files[0]) : null;
    } catch { return null; }
  };

  const serveFile = (filePath) => {
    try {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const mime = getMime(filePath);
      const range = req.headers.range;

      if (range) {
        const [s, e] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(s, 10);
        const end = e ? parseInt(e, 10) : fileSize - 1;
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Content-Type": mime,
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": mime,
          "Accept-Ranges": "bytes",
        });
        fs.createReadStream(filePath).pipe(res);
      }
    } catch {
      if (!res.headersSent) res.status(500).json({ error: "Failed to serve audio" });
    }
  };

  // Serve from cache if already downloaded
  const cached = findCached();
  if (cached) {
    serveFile(cached);
    return;
  }

  // Download to temp file — yt-dlp appends the real extension automatically
  const ytdlp = spawn("yt-dlp", [
    `ytsearch1:${query}`,
    "--format", "bestaudio",
    "--no-playlist",
    "-o", path.join(tmpDir, `${tmpBase}.%(ext)s`),
    "--quiet",
    "--no-warnings",
  ]);

  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    ytdlp.kill();
    if (!res.headersSent) res.status(504).json({ error: "Download timed out" });
  }, 90000);

  ytdlp.on("close", (code) => {
    clearTimeout(timer);
    if (timedOut) return;
    const downloaded = findCached();
    if (code !== 0 || !downloaded) {
      return res.status(500).json({ error: "Download failed" });
    }
    serveFile(downloaded);
  });

  ytdlp.on("error", () => {
    clearTimeout(timer);
    if (!timedOut && !res.headersSent) res.status(500).json({ error: "yt-dlp error" });
  });
});

export default router;
