import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

function getBcryptSaltRounds() {
  const parsed = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);
  if (!Number.isFinite(parsed) || parsed < 4) return 10;
  return Math.min(parsed, 31);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

function signToken(userId) {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name || "",
  };
}

export async function register({ email, password, name }) {
  const hash = await bcrypt.hash(password, getBcryptSaltRounds());
  const user = await User.create({
    email,
    password: hash,
    name: name ?? "",
  });
  const token = signToken(user._id.toString());
  return { token, user: toPublicUser(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }
  const token = signToken(user._id.toString());
  return { token, user: toPublicUser(user) };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}
