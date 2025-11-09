function validateEmail() {
  const email = document.getElementById("emailInput").value.trim();
  const output = document.getElementById("output");
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  if (pattern.test(email)) {
    const [user, domain] = email.split("@");
    output.innerHTML = `
      ✅ <strong style="color:#007BFF;">Valid Email</strong><br>
      <span style="color:#555;">Username:</span> ${user}<br>
      <span style="color:#007BFF;">Domain:</span> ${domain}
    `;
  } else {
    output.innerHTML = "❌ <strong style='color:red;'>Invalid Email Format</strong>";
  }
}
