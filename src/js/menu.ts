import { $ } from "./utils";

const menu = $("#menu");
const arrow = $("#arrow");

document.addEventListener("click", (event) => {
	const target = event.target as Element;
	if (target.closest("#arrow")) {
		menu.style.display = "grid";
		return;
	}

	const isClickInsideMenu = menu.contains(target) || arrow.contains(target);

	if (!isClickInsideMenu) {
		menu.style.display = "none";
	}
});
