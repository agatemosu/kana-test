import {
  standardHiragana,
  standardKatakana,
  standardRomaji,
  dakuonHiragana,
  dakuonKatakana,
  dakuonRomaji,
  comboHiragana,
  comboKatakana,
  comboRomaji,
} from "./kana.js";

let sessionCounter = 0;
let totalCounter = localStorage.getItem("totalCounter") || 0;
let previousIndex = -1;

const sessionCounterElement = document.getElementById("session-counter");
const totalCounterElement = document.getElementById("total-counter");
const kanaCharacterElement = document.getElementById("kana-character");
const optionsElement = document.getElementById("options");

const syllabary = document
  .querySelector("[data-syllabary]")
  .getAttribute("data-syllabary");

const standardCheckbox = document.getElementById("standard-checkbox");
const dakuonCheckbox = document.getElementById("dakuon-checkbox");
const comboCheckbox = document.getElementById("combo-checkbox");

let enabledOptions = 1; // 1 (binary 001) means only standard is enabled

const STANDARD = 1; // binary 001
const DAKUON = 2; // binary 010
const COMBO = 4; // binary 100

standardCheckbox.addEventListener("change", () => toggleOption(STANDARD));
dakuonCheckbox.addEventListener("change", () => toggleOption(DAKUON));
comboCheckbox.addEventListener("change", () => toggleOption(COMBO));

function toggleOption(option) {
  if (enabledOptions & option) {
    // if option is enabled, disable it
    enabledOptions ^= option;
  } else {
    // if option is disabled, enable it
    enabledOptions |= option;
  }
  nextCharacter();
}

function getKanaArray() {
  let selectedKana = [];
  if (syllabary === "hiragana") {
    if (enabledOptions & COMBO) {
      selectedKana = selectedKana.concat(comboHiragana);
    }
    if (enabledOptions & DAKUON) {
      selectedKana = selectedKana.concat(dakuonHiragana);
    }
    if (enabledOptions & STANDARD || selectedKana.length === 0) {
      selectedKana = selectedKana.concat(standardHiragana);
    }
  } else if (syllabary === "katakana") {
    if (enabledOptions & COMBO) {
      selectedKana = selectedKana.concat(comboKatakana);
    }
    if (enabledOptions & DAKUON) {
      selectedKana = selectedKana.concat(dakuonKatakana);
    }
    if (enabledOptions & STANDARD || selectedKana.length === 0) {
      selectedKana = selectedKana.concat(standardKatakana);
    }
  }
  return selectedKana;
}

function updateCounters() {
  sessionCounterElement.textContent = sessionCounter;
  totalCounterElement.textContent = totalCounter;
}

function handleAnswer(selectedOption, optionElement, correctRomaji) {
  if (!optionElement.classList.contains("incorrect")) {
    if (selectedOption === correctRomaji) {
      sessionCounter++;
      totalCounter++;

      localStorage.setItem("totalCounter", totalCounter);
      updateCounters();

      // Maybe add a transition?
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
  const kanaArray = getKanaArray();
  const charIndex = getRandomCharIndex(kanaArray.length);
  let correctAnswerCategory;

  let romajiArray = [];

  if (enabledOptions & COMBO) {
    [romajiArray, correctAnswerCategory] = handleOption(
      COMBO,
      comboRomaji,
      romajiArray,
      charIndex,
      correctAnswerCategory
    );
  }

  if (enabledOptions & DAKUON && correctAnswerCategory === undefined) {
    [romajiArray, correctAnswerCategory] = handleOption(
      DAKUON,
      dakuonRomaji,
      romajiArray,
      charIndex,
      correctAnswerCategory
    );
  }

  if (
    (enabledOptions & STANDARD || romajiArray.length === 0) &&
    correctAnswerCategory === undefined
  ) {
    [romajiArray, correctAnswerCategory] = handleOption(
      STANDARD,
      standardRomaji,
      romajiArray,
      charIndex,
      correctAnswerCategory
    );
  }

  const randomCharacter = kanaArray[charIndex];
  const correctRomaji = romajiArray[charIndex];

  optionsElement.innerHTML = "";

  const incorrectAnswers = generateIncorrectAnswers(
    correctRomaji,
    correctAnswerCategory
  );

  const romajiOptions = [correctRomaji, ...incorrectAnswers];
  romajiOptions.sort(() => Math.random() - 0.5);

  kanaCharacterElement.textContent = randomCharacter;

  romajiOptions.forEach((option) => {
    const optionElement = createOptionElement(option, correctRomaji);
    optionsElement.appendChild(optionElement);
  });
}

function getRandomCharIndex(maxLength) {
  let charIndex = Math.floor(Math.random() * maxLength);
  while (charIndex === previousIndex) {
    charIndex = Math.floor(Math.random() * maxLength);
  }
  previousIndex = charIndex;
  return charIndex;
}

function handleOption(
  optionType,
  optionArray,
  romajiArray,
  charIndex,
  correctAnswerCategory
) {
  romajiArray = romajiArray.concat(optionArray);
  if (charIndex < romajiArray.length) {
    correctAnswerCategory = optionType;
  }
  return [romajiArray, correctAnswerCategory];
}

function generateIncorrectAnswers(correctRomaji, correctAnswerCategory) {
  const categoryRomaji = getCategoryRomaji(correctAnswerCategory);
  const incorrectAnswers = [];

  while (incorrectAnswers.length < 9) {
    const randomIncorrectIndex = Math.floor(
      Math.random() * categoryRomaji.length
    );
    const randomIncorrectRomaji = categoryRomaji[randomIncorrectIndex];

    if (
      randomIncorrectRomaji !== correctRomaji &&
      !incorrectAnswers.includes(randomIncorrectRomaji)
    ) {
      incorrectAnswers.push(randomIncorrectRomaji);
    }
  }

  return incorrectAnswers;
}

function getCategoryRomaji(correctAnswerCategory) {
  switch (correctAnswerCategory) {
    case STANDARD:
      return standardRomaji;
    case DAKUON:
      return dakuonRomaji;
    case COMBO:
      return comboRomaji;
    default:
      return standardRomaji;
  }
}

updateCounters();
nextCharacter();
