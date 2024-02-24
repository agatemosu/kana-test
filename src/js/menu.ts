const menu = document.getElementById("menu");
const arrow = document.getElementById("arrow");

document.addEventListener("click", function (event) {
  const isClickInsideMenu =
    menu.contains(event.target) || arrow.contains(event.target);

  if (!isClickInsideMenu) {
    menu.style.display = "none";
  }
});

arrow.addEventListener("click", function () {
  menu.style.display = "grid";
});
