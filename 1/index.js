document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');
    const historyList = document.getElementById('history-list');

    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');
    const clearHistoryButton = document.getElementById('clear-history');

    const numberFormatSelect = document.getElementById('number-format');
    const angleModeSelect = document.getElementById('angle-mode');

    let memory = 0;
    let undoStack = [];
    let redoStack = [];
    let calcHistory = [];

    function saveState() {
        localStorage.setItem('calcMemory', memory);
        localStorage.setItem('calcHistory', JSON.stringify(calcHistory));
        localStorage.setItem('calcNumberFormat', numberFormatSelect.value);
    }

    function loadState() {
        const storedMemory = localStorage.getItem('calcMemory');
        if (storedMemory !== null) {
            memory = parseFloat(storedMemory);
        }
        const storedHistory = localStorage.getItem('calcHistory');
        if (storedHistory !== null) {
            calcHistory = JSON.parse(storedHistory);
            calcHistory.forEach(item => {
                createHistoryItem(item.expr, item.res);
            });
        }
        const storedNumberFormat = localStorage.getItem('calcNumberFormat');
        if (storedNumberFormat) {
            numberFormatSelect.value = storedNumberFormat;
        }
    }
    loadState();

    function pushUndoState() {
        undoStack.push(display.value);
        redoStack = [];
    }

    function createHistoryItem(expr, res) {
        const li = document.createElement('li');
        li.textContent = expr + " = " + res;
        li.classList.add("cursor-pointer", "hover:bg-gray-100", "p-1", "rounded");
        li.addEventListener('click', function () {
            pushUndoState();
            display.value = expr;
        });
        historyList.appendChild(li);
    }

    function addToHistory(expr, res) {
        calcHistory.push({ expr: expr, res: res });
        saveState();
        createHistoryItem(expr, res);
    }

    function formatResult(result) {
        if (numberFormatSelect.value === 'fixed') {
            return Number(result).toFixed(2);
        }
        return result;
    }

    numberFormatSelect.addEventListener('change', function () {
        saveState();
    });

    let angleMode = angleModeSelect.value;
    function updateTrigFunctions() {
        if (angleMode === 'degrees') {
            math.import({
                sin: x => math.sin(x * math.pi / 180),
                cos: x => math.cos(x * math.pi / 180),
                tan: x => math.tan(x * math.pi / 180)
            }, { override: true });
        } else {
            math.import({
                sin: math.sin,
                cos: math.cos,
                tan: math.tan
            }, { override: true });
        }
    }
    updateTrigFunctions();
    angleModeSelect.addEventListener('change', function () {
        angleMode = angleModeSelect.value;
        updateTrigFunctions();
    });

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            if (this.id === 'clear') {
                pushUndoState();
                display.value = '';
            } else if (this.id === 'equals') {
                calculate();
            } else if (
                this.id === 'm-plus' || this.id === 'm-minus' ||
                this.id === 'm-recall' || this.id === 'm-clear' ||
                this.id === 'undo' || this.id === 'redo' ||
                this.id === 'derivative' || this.id === 'integral' || this.id === 'solve'
            ) {
                return;
            } else {
                pushUndoState();
                display.value += value;
            }
        });
    });

    const mPlusButton = document.getElementById('m-plus');
    const mMinusButton = document.getElementById('m-minus');
    const mRecallButton = document.getElementById('m-recall');
    const mClearButton = document.getElementById('m-clear');

    mPlusButton.addEventListener('click', function () {
        if (display.value !== "") {
            let current = parseFloat(display.value);
            if (!isNaN(current)) {
                memory += current;
                saveState();
            }
        }
    });
    mMinusButton.addEventListener('click', function () {
        if (display.value !== "") {
            let current = parseFloat(display.value);
            if (!isNaN(current)) {
                memory -= current;
                saveState();
            }
        }
    });
    mRecallButton.addEventListener('click', function () {
        pushUndoState();
        display.value = memory;
    });
    mClearButton.addEventListener('click', function () {
        memory = 0;
        saveState();
    });

    clearHistoryButton.addEventListener('click', function () {
        calcHistory = [];
        localStorage.removeItem('calcHistory');
        historyList.innerHTML = '';
    });

    historyList.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === "LI") {
            pushUndoState();
            let expr = e.target.textContent.split('=')[0].trim();
            display.value = expr;
        }
    });

    undoButton.addEventListener('click', function () {
        if (undoStack.length > 0) {
            redoStack.push(display.value);
            display.value = undoStack.pop();
        }
    });
    redoButton.addEventListener('click', function () {
        if (redoStack.length > 0) {
            undoStack.push(display.value);
            display.value = redoStack.pop();
        }
    });

    document.addEventListener('keydown', function (event) {
        const key = event.key;
        if ((key >= '0' && key <= '9') || key === '.' || key === '+' || key === '-' ||
            key === '*' || key === '/' || key === '(' || key === ')') {
            pushUndoState();
            display.value += key;
            event.preventDefault();
        } else if (key === 'Enter') {
            calculate();
            event.preventDefault();
        } else if (key === 'Backspace') {
            pushUndoState();
            display.value = display.value.slice(0, -1);
            event.preventDefault();
        } else if (key === 'Escape' || key === 'Delete') {
            pushUndoState();
            display.value = '';
            event.preventDefault();
        }
    });

    function calculate() {
        try {
            const originalExpression = display.value;
            let expression = display.value;
            expression = expression.replace(/(\d+(\.\d+)?)\s*mod\s*(\d+(\.\d+)?)/g, "mod($1,$3)");
            expression = expression.replace(/√/g, 'sqrt');
            expression = expression.replace(/log\(/g, 'log10(');
            expression = expression.replace(/∛/g, 'cbrt');
            let result = math.evaluate(expression);
            if (result === Infinity || result === -Infinity) {
                throw new Error('Division par zéro non autorisée');
            }
            result = formatResult(result);
            display.value = result;
            addToHistory(originalExpression, result);
        } catch (error) {
            display.value = "Erreur: " + error.message;
        }
    }

    const derivativeButton = document.getElementById('derivative');
    derivativeButton.addEventListener('click', function () {
        let expr = display.value;
        try {
            let derivativeResult = math.derivative(expr, 'x').toString();
            addToHistory("d/dx(" + expr + ")", derivativeResult);
            display.value = derivativeResult;
        } catch (error) {
            display.value = "Erreur: " + error.message;
        }
    });

    const integralButton = document.getElementById('integral');
    integralButton.addEventListener('click', function () {
        let expr = display.value;
        try {
            let integralResult = Algebrite.run("integral(" + expr + ", x)");
            addToHistory("∫(" + expr + ")", integralResult);
            display.value = integralResult;
        } catch (error) {
            display.value = "Erreur: " + error.message;
        }
    });

    const solveButton = document.getElementById('solve');
    solveButton.addEventListener('click', function () {
        let eq = display.value;
        try {
            if (!eq.includes("=")) {
                throw new Error("The equation must contain an equals sign");
            }
            let sides = eq.split("=");
            let left = sides[0];
            let right = sides[1];
            let equationToSolve = "(" + left + ")-(" + right + ")";
            let solutions = Algebrite.run("roots(" + equationToSolve + ")");
            addToHistory(eq, solutions);
            display.value = solutions;
        } catch (error) {
            display.value = "Erreur: " + error.message;
        }
    });

    saveState();
});
