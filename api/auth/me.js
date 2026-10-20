import { currentUser } from "../_lib/auth.js";
import { allowMethods, handleError, send } from "../_lib/http.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["GET"])) return;
  try {
    const user = await currentUser(req);
    if (!user) return send(res, 401, { error: "Нужно войти в аккаунт" });
    send(res, 200, { user: { email: user.email } });
  } catch (error) {
    handleError(res, error);
  }
}
