import { TILES } from "./cards.js";
import { el } from "./dom.js";
import { shuffle } from "./shuffle.js";

export const PAIRS_TOTAL = TILES.length;
const MISMATCH_DELAY = 1000;

const CLOSED_LABEL = "Закрытая карточка";

function createCardElement(tile) {
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
      attrs: { type: "button", "aria-label": CLOSED_LABEL },
    },
    [el("span", { className: "card__inner" }, [back, front])],
  );
}

function openCard(card) {
  card.isOpen = true;
  card.element.classList.add("card--open");
  card.element.setAttribute("aria-label", card.tile.name);
}

function closeCard(card) {
  card.isOpen = false;
  card.element.classList.remove("card--open");
  card.element.setAttribute("aria-label", CLOSED_LABEL);
}

function markMatched(card) {
  card.isMatched = true;
  card.element.classList.add("card--matched");
}

export function createGame({ onChange, onWin }) {
  const board = el("div", { className: "board" });

  let opened = [];
  let moves = 0;
  let pairs = 0;
  let isLocked = false;

  function notify() {
    onChange({ moves, pairs });
  }

  // while a mismatched pair is visible the board ignores clicks
  function closeMismatched() {
    isLocked = true;
    setTimeout(() => {
      opened.forEach(closeCard);
      opened = [];
      isLocked = false;
    }, MISMATCH_DELAY);
  }

  function handleCardClick(card) {
    if (isLocked || card.isOpen || card.isMatched) return;

    openCard(card);
    opened.push(card);
    if (opened.length < 2) return;

    moves += 1;
    const [first, second] = opened;
    if (first.tile.id === second.tile.id) {
      markMatched(first);
      markMatched(second);
      pairs += 1;
      opened = [];
    } else {
      closeMismatched();
    }
    notify();

    if (pairs === PAIRS_TOTAL) onWin({ moves });
  }

  function createCard(tile) {
    const card = {
      tile,
      element: createCardElement(tile),
      isOpen: false,
      isMatched: false,
    };
    card.element.addEventListener("click", () => handleCardClick(card));
    return card;
  }

  function start() {
    const deck = shuffle([...TILES, ...TILES]).map(createCard);
    opened = [];
    moves = 0;
    pairs = 0;
    board.replaceChildren(...deck.map((card) => card.element));
    notify();
  }

  return { element: board, start };
}
