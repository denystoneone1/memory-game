import { el } from "./dom.js";

const STORAGE_KEY = "memory-game:leaderboard";
const TOP_LIMIT = 10;

function isValidResult(result) {
  return (
    Number.isInteger(result?.moves) &&
    result.moves > 0 &&
    Number.isFinite(result.date)
  );
}

function readResults() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(isValidResult) : [];
  } catch {
    return [];
  }
}

// fewer moves first, on a tie the earlier game wins
function compareResults(a, b) {
  return a.moves - b.moves || a.date - b.date;
}

export function getTopResults() {
  return readResults().sort(compareResults).slice(0, TOP_LIMIT);
}

export function saveResult(moves) {
  const results = [...readResults(), { moves, date: Date.now() }]
    .sort(compareResults)
    .slice(0, TOP_LIMIT);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // storage is unavailable (private mode, quota): the game still works
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

export function createLeaderboardContent() {
  const results = getTopResults();

  if (results.length === 0) {
    return el("p", { className: "modal__text", text: "Пока нет результатов" });
  }

  const head = el("thead", {}, [
    el("tr", {}, [
      el("th", { text: "Место", attrs: { scope: "col" } }),
      el("th", { text: "Ходы", attrs: { scope: "col" } }),
      el("th", { text: "Дата", attrs: { scope: "col" } }),
    ]),
  ]);

  const body = el(
    "tbody",
    {},
    results.map((result, index) =>
      el("tr", {}, [
        el("td", { text: String(index + 1) }),
        el("td", { text: String(result.moves) }),
        el("td", { text: formatDate(result.date) }),
      ]),
    ),
  );

  return el("table", { className: "leaderboard" }, [head, body]);
}
