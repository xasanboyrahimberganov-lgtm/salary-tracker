export const CATEGORIES = {
  income: ["Зарплата", "Фриланс", "Подарки", "Инвестиции", "Другое"],
  expense: ["Еда", "Транспорт", "Жильё", "Здоровье", "Развлечения", "Покупки", "Другое"],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function readCredentials(body) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return { error: "Укажите корректный email" };
  if (password.length < 8) return { error: "Пароль должен быть не короче 8 символов" };
  if (password.length > 72) return { error: "Пароль должен быть не длиннее 72 символов" };
  return { email, password };
}

export function readTransaction(body) {
  const type = body.type;
  const amount = Number(body.amount);
  const category = body.category;
  const date = body.date;
  const note = typeof body.note === "string" ? body.note.trim() : "";

  if (type !== "income" && type !== "expense") return { error: "Выберите тип операции" };
  if (!Number.isFinite(amount) || amount <= 0 || amount >= 1e12) return { error: "Укажите сумму больше нуля" };
  if (!CATEGORIES[type].includes(category)) return { error: "Выберите категорию" };
  if (typeof date !== "string" || !DATE_PATTERN.test(date) || Number.isNaN(Date.parse(date))) {
    return { error: "Укажите дату" };
  }
  if (note.length > 120) return { error: "Комментарий должен быть не длиннее 120 символов" };
  return { value: { type, amount: Math.round(amount * 100) / 100, category, date, note } };
}

export function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
