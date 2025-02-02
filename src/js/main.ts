import { type KanaEntry, dakuon, seion, yoon } from "./kana";
import { $ } from "./utils";
import "./menu";

// Variables
const SEION = 1;
const DAKUON = 2;
const YOON = 4;

let sessionCounter = 0;
let totalCounter = Number.parseInt(localStorage.getItem("totalCounter") ?? "0");
let enabledOptions = SEION;
let previousIndex: number;
let currentCategory: number;

type KanaPair = { kana: string; romaji: string };

// Elements
const els = {
	sessionCounter: $("#session-counter"),
	totalCounter: $("#total-counter"),
	kanaCharacter: $("#kana-character"),
	options: $("#options"),
	seionCheckbox: $("#seion-checkbox"),
	dakuonCheckbox: $("#dakuon-checkbox"),
	yoonCheckbox: $("#yoon-checkbox"),
};
const isHiragana = $("[data-syllabary]").dataset.syllabary === "hiragana";

// Event listeners
els.seionCheckbox.addEventListener("change", () => toggleOption(SEION));
els.dakuonCheckbox.addEventListener("change", () => toggleOption(DAKUON));
els.yoonCheckbox.addEventListener("change", () => toggleOption(YOON));

function toggleOption(option: number) {
	// Toggle the option
	enabledOptions ^= option;
	nextCharacter();
}

function extractKana(kanaSet: KanaEntry[]): KanaPair[] {
	return kanaSet.map(([hiragana, katakana, romaji]) => {
		return { kana: isHiragana ? hiragana : katakana, romaji };
	});
}

function getKanaArray() {
	const selectedKana: KanaPair[] = [];

	if (enabledOptions & YOON) selectedKana.push(...extractKana(yoon));
	if (enabledOptions & DAKUON) selectedKana.push(...extractKana(dakuon));
	if (enabledOptions & SEION || selectedKana.length === 0) {
		selectedKana.push(...extractKana(seion));
	}

	return selectedKana;
}

function updateCounters() {
	els.sessionCounter.textContent = sessionCounter.toString();
	els.totalCounter.textContent = totalCounter.toString();
}

function handleAnswer(
	selectedOption: string,
	optionElement: Element,
	correctRomaji: string,
) {
	if (optionElement.classList.contains("incorrect")) return;

	if (selectedOption !== correctRomaji) {
		optionElement.classList.add("incorrect");
		return;
	}

	sessionCounter++;
	totalCounter++;

	localStorage.setItem("totalCounter", totalCounter.toString());
	updateCounters();

	// Maybe add a transition?
	setTimeout(nextCharacter, 0);
}

function createOptionElement(option: string, correctRomaji: string) {
	const optionElement = document.createElement("div");
	optionElement.classList.add("option");
	optionElement.textContent = option;
	optionElement.onclick = () => {
		handleAnswer(option, optionElement, correctRomaji);
	};
	return optionElement;
}

function getRandomCharIndex(maxLength: number) {
	let charIndex: number;
	do {
		charIndex = Math.floor(Math.random() * maxLength);
	} while (charIndex === previousIndex);
	previousIndex = charIndex;
	return charIndex;
}

function getCategoryForKana(kana: string) {
	if (kana.length === 2) {
		return YOON;
	}

	const normalizedKana = kana.normalize("NFD");
	return normalizedKana.length === 2 ? DAKUON : SEION;
}

function generateAnswers(correctRomaji: string, kanaArray: KanaPair[]) {
	const incorrectAnswers = [correctRomaji];
	const allRomaji = kanaArray
		.filter(({ kana }) => getCategoryForKana(kana) === currentCategory)
		.map(({ romaji }) => romaji);

	while (incorrectAnswers.length < 9) {
		const randomIndex = Math.floor(Math.random() * allRomaji.length);
		const randomRomaji = allRomaji[randomIndex];

		if (!incorrectAnswers.includes(randomRomaji)) {
			incorrectAnswers.push(randomRomaji);
		}
	}

	return incorrectAnswers.sort(() => Math.random() - 0.5);
}

function nextCharacter() {
	while (els.options.childElementCount > 0) {
		els.options.firstChild?.remove();
	}

	const kanaArray = getKanaArray();
	const charIndex = getRandomCharIndex(kanaArray.length);

	const { kana, romaji } = kanaArray[charIndex];

	currentCategory = getCategoryForKana(kana);
	const romajiOptions = generateAnswers(romaji, kanaArray);

	els.kanaCharacter.textContent = kana;

	for (const option of romajiOptions) {
		const optionElement = createOptionElement(option, romaji);
		els.options.appendChild(optionElement);
	}
}

updateCounters();
nextCharacter();
