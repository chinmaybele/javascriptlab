function calculateGrade() {
  let marks = parseInt(document.getElementById("marks").value);
  let result = document.getElementById("result");

  if (isNaN(marks) || marks < 0 || marks > 100) {
    result.innerHTML = "❌ Please enter valid marks (0 - 100).";
    result.style.color = "red";
    return;
  }

  let grade;
  if (marks >= 50 && marks <= 65) {
    grade = "C";
  } else if (marks >= 66 && marks <= 80) {
    grade = "B";
  } else if (marks >= 81 && marks <= 90) {
    grade = "A";
  } else if (marks > 90) {
    grade = "A+";
  } else {
    grade = "Fail";
  }

  result.innerHTML = `✅ Your Grade: <span style="color:#0077cc">${grade}</span>`;
}
