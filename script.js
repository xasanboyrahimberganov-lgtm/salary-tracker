const STORAGE_KEY = "salary-tracker";
const THEME_KEY = "salary-tracker-theme";
const SVG_NS = "http://www.w3.org/2000/svg";

const CATEGORIES = {
  income: ["Зарплата", "Фриланс", "Подарки", "Инвестиции", "Другое"],
  expense: ["Еда", "Транспорт", "Жильё", "Здоровье", "Развлечения", "Покупки", "Другое"],
};

const CATEGORY_COLORS = {
  income: {
    Зарплата: "#3dbe7a",
    Фриланс: "#4c8dff",
    Подарки: "#f0b429",
    Инвестиции: "#b07cff",
    Другое: "#2ec4b6",
  },
  expense: {
    Еда: "#f08a74",
    Транспорт: "#4c8dff",
    Жильё: "#f0b429",
    Здоровье: "#2ec4b6",
    Развлечения: "#b07cff",
    Покупки: "#f472b6",
    Другое: "#94d82d",
  },
};

const themeToggle = document.getElementById("theme-toggle");
const formTab = document.getElementById("tab-form");
const tabButtons = [...document.querySelectorAll("[data-tab]")];
const tabPanels = [...document.querySelectorAll("[data-panel]")];
const monthInput = document.getElementById("month");
const form = document.getElementById("transaction-form");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formError = document.getElementById("form-error");
const formTitle = document.getElementById("form-title");
const tableBody = document.getElementById("transactions");

let transactions = loadTransactions();
let editingId = null;
let activeTab = "summary";

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

monthInput.value = currentMonth();
dateInput.value = todayISO();
fillCategories("income");
render();

tabButtons.forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.tab));
});

document.querySelector(".tabs").addEventListener("keydown", (event) => {
  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const index = tabButtons.findIndex((button) => button.dataset.tab === activeTab);
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % tabButtons.length;
  if (event.key === "ArrowLeft") next = (index - 1 + tabButtons.length) % tabButtons.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabButtons.length - 1;
  showTab(tabButtons[next].dataset.tab);
  tabButtons[next].focus();
});

monthInput.addEventListener("change", () => {
  if (!monthInput.value) monthInput.value = currentMonth();
  render();
});

typeInput.addEventListener("change", () => {
  fillCategories(typeInput.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const draft = readForm();
  if (!draft) return;

  if (editingId) {
    transactions = transactions.map((item) =>
      item.id === editingId ? { ...draft, id: editingId } : item
    );
  } else {
    transactions.push({ ...draft, id: createId() });
  }

  saveTransactions();
  resetForm();
  render();
  showTab("list");
});

cancelBtn.addEventListener("click", resetForm);

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === "edit") startEdit(id);
  if (button.dataset.action === "delete") removeTransaction(id);
});

function showTab(name) {
  if (!name || name === activeTab) return;
  tabPanels.forEach((panel) => {
    panel.classList.remove("is-leaving");
    if (panel.dataset.panel !== activeTab) return;
    panel.classList.remove("is-active");
    panel.classList.add("is-leaving");
    panel.setAttribute("aria-hidden", "true");
    const hide = () => panel.classList.remove("is-leaving");
    panel.addEventListener("animationend", hide, { once: true });
    window.setTimeout(hide, 380);
  });

  const next = tabPanels.find((panel) => panel.dataset.panel === name);
  if (!next) return;
  next.classList.remove("is-leaving");
  next.classList.add("is-active");
  next.setAttribute("aria-hidden", "false");
  activeTab = name;

  tabButtons.forEach((button) => {
    const selected = button.dataset.tab === name;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.textContent = dark ? "Светлая тема" : "Тёмная тема";
  themeToggle.setAttribute("aria-pressed", String(dark));
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
}

function loadTransactions() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter(isValidTransaction);
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function isValidTransaction(item) {
  return Boolean(
    item &&
      typeof item.id === "string" &&
      (item.type === "income" || item.type === "expense") &&
      typeof item.amount === "number" &&
      item.amount > 0 &&
      typeof item.category === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
      typeof item.note === "string"
  );
}

function readForm() {
  const type = typeInput.value;
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  const note = noteInput.value.trim();

  if (type !== "income" && type !== "expense") {
    showError("Выберите тип операции");
    return null;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Укажите сумму больше нуля");
    return null;
  }
  if (!CATEGORIES[type].includes(category)) {
    showError("Выберите категорию");
    return null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Укажите дату");
    return null;
  }

  showError("");
  return { type, amount, category, date, note };
}

function startEdit(id) {
  const item = transactions.find((entry) => entry.id === id);
  if (!item) return;
  editingId = id;
  typeInput.value = item.type;
  fillCategories(item.type, item.category);
  amountInput.value = String(item.amount);
  dateInput.value = item.date;
  noteInput.value = item.note;
  submitBtn.textContent = "Сохранить";
  cancelBtn.hidden = false;
  formTitle.textContent = "Редактирование операции";
  formTab.textContent = "Редактирование";
  showError("");
  showTab("form");
  amountInput.focus();
}

function removeTransaction(id) {
  const item = transactions.find((entry) => entry.id === id);
  if (!item) return;
  const confirmed = window.confirm("Удалить операцию?");
  if (!confirmed) return;
  transactions = transactions.filter((entry) => entry.id !== id);
  if (editingId === id) resetForm();
  saveTransactions();
  render();
}

function resetForm() {
  editingId = null;
  form.reset();
  typeInput.value = "income";
  fillCategories("income");
  dateInput.value = todayISO();
  submitBtn.textContent = "Добавить";
  cancelBtn.hidden = true;
  formTitle.textContent = "Новая операция";
  formTab.textContent = "Новая операция";
  showError("");
}

function fillCategories(type, selected) {
  categoryInput.replaceChildren();
  for (const name of CATEGORIES[type]) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === selected) option.selected = true;
    categoryInput.append(option);
  }
}

function render() {
  const month = monthInput.value;
  const visible = transactions
    .filter((item) => item.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  renderCards(visible);
  renderBarChart(visible, month);
  renderDonut(document.getElementById("income-donut"), visible, "income");
  renderDonut(document.getElementById("expense-donut"), visible, "expense");
  renderTable(visible);
}

function renderCards(items) {
  const income = sumByType(items, "income");
  const expense = sumByType(items, "expense");
  document.getElementById("income-total").textContent = formatMoney(income);
  document.getElementById("expense-total").textContent = formatMoney(expense);
  document.getElementById("balance-total").textContent = formatMoney(income - expense);
}

function renderBarChart(items, month) {
  const host = document.getElementById("bar-chart");
  host.replaceChildren();

  const [year, monthNumber] = month.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();
  const income = Array(days).fill(0);
  const expense = Array(days).fill(0);

  for (const item of items) {
    const index = Number(item.date.slice(8, 10)) - 1;
    if (index < 0 || index >= days) continue;
    if (item.type === "income") income[index] += item.amount;
    else expense[index] += item.amount;
  }

  const max = Math.max(...income, ...expense, 0);
  const width = 640;
  const height = 230;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 16;
  const padBottom = 28;
  const chartHeight = height - padTop - padBottom;
  const slot = (width - padLeft - padRight) / days;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": "Доход и расход по дням месяца",
  });

  svg.append(
    svgEl("line", {
      x1: padLeft,
      y1: padTop + chartHeight,
      x2: width - padRight,
      y2: padTop + chartHeight,
      stroke: "var(--line)",
      "stroke-width": 1,
    })
  );

  if (max === 0) {
    const label = svgEl("text", {
      x: width / 2,
      y: padTop + chartHeight / 2,
      "text-anchor": "middle",
      fill: "var(--muted)",
      "font-size": 14,
    });
    label.textContent = "Нет данных";
    svg.append(label);
  }

  for (let day = 0; day < days; day += 1) {
    const groupX = padLeft + day * slot;
    const barWidth = Math.min(7, slot * 0.32);
    const pairWidth = barWidth * 2 + 2;
    const startX = groupX + (slot - pairWidth) / 2;
    svg.append(barNode(startX, income[day], max, chartHeight, padTop, barWidth, "var(--income)", day + 1, "Доход"));
    svg.append(barNode(startX + barWidth + 2, expense[day], max, chartHeight, padTop, barWidth, "var(--expense)", day + 1, "Расход"));

    if (day === 0 || day === days - 1 || (day + 1) % 5 === 0) {
      const tick = svgEl("text", {
        x: groupX + slot / 2,
        y: height - 8,
        "text-anchor": "middle",
        fill: "var(--muted)",
        "font-size": 11,
      });
      tick.textContent = String(day + 1);
      svg.append(tick);
    }
  }

  host.append(svg);
}

function barNode(x, value, max, chartHeight, padTop, barWidth, color, day, label) {
  const height = max === 0 ? 0 : (value / max) * chartHeight;
  const y = padTop + chartHeight - height;
  const rect = svgEl("rect", {
    x,
    y,
    width: barWidth,
    height: Math.max(height, 0),
    rx: 2,
    fill: color,
  });
  const title = svgEl("title");
  title.textContent = `${day}: ${label} ${formatMoney(value)}`;
  rect.append(title);
  return rect;
}

function renderDonut(host, items, type) {
  host.replaceChildren();
  const grouped = new Map();
  for (const item of items) {
    if (item.type !== type) continue;
    grouped.set(item.category, (grouped.get(item.category) || 0) + item.amount);
  }

  const slices = [...grouped.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);
  const colorOf = (category) => CATEGORY_COLORS[type][category] || "#94a3b8";

  const layout = document.createElement("div");
  layout.className = "donut-layout";

  const visual = document.createElement("div");
  visual.className = "donut-visual";
  const svg = svgEl("svg", {
    viewBox: "0 0 160 160",
    role: "img",
    "aria-label": type === "income" ? "Доходы по категориям" : "Расходы по категориям",
  });

  if (slices.length === 0) {
    svg.append(
      svgEl("circle", {
        cx: 80,
        cy: 80,
        r: 68,
        fill: "var(--chart-track)",
      })
    );
  } else if (slices.length === 1) {
    const whole = svgEl("circle", {
      cx: 80,
      cy: 80,
      r: 68,
      fill: colorOf(slices[0].category),
    });
    const title = svgEl("title");
    title.textContent = `${slices[0].category}: ${formatMoney(slices[0].amount)}`;
    whole.append(title);
    svg.append(whole);
  } else {
    let angle = -Math.PI / 2;
    slices.forEach((slice, index) => {
      const sweep = (slice.amount / total) * Math.PI * 2;
      const end = index === slices.length - 1 ? -Math.PI / 2 + Math.PI * 2 : angle + sweep;
      const wedge = svgEl("path", {
        d: piePath(80, 80, 68, angle, end),
        fill: colorOf(slice.category),
      });
      const title = svgEl("title");
      title.textContent = `${slice.category}: ${formatMoney(slice.amount)}`;
      wedge.append(title);
      svg.append(wedge);
      angle = end;
    });
  }

  const center = document.createElement("p");
  center.className = "donut-total";
  center.textContent = total > 0 ? formatMoney(total) : "Нет данных";
  visual.append(svg, center);

  const legend = document.createElement("ul");
  legend.className = "donut-legend";
  if (slices.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-chart";
    empty.textContent = "Нет данных";
    legend.append(empty);
  } else {
    slices.forEach((slice, index) => {
      const row = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.style.background = colorOf(slice.category);
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = slice.category;
      const meta = document.createElement("span");
      meta.className = "meta";
      const share = Math.round((slice.amount / total) * 100);
      meta.textContent = `${formatMoney(slice.amount)} · ${share}%`;
      row.append(dot, name, meta);
      legend.append(row);
    });
  }

  layout.append(visual, legend);
  host.append(layout);
}

function renderTable(items) {
  tableBody.replaceChildren();
  if (items.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "За этот месяц операций нет";
    row.append(cell);
    tableBody.append(row);
    return;
  }

  for (const item of items) {
    const row = document.createElement("tr");
    row.append(
      cell(formatDate(item.date)),
      typeCell(item.type),
      cell(item.category),
      cell(item.note || "—"),
      amountCell(item),
      actionsCell(item.id)
    );
    tableBody.append(row);
  }
}

function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function typeCell(type) {
  const td = document.createElement("td");
  const pill = document.createElement("span");
  pill.className = type === "income" ? "pill pill-income" : "pill pill-expense";
  pill.textContent = type === "income" ? "Доход" : "Расход";
  td.append(pill);
  return td;
}

function amountCell(item) {
  const td = document.createElement("td");
  td.className = item.type === "income" ? "num amount-income" : "num amount-expense";
  td.textContent = formatMoney(item.amount);
  return td;
}

function actionsCell(id) {
  const td = document.createElement("td");
  const wrap = document.createElement("div");
  wrap.className = "row-actions";
  wrap.append(actionButton("Изменить", "edit", id), actionButton("Удалить", "delete", id, true));
  td.append(wrap);
  return td;
}

function actionButton(label, action, id, danger) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = danger ? "link-btn danger" : "link-btn";
  button.dataset.action = action;
  button.dataset.id = id;
  button.textContent = label;
  return button;
}

function sumByType(items, type) {
  return items.reduce((sum, item) => (item.type === type ? sum + item.amount : sum), 0);
}

function formatMoney(value) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "";
  const body = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${body} сум`;
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function currentMonth() {
  return todayISO().slice(0, 7);
}

function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function createId() {
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function showError(message) {
  formError.textContent = message;
}

function piePath(cx, cy, radius, startAngle, endAngle) {
  const startX = cx + radius * Math.cos(startAngle);
  const startY = cy + radius * Math.sin(startAngle);
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${large} 1 ${endX} ${endY} Z`;
}

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}
