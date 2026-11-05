import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const AUTH_SECRET = process.env.AUTH_SECRET || "puthipix_fallback_secret_development_only";
const TOKEN_COOKIE_NAME = "puthipix_session_token";

/**
 * Designated Super-Admin Emails.
 * Any authenticated user with an email in this list is guaranteed administrative privileges.
 */
export const ADMIN_EMAILS: string[] = [
  "admin@puthipix.com",
  "juwelsoftvence@gmail.com",
  ...(process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : []),
];

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

/**
 * Checks whether an email address belongs to the designated admin list.
 */
export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Validates whether a given session belongs to an administrator.
 */
export function isAdminSession(session?: SessionPayload | null): boolean {
  if (!session) return false;
  if (session.role === "admin") return true;
  return isAdminEmail(session.email);
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
  const role: "user" | "admin" = isAdminEmail(payload.email) ? "admin" : (payload.role || "user");
  return jwt.sign({ ...payload, role }, AUTH_SECRET, {
    expiresIn: "30d",
  });
}

// Verify JWT Token
export function verifyToken(token: string): SessionPayload | null {
  try {
    const payload = jwt.verify(token, AUTH_SECRET) as SessionPayload;
    if (payload && payload.email && isAdminEmail(payload.email)) {
      payload.role = "admin";
    }
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves the current logged-in user session from either the HTTP cookie or Authorization header.
 * Checks both mechanisms and elevates admin rights if the user email matches ADMIN_EMAILS.
 */
export async function getSession(request?: Request): Promise<SessionPayload | null> {
  try {
    let bearerToken: string | undefined;
    let cookieToken: string | undefined;

    // 1. Check Authorization Bearer header
    if (request) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        bearerToken = authHeader.substring(7).trim();
      }
    }

    // 2. Check HTTP cookie
    try {
      const cookieStore = await cookies();
      cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      // In case cookies() is invoked outside standard request context
    }

    // Verify bearer token first if present
    if (bearerToken) {
      const session = verifyToken(bearerToken);
      if (session) {
        if (isAdminEmail(session.email)) {
          session.role = "admin";
        }
        return session;
      }
    }

    // Verify cookie token if present
    if (cookieToken) {
      const session = verifyToken(cookieToken);
      if (session) {
        if (isAdminEmail(session.email)) {
          session.role = "admin";
        }
        return session;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export { TOKEN_COOKIE_NAME };
