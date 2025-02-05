import { $ } from "./utils";

const menu = $("#menu");
const arrow = $("#arrow");

const hiddenClass = "option-menu--hidden";

document.addEventListener("click", (event) => {
	const target = event.target as Element;
	if (target.closest("#arrow")) {
		menu.classList.remove(hiddenClass);
		return;
	}

	const isClickInsideMenu = menu.contains(target) || arrow.contains(target);

	if (!isClickInsideMenu) {
		menu.classList.add(hiddenClass);
	}
});
