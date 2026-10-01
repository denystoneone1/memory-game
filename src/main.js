import "./style.css";
import { el } from "./dom.js";
import { createGame, PAIRS_TOTAL } from "./game.js";

const newGameButton = el("button", {
  className: "button button--primary",
  text: "Новая игра",
  attrs: { type: "button" },
});
const leaderboardButton = el("button", {
  className: "button",
  text: "Таблица лидеров",
  attrs: { type: "button" },
});

const header = el("header", { className: "header" }, [
  el("h1", { className: "header__title", text: "Memory Game" }),
  el("div", { className: "header__actions" }, [
    newGameButton,
    leaderboardButton,
  ]),
]);

const movesValue = el("span", { className: "stats__value" });
const pairsValue = el("span", {
  className: "stats__value stats__value--pairs",
});

const stats = el("div", { className: "stats" }, [
  el("p", { className: "stats__item" }, ["Ходы: ", movesValue]),
  el("p", { className: "stats__item" }, ["Пары: ", pairsValue]),
]);

function renderStats({ moves, pairs }) {
  movesValue.textContent = String(moves);
  pairsValue.textContent = `${pairs} из ${PAIRS_TOTAL}`;
}

const game = createGame({ onChange: renderStats });

document.body.append(
  header,
  el("main", { className: "main" }, [stats, game.element]),
);

game.start();
