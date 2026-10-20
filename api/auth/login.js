import bcrypt from "bcryptjs";
import { sql } from "../_lib/db.js";
import { startSession } from "../_lib/auth.js";
import { allowMethods, handleError, requireJson, send } from "../_lib/http.js";

const DUMMY_HASH = bcrypt.hashSync("unused-password-for-timing", 10);

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"]) || !requireJson(req, res)) return;
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!email || !password) return send(res, 400, { error: "Введите email и пароль" });

  try {
    const rows = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;
    const user = rows[0];
    const valid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !valid) return send(res, 401, { error: "Неверный email или пароль" });

    await startSession(req, res, user);
    send(res, 200, { user: { email: user.email } });
  } catch (error) {
    handleError(res, error);
  }
}
