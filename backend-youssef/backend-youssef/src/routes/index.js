import { Router } from "express";
import songsRoutes from "./songs.routes.js";

const router = Router();

// Auth is handled by Supabase Auth directly from the frontend.
router.use("/songs", songsRoutes);

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default router;
