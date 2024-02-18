import { hiragana, katakana, romaji } from "./kana.js";

let sessionCounter = 0;
let totalCounter = localStorage.getItem("totalCounter") || 0;

const sessionCounterElement = document.getElementById("session-counter");
const totalCounterElement = document.getElementById("total-counter");
const kanaCharacterElement = document.getElementById("kana-character");
const optionsElement = document.getElementById("options");

const syllabary = document
  .querySelector("[data-syllabary]")
  .getAttribute("data-syllabary");

if (syllabary === "hiragana") var kana = hiragana;
if (syllabary === "katakana") var kana = katakana;

function updateCounters() {
  sessionCounterElement.textContent = sessionCounter;
  totalCounterElement.textContent = totalCounter;
}

function handleAnswer(isCorrect, optionElement, correctRomaji) {
  if (!optionElement.classList.contains("incorrect")) {
    if (isCorrect === correctRomaji) {
      sessionCounter++;
      totalCounter++;

      localStorage.setItem("totalCounter", totalCounter);
      updateCounters();

      setTimeout(nextCharacter, 0);
    } else {
      optionElement.classList.add("incorrect");
    }
  }
}

function createOptionElement(option, correctRomaji) {
  const optionElement = document.createElement("div");
  optionElement.classList.add("option");
  optionElement.textContent = option;
  optionElement.onclick = () => {
    handleAnswer(option, optionElement, correctRomaji);
  };
  return optionElement;
}

function nextCharacter() {
  const randomIndex = Math.floor(Math.random() * kana.length);
  const randomCharacter = kana[randomIndex];
  const correctRomaji = romaji[randomIndex];

  optionsElement.innerHTML = "";

  const incorrectAnswers = [];
  while (incorrectAnswers.length < 9) {
    const randomIncorrectIndex = Math.floor(Math.random() * romaji.length);
    const randomIncorrectRomaji = romaji[randomIncorrectIndex];

    if (
      randomIncorrectRomaji !== correctRomaji &&
      !incorrectAnswers.includes(randomIncorrectRomaji)
    ) {
      incorrectAnswers.push(randomIncorrectRomaji);
    }
  }

  const romajiOptions = [correctRomaji, ...incorrectAnswers];
  romajiOptions.sort(() => Math.random() - 0.5);

  kanaCharacterElement.textContent = randomCharacter;

  romajiOptions.forEach((option) => {
    const optionElement = createOptionElement(option, correctRomaji);
    optionsElement.appendChild(optionElement);
  });
}

updateCounters();
nextCharacter();
