import { sql } from "../_lib/db.js";
import { currentUser } from "../_lib/auth.js";
import { allowMethods, handleError, requireJson, send } from "../_lib/http.js";
import { readTransaction } from "../_lib/validate.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    const user = await currentUser(req);
    if (!user) return send(res, 401, { error: "Нужно войти в аккаунт" });

    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, type, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date, note
        FROM transactions
        WHERE user_id = ${user.id}
        ORDER BY date DESC, created_at DESC
      `;
      return send(res, 200, { transactions: rows });
    }

    if (!requireJson(req, res)) return;
    const parsed = readTransaction(req.body);
    if (parsed.error) return send(res, 400, { error: parsed.error });
    const { type, amount, category, date, note } = parsed.value;

    const rows = await sql`
      INSERT INTO transactions (user_id, type, amount, category, date, note)
      VALUES (${user.id}, ${type}, ${amount}, ${category}, ${date}, ${note})
      RETURNING id, type, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date, note
    `;
    send(res, 201, { transaction: rows[0] });
  } catch (error) {
    handleError(res, error);
  }
}
