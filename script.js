function add(a, b) {
    return a + b;
}


function subtract(a, b) {
    return a - b;
}


function multiply(a, b) {
    return a * b;
}


function divide(a, b) {
    if (b === 0) {
        return ("Math Error: Cannot divide by zero");
    }
    return a / b;
}


function operate(operator, operand1, operand2) {
  const a = parseFloat(operand1);
  const b = parseFloat(operand2);
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return "Syntax Error: Unknown operation";
    }
}

/****  GLOBAL SCOPE *****/
let operand1 = '';
let operand2 = '';
let operator = '';
let result = 0;
const displayables = '0123456789.+-*/%';
const digits = '0123456789';
const operators = '+-*/';
const buttons = document.querySelector('.buttons');
const display = document.querySelector('#display');
const equalsBtn = document.querySelector('#equals-btn');
const resultSection = document.querySelector('#results');
let resultFlag = false;
let signFlag = false; // off

buttons.addEventListener('click', setDisplay);
equalsBtn.addEventListener('click', calculate);

/****  END GLOBAL SCOPE *****/

function setDisplay(event) {
    const target = event.target;
    const value = target.getAttribute('data-value');

    // set values for only displayable charactors/symbols
    if (displayables.includes(value)) {
      // if equals is pressed, set operand1 to the recent result
      if (resultFlag) {
        // first remove results styles for display for a fresh new entry of operations
        display.classList.remove('bold');
        resultFlag = false;
        operand1 = String(result);
      }
      // set operand1 if the operator is not yet caputured or when operand1 is empty
      else if (digits.includes(value) && (operator === '' || operand1 === '')) {
          // operand is captured as an accumulating string
          operand1 += value;
          display.textContent += value;
      }

      // capture valid operators after getting operand1 and no operator is captured yet
      if (operators.includes(value) && operand1 !== '' && operator === '') {
        operator = value;
        display.textContent += value; 
      } else if (digits.includes(value) && operator !== '') {
        // set operand2 after the operator is caputured
        // operand is captured as an accumulating string
        operand2 += value;
        display.textContent += value;
      }
    }
}

function calculate (event) {
  resultFlag = true;
  result = operate(operator, operand1, operand2);
  display.classList.add('bold');
  display.textContent = result;
  // incase of an error, reset the result to default
  if (typeof result !== 'number') result = 0;
  appendResults();
  // clear the variables for other calculations
  operator = '';
  operand1 = '';
  operand2 = '';
}

function appendResults () {
  const resultBox = document.createElement('div');
  resultBox.classList.add('result-box', 'box');
  const working = document.createElement('span');
  const equals = document.createElement('span');
  const answer = document.createElement('span');
  working.id = 'working';
  working.textContent = `${operand1}${operator}${operand2}`;
  equals.id = 'equals';
  equals.textContent = '=';
  answer.id = 'answer';
  answer.textContent = `${result}`;

  resultBox.appendChild(working);
  resultBox.appendChild(equals);
  resultBox.appendChild(answer);

  resultSection.insertBefore(resultBox, resultSection.children[0]);
}