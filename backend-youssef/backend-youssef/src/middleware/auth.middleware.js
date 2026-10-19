import * as authService from "../services/auth.service.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = authService.verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
