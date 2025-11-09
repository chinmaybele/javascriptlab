// Global variables for Firebase setup (required, even if not used)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

/**
 * Clears an error message and removes the error border.
 * @param {string} fieldId - The ID of the input field.
 * @param {string} errorId - The ID of the error message element.
 */
function clearError(fieldId, errorId) {
    document.getElementById(errorId).textContent = '';
    document.getElementById(fieldId).classList.remove('border-red-500', 'focus:border-red-500');
    document.getElementById(fieldId).classList.add('border-gray-300', 'focus:border-indigo-500');
}

/**
 * Displays an error message and applies an error border.
 * @param {string} fieldId - The ID of the input field.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} message - The error message to display.
 * @returns {boolean} - Returns false (for validation failure).
 */
function setError(fieldId, errorId, message) {
    document.getElementById(errorId).textContent = message;
    document.getElementById(fieldId).classList.remove('border-gray-300', 'focus:border-indigo-500');
    document.getElementById(fieldId).classList.add('border-red-500', 'focus:border-red-500');
    return false;
}

let isNameValid = false;
let isEmailValid = false;
let isAgeValid = false;

window.validateName = function() {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    clearError("name", "nameError");

    if (name === "") {
        isNameValid = setError("name", "nameError", "Name is required.");
    } else if (name.length < 2) {
        isNameValid = setError("name", "nameError", "Name must be at least 2 characters.");
    } else {
        isNameValid = true;
    }
};

window.validateEmail = function() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    clearError("email", "emailError");

    if (email === "") {
        isEmailValid = setError("email", "emailError", "Email is required.");
    } else if (!regex.test(email)) {
        isEmailValid = setError("email", "emailError", "Please enter a valid email address.");
    } else {
        isEmailValid = true;
    }
};

window.validateAge = function() {
    const ageInput = document.getElementById("age");
    const age = parseInt(ageInput.value);
    clearError("age", "ageError");

    if (isNaN(age) || ageInput.value.trim() === "") {
        isAgeValid = setError("age", "ageError", "Age is required.");
    } else if (age < 18 || age > 60) {
        isAgeValid = setError("age", "ageError", "Age must be between 18 and 60 for admission.");
    } else {
        isAgeValid = true;
    }
};

function validateForm(event) {
    event.preventDefault(); // Prevent default browser form submission

    // Re-run all validations on submit
    validateName();
    validateEmail();
    validateAge();

    const formIsValid = isNameValid && isEmailValid && isAgeValid;

    if (formIsValid) {
        // Display success message
        const successMsg = document.getElementById('successMessage');
        successMsg.classList.remove('hidden');
        document.getElementById('admissionForm').reset();
        
        // Hide success message after a delay
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 4000);

        console.log("Form data collected:", {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value
        });
    }

    return formIsValid;
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admissionForm').addEventListener('submit', validateForm);
});