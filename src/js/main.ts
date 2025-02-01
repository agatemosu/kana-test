import { type KanaEntry, dakuon, seion, yoon } from "./kana";
import { $ } from "./utils";
import "./menu";

// Variables
const STANDARD = 1;
const DAKUON = 2;
const COMBO = 4;

let sessionCounter = 0;
let totalCounter = Number.parseInt(localStorage.getItem("totalCounter") ?? "0");
let previousIndex = -1;
let enabledOptions = STANDARD;

type KanaArray = [string, string][];

// Elements
const els = {
	sessionCounter: $("#session-counter"),
	totalCounter: $("#total-counter"),
	kanaCharacter: $("#kana-character"),
	options: $("#options"),
	standardCheckbox: $("#standard-checkbox"),
	dakuonCheckbox: $("#dakuon-checkbox"),
	comboCheckbox: $("#combo-checkbox"),
};
const syllabary = $("[data-syllabary]").dataset.syllabary;

// Event listeners
els.standardCheckbox.addEventListener("change", () => toggleOption(STANDARD));
els.dakuonCheckbox.addEventListener("change", () => toggleOption(DAKUON));
els.comboCheckbox.addEventListener("change", () => toggleOption(COMBO));

function toggleOption(option: number) {
	// Toggle the option
	enabledOptions ^= option;
	nextCharacter();
}

function extractKana(kanaSet: KanaEntry[]): KanaArray {
	return kanaSet.map(([hiragana, katakana, romaji]) => {
		return syllabary === "hiragana" ? [hiragana, romaji] : [katakana, romaji];
	});
}

function getKanaArray() {
	const selectedKana: KanaArray = [];

	if (enabledOptions & COMBO) selectedKana.push(...extractKana(yoon));
	if (enabledOptions & DAKUON) selectedKana.push(...extractKana(dakuon));
	if (enabledOptions & STANDARD || selectedKana.length === 0) {
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
	optionElement: HTMLDivElement,
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

function generateAnswers(correctRomaji: string, kanaArray: KanaArray) {
	const allRomaji = kanaArray.map(([_, romaji]) => romaji);
	const incorrectAnswers: string[] = [];

	while (incorrectAnswers.length < 9) {
		const randomIndex = Math.floor(Math.random() * allRomaji.length);
		const randomRomaji = allRomaji[randomIndex];

		if (
			randomRomaji !== correctRomaji &&
			!incorrectAnswers.includes(randomRomaji)
		) {
			incorrectAnswers.push(randomRomaji);
		}
	}

	return incorrectAnswers;
}

function nextCharacter() {
	while (els.options.childElementCount > 0) {
		els.options.firstChild?.remove();
	}

	const kanaArray = getKanaArray();
	const charIndex = getRandomCharIndex(kanaArray.length);

	const [randomCharacter, correctRomaji] = kanaArray[charIndex];

	const incorrectAnswers = generateAnswers(correctRomaji, kanaArray);

	const romajiOptions = [correctRomaji, ...incorrectAnswers];
	romajiOptions.sort(() => Math.random() - 0.5);

	els.kanaCharacter.textContent = randomCharacter;

	for (const option of romajiOptions) {
		const optionElement = createOptionElement(option, correctRomaji);
		els.options.appendChild(optionElement);
	}
}

updateCounters();
nextCharacter();
