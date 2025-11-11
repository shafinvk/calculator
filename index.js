const display = document.getElementById("display");
let justCalculated = false;

// ✅ Append numbers or operators safely
function appendToDisplay(input) {
  const lastChar = display.value.slice(-1);

  // Clear display if last action was a calculation and next is a number
  if (justCalculated && /[0-9.]/.test(input)) {
    display.value = "";
    justCalculated = false;
  } else if (justCalculated && /[+\-*/x]/.test(input)) {
    justCalculated = false;
  }

  // Prevent multiple consecutive operators or decimals
  if (/[+\-*/x.]/.test(lastChar) && /[+\-*/x.]/.test(input)) {
    return;
  }

  display.value += input;
  autoScrollDisplay();
}

// ✅ Clear the entire display
function clearDisplay() {
  display.value = "";
  justCalculated = false;
}

// ✅ Delete the last character
function backspace() {
  display.value = display.value.slice(0, -1);
  autoScrollDisplay();
}

// ✅ Safely evaluate the expression
function calculate() {
  try {
    let expression = display.value.replace(/x/g, "*");

    // Validate: only allow numbers, operators, decimals, and parentheses
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
      display.value = "Error";
      return;
    }

    // Use Function() safely instead of eval()
    let result = Function('"use strict"; return (' + expression + ")")();

    // Handle invalid or infinite results
    if (isNaN(result) || !isFinite(result)) {
      display.value = "Error";
      return;
    }

    // Round floating-point errors
    display.value = Math.round(result * 100000) / 100000;

    justCalculated = true;
    autoScrollDisplay();
  } catch (error) {
    display.value = "Error";
  }
}

// ✅ Auto-scroll display when content overflows
function autoScrollDisplay() {
  display.scrollLeft = display.scrollWidth;
}

// ✅ Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/[0-9+\-*/.]/.test(key)) {
    appendToDisplay(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  }
});
