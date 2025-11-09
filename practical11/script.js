// Global variables for Firebase setup (required)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let time = 10;
let timerInterval;
const initialTime = 10;

const timerDisplay = document.getElementById("timer");
const timerLabel = document.getElementById("timerLabel");
const toastArea = document.getElementById("toastArea");

/**
 * Displays a custom toast notification instead of alert().
 * @param {string} message - The message to display.
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-enter p-4 mt-2 rounded-lg shadow-xl bg-green-600 text-white font-semibold pointer-events-auto';
    toast.textContent = message;
    
    toastArea.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-enter-active');
    }, 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('toast-enter-active');
        toast.classList.add('toast-exit-active');
        
        // Remove element from DOM after transition
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 4000);
}

/**
 * The main timer function executed by setInterval.
 */
function runTimer() {
    if (time < 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '0';
        timerLabel.textContent = 'Time Up!';
        timerDisplay.classList.remove('text-indigo-600');
        timerDisplay.classList.add('text-red-500');
        showToast("✅ Class Started! Time for the next period.");
        return;
    }

    timerDisplay.textContent = time;
    
    // Dynamic UI: Change color/scale as time runs low
    if (time <= 3 && time > 0) {
        timerDisplay.classList.remove('text-indigo-600');
        timerDisplay.classList.add('text-red-500', 'animate-pulse');
    } else {
        timerDisplay.classList.remove('text-red-500', 'animate-pulse');
        timerDisplay.classList.add('text-indigo-600');
    }
    
    time--;
}

/**
 * Resets and starts the timer.
 */
function resetTimer() {
    clearInterval(timerInterval);
    time = initialTime;
    timerLabel.textContent = 'Seconds';
    // Ensure styles are reset before starting
    timerDisplay.classList.remove('text-red-500', 'animate-pulse');
    timerDisplay.classList.add('text-indigo-600');
    
    runTimer(); // Initial call to display the start time instantly
    timerInterval = setInterval(runTimer, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start the timer on page load
    resetTimer();
    
    // Attach event listener to the reset button
    document.getElementById('resetButton').addEventListener('click', resetTimer);
});