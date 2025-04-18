/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let pas = 0;
let compte = 0
let wordError=100 ;
let time_table=[];
let timeoutId;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const wpm_results = document.getElementById("results");
const accuracy_result = document.getElementById("accuracy_result");
const mistakes = document.getElementById("mistake");
let  time = document.getElementById("time");
 time.textContent="00";
 let Seconds=60;
 let timer;
 let errorCounter = 0;

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};
 function initTimer(){
    clearTimeout(timeoutId);
    countdown();
 } 

 function countdown() {
    time.textContent= `${Seconds}` // Display the current second
    Seconds--;
  
    if (Seconds >= 0) {
        timeoutId = setTimeout(countdown, 1000); // Call itself after 1 second
        inputField.style.display = "block"
    } else {
        mistakes.textContent= `${errorCounter}`
        time.textContent= 'Fin du test'
        inputField.style.display = "none"
    }
  }
 
// Initialize the typing test
const startTest = (wordCount = 50 ) => {
   
    errorCounter=0;
    pas = 100 / wordCount;
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    timer = null;
    compte = 0;
    mistakes.textContent = "00";
    wordError = 100;
    Seconds=60;
    initTimer();

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    } 

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    inputField.focus();
    results.textContent = "00";
    accuracy_result.textContent = "00%"
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return time

// Move to the next word  and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        const getCurrentStats = () => {
            const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
            const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
            return { wpm: wpm.toFixed(2) };
        };
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;
            const { wpm } = getCurrentStats();
            compte = wpm
            wpm_results.textContent = `${compte}`;
            accuracy_result.textContent = `${wordError}%`;
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
            if(currentWordIndex>wordsToType.length){
                
            }
        } else {
            if (wordError !== 0) {
                wordError -= pas;
            }
            errorCounter++;
            if (!previousEndTime) previousEndTime = startTime;
            const { } = getCurrentStats();
            wpm_results.textContent = `${compte}`;
            accuracy_result.textContent = `${wordError}%`;
            previousEndTime = Date.now();
            highlightNextWord();
            inputField.value = ""; // Clear input field after space
            event.preventDefault();
        }
        wpm_results.textContent = `${compte}`;
        accuracy_result.textContent = `${wordError}%`;
        previousEndTime = Date.now();
        highlightNextWord();
        inputField.value = "";
        event.preventDefault();

    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "blue";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);

});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();