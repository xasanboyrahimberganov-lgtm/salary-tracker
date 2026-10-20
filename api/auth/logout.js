import { endSession } from "../_lib/auth.js";
import { allowMethods, send } from "../_lib/http.js";

export default function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;
  endSession(req, res);
  send(res, 200, { ok: true });
}
