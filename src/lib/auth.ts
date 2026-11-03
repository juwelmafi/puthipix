import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const AUTH_SECRET = process.env.AUTH_SECRET || "puthipix_fallback_secret_development_only";
const TOKEN_COOKIE_NAME = "puthipix_session_token";

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT Token
export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: "30d",
  });
}

// Verify JWT Token
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Get Current Logged-in User Session from Cookies (Server-side)
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) return null;

    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export { TOKEN_COOKIE_NAME };

