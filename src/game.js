import { TILES } from "./cards.js";
import { el } from "./dom.js";
import { shuffle } from "./shuffle.js";

export const PAIRS_TOTAL = TILES.length;

function createCard(tile) {
  const back = el("span", { className: "card__face card__face--back" });
  const front = el("span", { className: "card__face card__face--front" }, [
    el("img", {
      className: "card__image",
      attrs: { src: tile.src, alt: "", draggable: "false" },
    }),
  ]);

  return el(
    "button",
    {
      className: "card",
      attrs: { type: "button", "aria-label": "Закрытая карточка" },
    },
    [el("span", { className: "card__inner" }, [back, front])],
  );
}

export function createGame({ onChange }) {
  const board = el("div", { className: "board" });

  function start() {
    const deck = shuffle([...TILES, ...TILES]);
    board.replaceChildren(...deck.map(createCard));
    onChange({ moves: 0, pairs: 0 });
  }

  return { element: board, start };
}
