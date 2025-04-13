// DOM elements
const targerNumberEl = document.getElementById("targetNumber");
const scoreEl = document.getElementById("score");
const expressionEl = document.getElementById("expression");
const currentValueEl = document.getElementById("currentValue");
const numberButtonsEl = document.querySelectorAll("#numberButtons button");
const operatorButtonsEl = document.querySelectorAll("#operatorButtons button");
const submitButtonEl = document.getElementById("submitButton");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");

// Game variables
let randomNumber = 0;
let expression = "";
let lastValueDigit = false;
let currentValue = 0;
let totalTime = 30;
let timeLeft = totalTime;
let doubleScore = true;
let score = 0;
let interval = null;

// Function generates random number 0...100
function getRandomNumber() {
  return Math.floor(Math.random() * 101);
}
// function to evaluete the expression
function updateExpression(button) {
  const value = button.dataset.value;

  if (!isNaN(value)) {
    if (lastValueDigit) {
      messageEl.textContent =
        "Invalid input! Please place an operator after a number";
      return;
    } else {
      button.disabled = true;
      button.classList.add("disabled");
      expression += value;
      lastValueDigit = true;
    }
    currentValue = eval(expression);
    currentValueEl.textContent = `=${currentValue}`;
  } else if (value === "+" || value === "-" || value === "*") {
    if (!lastValueDigit) {
      messageEl.textContent =
        "Invalid input! Please enter a number before an operator";
      return;
    } else {
      expression += value;
      lastValueDigit = false;
    }
  }

  expressionEl.textContent = expression;
}

// Function to play round
function playRound() {
  randomNumber = getRandomNumber();
  targerNumberEl.textContent = randomNumber;

  interval = setInterval(() => {
    timeEl.textContent = timeLeft;
    timeLeft--;
    doubleScore = timeLeft >= 15;
    if (timeLeft <= 0) {
      clearInterval(interval);
      finishRound(true);
    }
  }, 1000);
}

function finishRound(timeup = false) {
  if (timeup) {
    messageEl.textContent = "Time is up!";
  } else {
    if (randomNumber === currentValue) {
      score += doubleScore ? 2 : 1;
      scoreEl.textContent = score;
      messageEl.textContent =
        "Correct! you scored " + (doubleScore ? 2 : 1) + "points!";
    } else {
      messageEl.textContent = "Incorrect! No points awarded.";
    }
  }

  resetGame();
}

function resetGame() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  setTimeout(() => {
    let countdown = 5;
    let countdownInterval = setInterval(() => {
      messageEl.innerHTML = `New game starting in ${countdown} seconds...`;
      countdown--;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        messageEl.innerHTML = "";
        playRound();
      }
    }, 1000);
  }, 3000);

  expression = "";
  lastValueDigit = false;
  currentValue = 0;
  timeLeft = totalTime;
  doubleScore = true;
  scoreEl.textContent = score;
  currentValueEl.textContent = "= 0";
  expressionEl.textContent = "";
  numberButtonsEl.forEach((button) => {
    button.disabled = false;
    button.classList.remove("disabled");
  });
}

numberButtonsEl.forEach((button) => {
  button.addEventListener("click", () => {
    updateExpression(button);
  });
});

operatorButtonsEl.forEach((button) => {
  button.addEventListener("click", () => {
    updateExpression(button);
  });
});

submitButtonEl.addEventListener("click", () => {
  finishRound();
});

playRound();