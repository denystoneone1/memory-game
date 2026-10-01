import { el } from "./dom.js";

const SCROLL_LOCK_CLASS = "is-scroll-locked";

let modalCount = 0;

// Shared modal shell: title, content and actions are passed on every open,
// the "Закрыть" button is always added last
export function createModal() {
  modalCount += 1;
  const titleId = `modal-title-${modalCount}`;

  const title = el("h2", { className: "modal__title", attrs: { id: titleId } });
  const body = el("div", { className: "modal__body" });
  const actions = el("div", { className: "modal__actions" });
  const closeButton = el("button", {
    className: "button",
    text: "Закрыть",
    attrs: { type: "button" },
  });

  const dialog = el(
    "dialog",
    { className: "modal", attrs: { "aria-labelledby": titleId } },
    [el("div", { className: "modal__content" }, [title, body, actions])],
  );

  function close() {
    if (dialog.open) dialog.close();
  }

  function open({ heading, content = [], buttons = [] }) {
    title.textContent = heading;
    body.replaceChildren(...content);
    actions.replaceChildren(...buttons, closeButton);
    document.body.classList.add(SCROLL_LOCK_CLASS);
    dialog.showModal();
  }

  closeButton.addEventListener("click", close);

  // the dialog has no padding, so a click lands on it only outside the content;
  // pressing inside and releasing on the backdrop must not close it
  let pressedOnBackdrop = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (pressedOnBackdrop && event.target === dialog) close();
  });

  // fires for every way of closing, including Escape
  dialog.addEventListener("close", () => {
    document.body.classList.remove(SCROLL_LOCK_CLASS);
  });

  document.body.append(dialog);

  return { open, close };
}
