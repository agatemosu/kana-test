let sessionCounter = 0;
let totalCounter = localStorage.getItem('totalCounter') || 0;

const hiragana = [
    "あ", "い", "う", "え", "お",
    "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ",
    "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の",
    "は", "ひ", "ふ", "へ", "ほ",
    "ま", "み", "む", "め", "も",
    "や",       "ゆ",       "よ",
    "ら", "り", "る", "れ", "ろ",
    "わ",                   "を",
    "ん"
];

const romaji = [
    "a",  "i",   "u",   "e",  "o",
    "ka", "ki",  "ku",  "ke", "ko",
    "sa", "shi", "su",  "se", "so",
    "ta", "chi", "tsu", "te", "to",
    "na", "ni",  "nu",  "ne", "no",
    "ha", "hi",  "fu",  "he", "ho",
    "ma", "mi",  "mu",  "me", "mo",
    "ya",        "yu",        "yo",
    "ra", "ri",  "ru",  "re", "ro",
    "wa",                     "wo",
    "n"
];

const sessionCounterElement = document.getElementById('session-counter');
const totalCounterElement = document.getElementById('total-counter');
const kanaCharacterElement = document.getElementById('kana-character');
const optionsElement = document.getElementById('options');

function updateCounters() {
    sessionCounterElement.textContent = sessionCounter;
    totalCounterElement.textContent = totalCounter;
}

function handleAnswer(isCorrect, optionElement) {
    if (!optionElement.classList.contains('incorrect')) {
        if (isCorrect === correctRomaji) {
            sessionCounter++;
            totalCounter++;

            localStorage.setItem('totalCounter', totalCounter);
            updateCounters();

            setTimeout(nextCharacter, 0);
        } else {
            optionElement.classList.add('incorrect');
        }
    }
}

function createOptionElement(option) {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.textContent = option;
    optionElement.onclick = () => handleAnswer(option, optionElement);
    return optionElement;
}

function nextCharacter() {
    const randomIndex = Math.floor(Math.random() * hiragana.length);
    const randomCharacter = hiragana[randomIndex];
    correctRomaji = romaji[randomIndex];

    optionsElement.innerHTML = '';

    const incorrectAnswers = [];
    while (incorrectAnswers.length < 9) {
        const randomIncorrectIndex = Math.floor(Math.random() * romaji.length);
        const randomIncorrectRomaji = romaji[randomIncorrectIndex];

        if (randomIncorrectRomaji !== correctRomaji && !incorrectAnswers.includes(randomIncorrectRomaji)) {
            incorrectAnswers.push(randomIncorrectRomaji);
        }
    }

    const romajiOptions = [correctRomaji, ...incorrectAnswers];
    romajiOptions.sort(() => Math.random() - 0.5);

    kanaCharacterElement.textContent = randomCharacter;

    romajiOptions.forEach(option => {
        const optionElement = createOptionElement(option);
        optionsElement.appendChild(optionElement);
    });
}

updateCounters();
nextCharacter();
