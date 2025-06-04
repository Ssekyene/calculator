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
        return Error("Math Error: Cannot divide by zero");
    }
    return a / b;
}


function operate(operator, operand1, operand2) {
  // parse the strings to there relative numbers
  const a = +operand1;
  const b = +operand2;
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
            return Error("Syntax Error: Unknown operation");
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

    if (displayables.includes(value)) {
      
      // assign operand1 previous results if they exist
      if (resultFlag) {
        resultFlag = false;
        display.classList.remove('bold');
        operand1 = String(result);
        display.textContent = operand1;
      }
      // signals for a sign flag if the first input of operand1
      if (operand1 === '' && (value === '+' || value === '-')) {
        signFlag = true; // on
      }
      if (digits.includes(value) && operator === '' && operand2 == '') {
        operand1 += value;
      } else if (operators.includes(value) && operator === '' && operand2 === '') {
        if (signFlag) {
          signFlag = false; // off
            operand1 += value;
        }
        else {
          operator += value;
        }
      } else {
        operand2 += value;
      }
      display.textContent += value;
    }

    
}

function calculate (event) {
  resultFlag = true;
  result = operate(operator, operand1, operand2);
  display.classList.add('bold');
  if (Number.isNaN(result) || result instanceof Error) {
    if (result instanceof Error) {
      display.textContent = result.message;
    } else {
      display.textContent = 'Syntax Error!';

    }
  } else {
    display.textContent = result;
  }
  // incase of an error, reset the result to default
  if (typeof result === 'number' && !Number.isNaN(result)) {
    appendResults();
  } else {
    // reset the results
    result = 0;
  }
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