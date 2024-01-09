import { getQuote } from "./quotefetch.js";

let quoteBody = document.getElementById("quoteText");
let quoteAuthor = document.getElementById("authorText");
let checkButton = document.getElementById("checkButton");
let victoryModal = document.getElementById("victoryModal");
let timeTaken = document.getElementById("timeTaken");
let answerChecks = document.getElementById("answerChecks");
let restartButton = document.getElementById("restartButton");
let quote;
let modifiedQuote = "";
let wipQuote = "";
let author;
let modifiedAuthor = "";
let numberChecks = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let quoteArray = [];
let authorArray = [];
let authorUppers = [];
let quoteUppers = [];
let lettersUsed = [];
let solvedLetters = [];
let correctQuoteIndicies = [];
let correctAuthorIndicies = [];
let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
let changeAlphabet = [];
let checkAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
let replacements = [];
let data;
let zCheck = false;

fetchQuote();
let timerInterval = setInterval(updateTimer, 1000);
checkButton.addEventListener("click", checkAnswer);
restartButton.addEventListener("click", restartProgram)

//this is the main function of the program. It calles the fetchQuote function that was imported,
//gets the quote & author, then calles the cryptoquote function to make it into a puzzle
async function fetchQuote() {
  data = await getQuote();
  console.log(data);
  quote = data.content;
  for (let i = 0; i < quote.length; i++) {
    if (quote[i] == quote[i].toUpperCase() && /[a-zA-Z]/.test(quote[i]))
      quoteUppers.push(i);
  }
  quote = quote.toLowerCase();
  author = data.author;
  for (let i = 0; i < author.length; i++) {
    if (author[i] == author[i].toUpperCase() && /[a-zA-Z]/.test(author[i]))
      authorUppers.push(i);
  }
  author = author.toLowerCase();

  scrambleAlphabet();
  cryptoquote();
  createInputs();
  createAlphabetInputs();

}

function scrambleAlphabet() {
  changeAlphabet = [];
  //This for loop randomizes the alphabet so each letter corresponds with a different random letter
  for (let i = 0; i < 26; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * alphabet.length);
    } while (alphabet[randomIndex] == checkAlphabet[i] && i != 25);

    const randomLetter = alphabet[randomIndex];
    changeAlphabet.push(randomLetter);
    alphabet.splice(randomIndex, 1);
  }
}

function createInputs(){
  for (let i = 0; i < quote.length; i++) {
    const span = document.createElement("span");
    if (quoteUppers.includes(i)) {
      span.textContent = modifiedQuote[i].toUpperCase();
    } else {
      span.textContent = modifiedQuote[i];
    }
    span.id = "quote" + i;
    if (/[a-zA-Z]/.test(span.textContent)) {
      span.setAttribute("isLetter", "true");
      span.addEventListener("click", spanClick);
    }
    quoteArray[i] = modifiedQuote[i];
    quoteBody.appendChild(span);
  }

  for (let i = 0; i < author.length; i++) {
    const span = document.createElement("span");
    if (authorUppers.includes(i)) {
      span.textContent = modifiedAuthor[i].toUpperCase();
    } else {
      span.textContent = modifiedAuthor[i];
    }
    span.id = "author" + i;
    if (/[a-zA-Z]/.test(span.textContent)) {
      span.setAttribute("isLetter", "true");
      span.addEventListener("click", spanClick);
    }
    authorArray[i] = modifiedAuthor[i];
    quoteAuthor.appendChild(span);
  }
}

function cryptoquote() {

  for (let a = 0; a < quote.length; a++) {
    if (/[a-zA-Z]/.test(quote[a])) {
      let random = checkAlphabet.indexOf(quote[a]);
      modifiedQuote += changeAlphabet[random];
    } else {
      modifiedQuote += quote[a];
    }
  }
  wipQuote = modifiedQuote;
  for (let a = 0; a < author.length; a++) {
    if (/[a-zA-Z]/.test(author[a])) {
      let random = checkAlphabet.indexOf(author[a]);
      modifiedAuthor += changeAlphabet[random];
    } else {
      modifiedAuthor += author[a];
    }
  }

  if (zCheck) cryptoquote();
}

function updateTimer() {
  seconds++;
  if (seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
          minutes = 0;
          hours++;
      }
  }
  console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
}



const findIndices = (arr, target) => {
  return arr.reduce((indices, element, index) => {
    if (element === target) {
      indices.push(index);
    }
    return indices;
  }, []);
};



function updateQuote(event) {
  const letterChange = event.target.value.toLowerCase();
  const letterOriginal = event.target.getAttribute("name");

  // If the input is empty, revert the letter to its original value
  if (!letterChange) {
    const index = replacements.findIndex((pair) => pair[0] === letterOriginal);
    if (index !== -1) {
      replacements.splice(index, 1);
      const quoteIndicies = findIndices(quoteArray, letterOriginal);
      for (let i = 0; i < quoteIndicies.length; i++) {
        let span = document.getElementById("quote" + quoteIndicies[i]);
        if (quoteUppers.includes(quoteIndicies[i])) {
          span.innerText = letterOriginal.toUpperCase();
        } else {
          span.innerText = letterOriginal;
        }
        span.className = "";
      }
      const authorIndicies = findIndices(authorArray, letterOriginal);
      for (let i = 0; i < authorIndicies.length; i++) {
        let span = document.getElementById("author" + authorIndicies[i]);
        if (authorUppers.includes(authorIndicies[i])) {
          span.innerText = letterOriginal.toUpperCase();
        } else {
          span.innerText = letterOriginal;
        }
        span.className = "";
      }
    }
  } else {
    // Update the replacements array
    const foundIndex = replacements.findIndex(
      (pair) => pair[0] === letterOriginal
    );
    if (foundIndex !== -1) {
      replacements[foundIndex][1] = letterChange;
    } else {
      replacements.push([letterOriginal, letterChange]);
    }
  }

  // Create a function to apply styling to the displayed quote
  const applyStyling = (quote) => {
    // Loop through replacements and apply styling to changed letters
    replacements.forEach((pair) => {
      const originalLetter = pair[0];
      const newLetter = pair[1];

      const quoteIndicies = findIndices(quoteArray, originalLetter);

      for (let i = 0; i < quoteIndicies.length; i++) {
        let span = document.getElementById("quote" + quoteIndicies[i]);
        if (quoteUppers.includes(quoteIndicies[i])) {
          span.innerText = newLetter.toUpperCase();
        } else {
          span.innerText = newLetter;
        }
        if (!correctQuoteIndicies.includes(quoteIndicies[i])){
          span.className = "redText";
        }
      }

      const authorIndicies = findIndices(authorArray, originalLetter);

      for (let i = 0; i < authorIndicies.length; i++) {
        let span = document.getElementById("author" + authorIndicies[i]); 
        if (span.className == 'greenText') {}
        if (authorUppers.includes(authorIndicies[i])) {
          span.innerText = newLetter.toUpperCase();
        } else {
          span.innerText = newLetter;
        }
        if (!correctAuthorIndicies.includes(authorIndicies[i])){
          span.className = "redText";
        }
      }
    });
  };

  applyStyling(modifiedQuote);

}

function findLetters(str) {
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/[a-zA-Z]/.test(char)) {
      // If the character is a letter, add it to the letters array
      if (!lettersUsed.includes(char.toLowerCase())) {
        // Checking if the letter (in lowercase) is not already present in the array
        lettersUsed.push(char.toLowerCase());
      }
    }
  }
}

function createAlphabetInputs() {
  const letterInputsContainer = document.getElementById("letterInputs");
  findLetters(modifiedQuote);
  findLetters(modifiedAuthor);
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // Get the ASCII character code for letters
    if (lettersUsed.includes(letter.toLowerCase())) {
      const inputDiv = document.createElement("div");
      inputDiv.classList.add("col", "mb-3");

      const label = document.createElement("label");
      label.setAttribute("for", `letter${letter}`);
      label.setAttribute("id", `label${letter}`);
      label.textContent = letter;
      label.className = "inputText";

      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("id", `letter${letter}`);
      input.setAttribute("name", letter.toLowerCase());
      input.setAttribute("maxlength", "1");
      input.className = "alphabetInput";
      input.addEventListener("input", updateQuote);

      inputDiv.appendChild(label);
      inputDiv.appendChild(input);
      letterInputsContainer.appendChild(inputDiv);
    }
  }
}

function spanClick(event) {
  const span = event.target;
  const spanText = event.target.textContent.toUpperCase();
  let input = document.getElementById("letter" + spanText);
  if (span.getAttribute("isLetter"))input.select();
}

function checkAnswer() {
  console.log(changeAlphabet, checkAlphabet);
  console.log(replacements);
  const modal = new bootstrap.Modal(victoryModal);
  modal.show();
  
  timeTaken.textContent = (`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

  
  for (let i = 0; i < replacements.length; i++) {
    const letterO = replacements[i][0];
    const letterR = replacements[i][1];
    const authorIndicies = findIndices(authorArray, letterO);
    const quoteIndicies = findIndices(quoteArray, letterO);
    console.log(quoteArray);
    console.log(quoteIndicies);
    const check = checkAlphabet.indexOf(letterR);
    const check2 = changeAlphabet.indexOf(letterO);
    if (check == check2 && !solvedLetters.includes(letterR)) {
      const input = document.getElementById(`letter${letterO.toUpperCase()}`);
      const label = document.getElementById(`label${letterO.toUpperCase()}`);
      input.remove();
      label.remove();
      // input.className = "alphabetInputCorrect";
      
      console.log("The letter " + letterR + " equaling the letter " + letterO + " is correct");
      
      for (let i = 0; i < quoteIndicies.length; i++) {
        console.log(quoteIndicies[i]);
        let span = document.getElementById("quote" + quoteIndicies[i]);
        span.removeAttribute("isLetter");
        span.className = "greenText";
        correctQuoteIndicies.push(quoteIndicies[i]);
      }
      for (let i = 0; i < authorIndicies.length; i++) {
        let span = document.getElementById("author" + authorIndicies[i]);
        span.removeAttribute("isLetter");
        span.className = "greenText";
        correctAuthorIndicies.push(authorIndicies[i]);
      }
      solvedLetters.push(letterR);
      // This if statement is ran if the player gets every letter correct
      if (solvedLetters.length == lettersUsed.length){
        const modal = new bootstrap.Modal(victoryModal);
        modal.show();
      }else{
      }
    }
  }
  numberChecks++;
  answerChecks.textContent = numberChecks;
  // timeTaken.textContent = (`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
}

function restartProgram(){
  alert("clicked");
  quoteBody.removeChild(quoteBody.firstChild);
  quoteAuthor.innerHTML = '';
  data = '';
  seconds = 0;
  minutes = 0;
  hours = 0;
  numberChecks = 0;
  authorUppers = [];
  quote = '';
  quoteUppers = [];
  lettersUsed = [];
  solvedLetters = [];
  correctQuoteIndicies = [];
  correctAuthorIndicies = [];
  fetchQuote();
}