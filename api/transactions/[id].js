import { sql } from "../_lib/db.js";
import { currentUser } from "../_lib/auth.js";
import { allowMethods, handleError, requireJson, send } from "../_lib/http.js";
import { isUuid, readTransaction } from "../_lib/validate.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["PUT", "DELETE"])) return;

  try {
    const user = await currentUser(req);
    if (!user) return send(res, 401, { error: "Нужно войти в аккаунт" });

    const id = req.query.id;
    if (!isUuid(id)) return send(res, 404, { error: "Операция не найдена" });

    if (req.method === "DELETE") {
      const rows = await sql`
        DELETE FROM transactions WHERE id = ${id} AND user_id = ${user.id} RETURNING id
      `;
      if (rows.length === 0) return send(res, 404, { error: "Операция не найдена" });
      return send(res, 200, { ok: true });
    }

    if (!requireJson(req, res)) return;
    const parsed = readTransaction(req.body);
    if (parsed.error) return send(res, 400, { error: parsed.error });
    const { type, amount, category, date, note } = parsed.value;

    const rows = await sql`
      UPDATE transactions
      SET type = ${type}, amount = ${amount}, category = ${category}, date = ${date}, note = ${note}
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING id, type, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date, note
    `;
    if (rows.length === 0) return send(res, 404, { error: "Операция не найдена" });
    send(res, 200, { transaction: rows[0] });
  } catch (error) {
    handleError(res, error);
  }
}
