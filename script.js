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

// initialisations
let operand1 = '';
let operand2 = '';
let operator = '';
let result = 0;
let previousResult = true; // display initialise with a 0 
let resultFlag = false;
let signFlag = false; // off
const displayables = '0123456789.+-*/%';
const digits = '0123456789';
const operators = '+-*/';

// DOM elements
const buttons = document.querySelector('.buttons');
const display = document.querySelector('#display');
const equalsBtn = document.querySelector('#equals-btn');
const resultSection = document.querySelector('#results');
const clearBtn = document.querySelector('#all-clear');

display.classList.add('bold');

buttons.addEventListener('click', setDisplay);
equalsBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clearData);

/****  END GLOBAL SCOPE *****/

// makes a screen display for the buttons being places
// and captures the input variables
function setDisplay(event) {
    const target = event.target;
    let value = target.getAttribute('data-value');

    if (displayables.includes(value)) {
      // remove result styles if any
      display.classList.remove('bold');
      // assign operand1 previous results if they exist
      if (resultFlag) {
        resultFlag = false;
        operand1 = String(result);
        result = 0; // reset to default
        display.textContent = operand1;
      }
      // clear the display box incase a button other than an operator is pressed
      // to do a fresh input of operands and the operator
      if (previousResult && !operators.includes(value) && result === 0 && operator === '') {
        operand1 = '';
        display.textContent = '';
        previousResult = false;
      }


      // signals for a sign flag if the first input of operand1 is a plus or minus sign
      if (operand1 === '' && (value === '+' || value === '-')) {
        signFlag = true; // on
      }
      // fill in for operand1 if the value is a digit
      // while the operator and operand2 variables are empty
      if (digits.includes(value) && operator === '' && operand2 == '') {
          operand1 += value;
      } 
      // if the value is an operator consider two situations down
      else if (operators.includes(value) && operator === '' && operand2 === '') {
        if (signFlag) {
          signFlag = false; // off
            operand1 += value;
        }
        else {
          operator += value;
        }
      } else {
        if (operators.includes(value) && operand2 !== '') {
          const opt = value;
          value = updateResults();
          if (value) {
            operand1 = value;
            operator = opt;
            value += opt;
          }
        } else {
          operand2 += value;
        }
      }
      display.textContent += value;
    }

    
}

// makes a calculation when equals sign button is pressed
function calculate () {
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
  // validate the result
  if (typeof result === 'number' && !Number.isNaN(result)) {
    appendResults();
  } 
  // incase of an error, reset the result to default
  else {
    result = 0;
  }
  // reset the variables for other calculations
  operator = '';
  operand1 = '';
  operand2 = '';
  previousResult = true;
}


function updateResults() {
  result = operate(operator, operand1, operand2);
  display.classList.add('bold');
  if (Number.isNaN(result) || result instanceof Error) {
    if (result instanceof Error) {
      display.textContent = result.message;
      return '';
    } else {
      display.textContent = 'Syntax Error!';
      return '';

    }
  } else {
    display.textContent = '';
  }
  
  operand2 = '';
  operator = '';
  return result;
}


// append previous result history above the display box
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

// resets everything back to default
function clearData(e) {
  operand1 = '';
  operand2 = '';
  operator = '';
  result = 0;
  resultFlag = false;
  signFlag = false; // off
  previousResult = true;

  display.classList.add('bold');
  display.textContent = '0';
  resultSection.textContent = '';
}