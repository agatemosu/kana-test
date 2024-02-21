const menu = document.getElementById("menu");
const arrow = document.getElementById("arrow");

document.addEventListener("click", function (event) {
  if (!arrow.contains(event.target)) {
    menu.style.display = "none";
  }
});

arrow.addEventListener("click", function () {
  menu.style.display = "grid";
});
