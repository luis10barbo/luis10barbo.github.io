window.onload = () => {
  const body = document.querySelector("body");
  // Left Menu Functions

  const leftMenuNode = document.querySelector("#left-menu");
  const lightModeButtonNode = document.querySelector("#night-mode-button");
  const lightModeIcon = lightModeButtonNode.querySelector("i");
  document.querySelector("#left-menu-switch").addEventListener("click", () => {
    leftMenuNode.classList.toggle("open");
  });

  lightModeButtonNode.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    lightModeIcon.classList.toggle("bxs-moon");
    lightModeIcon.classList.toggle("bxs-sun");
  });
};
