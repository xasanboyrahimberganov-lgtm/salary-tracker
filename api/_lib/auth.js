import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "st_session";
const SESSION_DAYS = 7;

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(secret);
}

function isLocalRequest(req) {
  const host = String(req.headers.host || "").split(":")[0];
  return host === "localhost" || host === "127.0.0.1";
}

function cookieAttributes(req, maxAge) {
  const parts = [`Path=/`, `HttpOnly`, `SameSite=Lax`, `Max-Age=${maxAge}`];
  if (!isLocalRequest(req)) parts.push("Secure");
  return parts.join("; ");
}

export async function startSession(req, res, user) {
  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; ${cookieAttributes(req, SESSION_DAYS * 86400)}`);
}

export function endSession(req, res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; ${cookieAttributes(req, 0)}`);
}

export async function currentUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string") return null;
    return { id: payload.sub, email: String(payload.email || "") };
  } catch {
    return null;
  }
}
