import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (
    name === undefined ||
    name === null ||
    String(name).trim() === ""
  ) {
    return res.status(400).json({ message: "name is required" });
  }
  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ message: "email is required" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "password is required" });
  }
  if (!confirmPassword || typeof confirmPassword !== "string") {
    return res.status(400).json({ message: "confirmPassword is required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "password and confirmPassword do not match" });
  }

  const result = await authService.register({
    email: email.trim().toLowerCase(),
    password,
    name: String(name).trim(),
  });
  res.status(201).json(result);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.json(result);
}
