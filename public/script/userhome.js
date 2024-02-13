const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");
if (bar) {
  bar.addEventListener("focus", () => {
    nav.classList.add("active");
  });
}
if (close) {
    close.addEventListener("focus", () => {
      nav.classList.remove("active");
    });
  }
