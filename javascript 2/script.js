let cart = [];
const TAX_RATE = 0.18;
let discountPercent = 0; // Stores current discount

// Example discount codes
const discountCodes = {
    "ELLEVEN": 11,
    "ELLEVEN&10": 21,
    "ELLEVEN&20": 31
};

function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }

  updateCartDisplay();
  calculateBill();
}

function updateQuantity(productName, newQty) {
  const item = cart.find(i => i.name === productName);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(productName);
    } else {
      item.quantity = newQty;
    }
    updateCartDisplay();
    calculateBill();
  }
}

function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  updateCartDisplay();
  calculateBill();
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  let cartHTML = '';
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    cartHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <span>
          <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.name}', this.value)">
          = ₹${itemTotal}
          <button onclick="removeFromCart('${item.name}')">❌</button>
        </span>
      </div>
    `;
  });

  cartItemsDiv.innerHTML = cartHTML;
}

// Apply discount code
function applyDiscount() {
  const code = document.getElementById('discount-code').value.trim().toUpperCase();
  const msg = document.getElementById('discount-msg');

  if (discountCodes[code]) {
    discountPercent = discountCodes[code];
    msg.textContent = `🎉 Discount applied: ${discountPercent}% off!`;
    msg.style.color = "green";
  } else {
    discountPercent = 0;
    msg.textContent = "❌ Invalid discount code";
    msg.style.color = "red";
  }

  calculateBill();
}

function calculateBill() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;

  const tax = subtotalAfterDiscount * TAX_RATE;
  const total = subtotalAfterDiscount + tax;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('total').textContent = total.toFixed(2);
}

function clearCart() {
  cart = [];
  discountPercent = 0;
  document.getElementById('discount-code').value = '';
  document.getElementById('discount-msg').textContent = '';
  updateCartDisplay();
  calculateBill();
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const total = document.getElementById('total').textContent;
  alert(`✅ Thank you for shopping! Total: ₹${total}`);
  clearCart();
}


// Initialize
updateCartDisplay();
calculateBill();
