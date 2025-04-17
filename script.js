// === Element References ===
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator button');

const historyBox = document.getElementById('history-box');
const historyList = document.getElementById('history-list');
const toggleHistoryBtn = document.getElementById('toggle-history');
const wrapper = document.getElementById('calc-wrapper');

const themeToggle = document.getElementById('theme-toggle');
const themeOptions = document.querySelector('.theme-options');
const themeBtn = document.querySelectorAll('.theme-btn');

// === State Variables ===
let justEva = false; // Tracks if the last action was an evaluation
let history = []; // Stores calculation history 

// === Theme Toggle UI Logic ===
themeToggle.addEventListener('click', () => {
    themeOptions.classList.toggle('hidden');
});

// Handle theme selection and apply the selected theme
themeBtn.forEach(button => {
    button.addEventListener('click', () =>{
        const theme = button.dataset.theme;
        applyTheme(theme);
        themeOptions.classList.add('hidden'); // Hide options after selection
    });
});

// Toggle calculator history panel visibility
toggleHistoryBtn.addEventListener('click', () => {
    historyBox.classList.toggle('show');
    wrapper.classList.toggle('show-history');
});

// Button click handler
buttons.forEach(button => {
    // Skip the history toggle button
    if (button.id === 'toggle-history'){
        return;
    }

    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const isNumber = (val) => !isNaN(val) && val.trim() !== '';

        // Handle error state
        if(display.value === 'Error' || display.value === undefined){
            if(value === 'AC'){
                display.value = '';
                return;
            }

            if(isNumber(value)){
                display.value = value;
                return;
            }

            return;
        }

        // Main operation switch
        switch (value) {
            case 'AC': // Clear display
                display.value = '';
                break;
            case 'DE': // Delete last character
                display.value = display.value.slice(0, -1);
                break;
            case '=': // Evaluate expression
                try {
                    const expression = display.value;
                    const result = eval(expression); // Evaluate expression

                    display.value = result;
                    justEva = true;

                    // Add animation effect
                    display.classList.add('pop');
                    setTimeout(() => display.classList.remove('pop'), 250);

                    // Store to history if result is valid
                    if (result !== 'Error' && result !== 'undefined' && result !== null){
                        history.unshift({expr: expression, result});
                        if (history.length > 10){
                            history.pop(); // Limit history
                        }
                        updateHistory();
                    }
                } catch {
                    display.value = 'Error';
                    justEva = true;
                }
                break;
            default:
                // Append or replace display based on last action
                if (justEva){
                    if(['+', '-', '*', '/'].includes(value)){
                        display.value += value;
                    } else{
                        display.value = value;
                    }
                    justEva = false;
                } else{
                    display.value += value;
                }
        }
    });
});

// === Update History Panel ===
function updateHistory(){
    historyList.innerHTML = ''; // Clear existing items
    history.forEach(item => {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <span class="expr">${item.expr}</span>
            <span class="result">= ${item.result}</span>
        `;

        // Add click handler to re-use history expressions
        li.addEventListener('click', () => {
            if (justEva){
                display.value = item.expr;
                justEva = false;
            } else {
                display.value += item.expr;
            }
        })

        historyList.appendChild(li);
    });
}

// === Apply Selected Theme ===
function applyTheme(theme){
    // Remove existing theme classes
    document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')){
            document.body.classList.remove(cls);
        }
    });
    // Add the selected theme class
    document.body.classList.add(`theme-${theme}`);
}