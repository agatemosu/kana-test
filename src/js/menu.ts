const menu = document.getElementById("menu");
const arrow = document.getElementById("arrow");

document.addEventListener("click", function (event) {
  const isClickInsideMenu =
    menu?.contains(event.target as Node) ||
    arrow?.contains(event.target as Node);

  if (!isClickInsideMenu) {
    menu!.style.display = "none";
  }
});

arrow?.addEventListener("click", function () {
  menu!.style.display = "grid";
});
