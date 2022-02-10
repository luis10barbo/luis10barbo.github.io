window.onload = () => {
  const leftMenuNode = document.querySelector("#left-menu");
  document.querySelector("#left-menu-switch").addEventListener("click", () => {
    leftMenuNode.classList.toggle("closed");
  });
};
