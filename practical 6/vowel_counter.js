function countVowels() {
  const text = document.getElementById("text").value;
  const vowels = text.match(/[aeiouAEIOU]/g);
  const count = vowels ? vowels.length : 0;
  const res = document.getElementById("result");
  res.textContent = `💬 Total vowels: ${count}`;
  res.style.color = "#ff5e62";
  res.style.textShadow = "0 0 8px #ff9966";
}
