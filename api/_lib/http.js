export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

export function allowMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  send(res, 405, { error: "Метод не поддерживается" });
  return false;
}

export function requireJson(req, res) {
  const type = req.headers["content-type"] || "";
  if (type.includes("application/json") && req.body && typeof req.body === "object") return true;
  send(res, 415, { error: "Ожидается JSON" });
  return false;
}

export function handleError(res, error) {
  console.error(error);
  send(res, 500, { error: "Ошибка сервера. Попробуйте ещё раз." });
}
