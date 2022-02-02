window.onload = () => {
  const cardsTitle = document.querySelectorAll(".card");
  console.log(cardsTitle);
  cardsTitle.forEach((item) => {
    ["mouseenter", "mouseleave"].forEach((eventType) => {
      item.addEventListener(eventType, (event) => {
        toggleElementClass(event.target, "hover");
      });
    });
  });
};

function toggleElementClass(element = "", className = "") {
  element.classList.toggle(className);
}
