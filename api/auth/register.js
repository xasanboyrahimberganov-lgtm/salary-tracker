import bcrypt from "bcryptjs";
import { sql } from "../_lib/db.js";
import { startSession } from "../_lib/auth.js";
import { allowMethods, handleError, requireJson, send } from "../_lib/http.js";
import { readCredentials } from "../_lib/validate.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"]) || !requireJson(req, res)) return;
  const credentials = readCredentials(req.body);
  if (credentials.error) return send(res, 400, { error: credentials.error });

  try {
    const passwordHash = await bcrypt.hash(credentials.password, 10);
    const rows = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${credentials.email}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `;
    if (rows.length === 0) return send(res, 409, { error: "Этот email уже зарегистрирован" });

    await startSession(req, res, rows[0]);
    send(res, 201, { user: { email: rows[0].email } });
  } catch (error) {
    handleError(res, error);
  }
}
