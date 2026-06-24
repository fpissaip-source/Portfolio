export default function setSplitText() {
  document.querySelectorAll<HTMLElement>(".para, .title").forEach((element) => element.classList.add("visible"));
}
