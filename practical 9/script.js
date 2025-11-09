// ================== THEME SWITCHER FUNCTIONALITY ==================

// Toggle between light and dark theme
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains("dark");

  if (isDark) {
    body.classList.replace("dark", "light");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.replace("light", "dark");
    localStorage.setItem("theme", "dark");
  }

  // Optional: Add a quick animation on toggle
  const btn = document.getElementById("theme-btn");
  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 200);
}

// Apply saved theme on page load
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.classList.add(savedTheme);
  } else {
    document.body.classList.add("light"); // default theme
  }

  document.getElementById("theme-btn").addEventListener("click", toggleTheme);
};
