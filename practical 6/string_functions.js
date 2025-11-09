function showResult(msg, color = "#ff9966") {
  const res = document.getElementById("result");
  res.textContent = msg;
  res.style.boxShadow = `0 0 15px ${color}`;
}
function splitWords() {
  const text = document.getElementById("textInput").value;
  const words = text.split(/\s+/);
  showResult("🧩 Split Words:\n" + words.join(", "), "#ff9966");
}
function findMatch() {
  const text = document.getElementById("textInput").value;
  const found = text.match(/data/gi);
  showResult(found ? `🔍 Found 'data' ${found.length} time(s)` : "❌ No match found", "#38f9d7");
}
function replaceText() {
  const text = document.getElementById("textInput").value;
  const replaced = text.replace(/is/gi, "was");
  showResult("✏️ After Replace:\n" + replaced, "#ffd700");
}
function findIndex() {
  const text = document.getElementById("textInput").value;
  const index = text.indexOf("the");
  showResult(index !== -1 ? `📍 Index of 'the': ${index}` : "❌ 'the' not found", "#43e97b");
}
