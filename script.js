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
let resultFlag = false;

buttons.addEventListener('click', setDisplay);
equalsBtn.addEventListener('click', calculate);

/****  END GLOBAL SCOPE *****/

function setDisplay(event) {
    const target = event.target;
    const value = target.getAttribute('data-value');

    // set values for only displayable charactors/symbols
    if (displayables.includes(value)) {
      // first remove results styles for display for a fresh new entry of operations
      if (resultFlag) {
        display.classList.remove('bold');
        resultFlag = false;
        operand1 = String(result);
      }
      // set operand1 if the operator is not yet clicked or when operand1 is empty
      else if (digits.includes(value) && (operator === '' || operand1 === '')) {
        // if equals is pressed, set operand1 to the recent result
          operand1 += value;
          display.textContent += value;
          console.log(operand1);
      }

      // capture valid operators after getting operand1
      if (operators.includes(value) && operand1 !== '') {
        operator = value;
        display.textContent += value; 
      } else if (digits.includes(value) && operator !== '') {
        // set operand2 after the operator is clicked
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
  // clear the variables for other calculations
  operator = '';
  operand1 = '';
  operand2 = '';
}
