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

function modulus(a, b) {
  if (b === 0) {
    return Error('Math Error: Cannot divide by zero');
  }
  return a % b;
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
        case '%':
          return modulus(a, b);
        default:
            return Error("Syntax Error: Unknown operation");
    }
}

/****  GLOBAL SCOPE *****/

// Defaults
let operand1 = '';
let operand2 = '';
let operator = '';
let result = 0;
let previousValues = {
  operand1,
  operator,
  operand2, 
};
let previousResult = true; // display initialise with a 0 
let resultFlag = false;
let signFlag = false; // off
let updateResultsFlag = false; // off
let deleteFlag = false; // off

// Costants
const DISPLAYABLES = '0123456789.+-*/%';
const DIGITS = '.0123456789';
const OPERATORS = '+-*/ %';

// DOM elements
const buttons = document.querySelector('.buttons');
const display = document.querySelector('#display');
const equalsBtn = document.querySelector('#equals-btn');
const resultSection = document.querySelector('#results');
const clearBtn = document.querySelector('#all-clear');
const undoBtn = document.querySelector('#undo-btn');
const delBtn = document.querySelector('#del');

display.classList.add('bold');

buttons.addEventListener('click', getClickInput);
equalsBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clearAllData);
undoBtn.addEventListener('click', undoOperation);
delBtn.addEventListener('click', clearCurrentOperation);

window.addEventListener('keydown', getKeyboardInput);

/****  END GLOBAL SCOPE *****/

function clearCurrentOperation (e) {
  deleteFlag = true;
  // store current values for undo incase
  previousValues.operand1 = operand1;
  previousValues.operator = operator;
  previousValues.operand2 = operand2;
  // delete all the current values
  operand1 = '';
  operator = '';
  operand2 = '';
  
  display.textContent = '';
}

function undoOperation(e) {
  // undo the whole display if there was a previous calculation
  if (updateResultsFlag || resultFlag || deleteFlag) {
    display.classList.remove('bold');
    display.textContent = '';
    // undo a previous calculation update which happens when more than two operands
    // are to be calculated in a row without pressing equals
    if (updateResultsFlag) {
      updateResultsFlag = false; // put it off after use
      retrivePreviousValues();
      display.textContent = `${operand1}${operator}${operand2}`;
    } else if (resultFlag) {
      resultFlag = false; // put it off after use
      displayPreviousWorking();
    } else if (deleteFlag) {
      deleteFlag = false;
      retrivePreviousValues();
      let operatorSign = operator === '%'? ' mod ' : operator;
      display.textContent = `${operand1}${operatorSign}${operand2}`;
    }
  }
  // undo one charactor at a time
  else {
    if (operand2 !== '') {
      // slice off operand2
      operand2 = operand2.slice(0, -1);
      removeFromDisplay();
    } else if (operator !== '') {
      // remove the operator
      operator = '';
      removeFromDisplay();
    } else if (operand1 !== '') {
      // slice off operand1
      operand1 = operand1.slice(0, -1);
      removeFromDisplay();
    } else {
      // remove any other displayed text such as the error messages
      removeFromDisplay();
    }
  }
}


function retrivePreviousValues() {
  operand1 = previousValues.operand1;
  operator = previousValues.operator;
  operand2 = previousValues.operand2;
}

function displayPreviousWorking() {
  const previousWorking = resultSection.children[0].children[0].textContent;
  resultSection.removeChild(resultSection.children[0]);
  let workingArr = previousWorking.split('');
  let len = workingArr.length;
  for (let i=0; i < len; i++) {
    // if ' mod ' exists, replace its first charactor with % and skip the rest 
    if (workingArr[i] === ' ' && workingArr[i+1] === 'm') {
      workingArr[i] = '%';
      setDisplay(workingArr[i]);
      i = i+4;
    } else {
      setDisplay(workingArr[i]);
    }

  }
}


function removeFromDisplay() {
  if (display.textContent === '') {
    // if there is any previous results, toggle the result flag on
    if(resultSection.children[0]) {
      resultFlag = true;
    } else {
      display.classList.add('bold');
      display.textContent = '0';

    }
  } else {
    const text = display.textContent;
    const charactors = text.split('');
    let len = charactors.length;
    // checking the last two charactors to check for ' mod '
    if (charactors[len-1] === ' ' && charactors[len-2] === 'd') {
      // undo 5 charactors of ' mod '
      for (let i=0; i<5; i++) {
        charactors.pop();
      }
    } else {
      // undo one charactor
      charactors.pop();
    }
    const newText = charactors.join('');
    display.textContent = newText;
  }
}

// captures the click input variables
function getClickInput(event) {
    const target = event.target;
    let value = target.getAttribute('data-value');
    setDisplay(value);
}


// caputures the keyboard input variables
function getKeyboardInput(event) {
  // console.log(event.key)
  const value = event.key;
  if (value === 'Enter')
    calculate();
  else if (value === 'Escape')
    clearAllData();
  else if (value === ' ')
    undoOperation();
  else
    setDisplay(value);
}

// stores operands and the operator while displaying them on the screen
function setDisplay(value) {
  if (DISPLAYABLES.includes(value)) {
      // remove result styles if any
      display.classList.remove('bold');

      if (display.textContent === '0' && operand1 === '')
        display.textContent = '';
      // assign operand1 previous results if they exist
      if (resultFlag) {
        resultFlag = false;
        operand1 = String(result);
        result = 0; // reset to default
        display.textContent = operand1;
      }

      if (updateResultsFlag)
        updateResultsFlag = false;
      if (deleteFlag)
        deleteFlag = false;


      // clear the display box incase a button other than an operator is pressed
      // to do a fresh input of operands and the operator
      if (previousResult && !OPERATORS.includes(value) && result === 0 && operator === '') {
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
      if (DIGITS.includes(value) && operator === '' && operand2 == '') {
          operand1 += value;
      } 
      // if the value is an operator consider two situations down
      else if (OPERATORS.includes(value) && operator === '' && operand2 === '') {
        if (signFlag) {
          signFlag = false; // off
            operand1 += value;
        }
        else {
          operator = value;
          if (value === '%') value = ' mod ';
        }
      }
      // deal with operand2 after the operator is captured (not empty)
      else if (operator !== '') {

        // incase the next pressed button is an operator and operand2 is already
        // captured, refresh with answers to the previous two operands and continue
        // with that
        if (OPERATORS.includes(value) && operand2 !== '') {
          let opt = value;
          // replace the value to act as operand1 in case its a valid answer from the
          // previous calculation
          value = updateResults();
          // for a valid answer
          if (value) {
            operand1 = value;
            operator = opt;
            if (opt === '%') opt = ' mod ';
            value += opt;
          }
        } else {
          operand2 += value;
        }
      }
      // append the pressed button values to display
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
  // validate the result from the calculation
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


// updates the calculation with the result of the previous two
// operands before calculating the third operand and appends
// returns the result for display and continued operation
function updateResults() {
  updateResultsFlag = true;
  // store previous values for undo operation
  previousValues.operand1 = operand1;
  previousValues.operator = operator;
  previousValues.operand2 = operand2;

  result = operate(operator, operand1, operand2);
  // clear previous values for new calcultions
  operand1 = '';
  operand2 = '';
  operator = '';
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
  // check for ' mod ' operator
  let operatorSign = operator === '%'? ' mod ' : operator;
  working.textContent = `${operand1}${operatorSign}${operand2}`;
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
function clearAllData(e) {
  operand1 = '';
  operand2 = '';
  operator = '';
  result = 0;
  resultFlag = false;
  signFlag = false; // off
  updateResultsFlag = false; // off
  previousResult = true;

  display.classList.add('bold');
  display.textContent = '0';
  resultSection.textContent = '';
}