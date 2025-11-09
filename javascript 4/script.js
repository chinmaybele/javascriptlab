document.addEventListener('DOMContentLoaded', () => {
  const numInput = document.getElementById('numInput');
  const reverseBtn = document.getElementById('reverseBtn');
  const checkBtn = document.getElementById('checkBtn');
  const steps = document.getElementById('steps');
  const result = document.getElementById('result');

  // Function to reverse a number
  function reverseNumber(n) {
    let reversed = 0;
    let original = n;
    steps.innerHTML = ""; // clear visualization

    while (n > 0) {
      let digit = n % 10;
      reversed = reversed * 10 + digit;
      n = Math.floor(n / 10);

      // Visualize digits
      const digitBox = document.createElement("div");
      digitBox.className = "digit";
      digitBox.style.animationDelay = `${steps.childElementCount * 0.1}s`;
      digitBox.textContent = digit;
      steps.appendChild(digitBox);
    }

    return reversed;
  }

  // Event: Reverse number
  reverseBtn.addEventListener('click', () => {
    const val = parseInt(numInput.value.trim(), 10);
    if (isNaN(val)) {
      result.className = "result fail";
      result.textContent = "⚠️ Please enter a valid number!";
      return;
    }
    const rev = reverseNumber(val);
    result.className = "result";
    result.textContent = `Reversed Number: ${rev}`;
  });

  // Event: Check palindrome
  checkBtn.addEventListener('click', () => {
    const val = parseInt(numInput.value.trim(), 10);
    if (isNaN(val)) {
      result.className = "result fail";
      result.textContent = "⚠️ Please enter a valid number!";
      return;
    }
    const rev = reverseNumber(val);
    if (rev === val) {
      result.className = "result success";
      result.textContent = `✅ ${val} is a Palindrome!`;
    } else {
      result.className = "result fail";
      result.textContent = `❌ ${val} is NOT a Palindrome (Reversed: ${rev}).`;
    }
  });
});
