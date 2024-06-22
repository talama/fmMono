window.addEventListener("load", () => {
  const buttons = document.querySelectorAll(
    "button[aria-expanded][aria-controls]"
  );
  buttons.forEach((btn) => {
    if (btn.getAttribute("aria-expanded") === "true") {
      const content = document.getElementById(
        btn.getAttribute("aria-controls")
      );
      content.style.gridTemplateRows = "1fr";
    }
    setUp(btn);
  });
});

function setUp(btn) {
  btn.addEventListener("click", () => {
    const content = document.getElementById(btn.getAttribute("aria-controls"));
    if (btn.getAttribute("aria-expanded") === "false") {
      content.style.gridTemplateRows = "1fr";
      btn.setAttribute("aria-expanded", "true");
    } else {
      content.style.gridTemplateRows = "0fr";
      btn.setAttribute("aria-expanded", false);
    }
  });
}
