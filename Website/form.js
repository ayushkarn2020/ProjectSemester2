function renderSummary() {
  let summaryEl = document.getElementById('summary-items');
  let totalEl = document.getElementById('summary-total');
  if (!summaryEl) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p style="color:#888">No items in cart</p>';
    totalEl.textContent = '₹0';
    return;
  }

  let total = 0;
  summaryEl.innerHTML = '';

  cart.forEach(item => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    summaryEl.innerHTML += `
      <div class="summary-item">
        <img src="${item.img}" alt="${item.name}" class="cart-img">
        <div>
          <p style="font-size:0.9rem"><strong>${item.name}</strong></p>
          <p style="font-size:0.85rem; color:#888">Qty: ${item.qty} &nbsp;|&nbsp; ₹${itemTotal}</p>
        </div>
      </div>`;
  });

  totalEl.textContent = '₹' + total.toLocaleString();
}

// payment option toggle
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', function() {
    document.getElementById('upi-field').style.display = 'none';
    document.getElementById('card-field').style.display = 'none';
    if (this.value === 'upi') document.getElementById('upi-field').style.display = 'block';
    if (this.value === 'card') document.getElementById('card-field').style.display = 'block';
  });
});

function placeOrder() {
  let name = document.getElementById('fullname').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let email = document.getElementById('email').value.trim();
  let address = document.getElementById('address').value.trim();
  let city = document.getElementById('city').value.trim();
  let pincode = document.getElementById('pincode').value.trim();

  if (!name || !phone || !email || !address || !city || !pincode) {
    alert('Please fill in all delivery details');
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  let payment = document.querySelector('input[name="payment"]:checked').value;

  if (payment === 'upi' && !document.getElementById('upi').value.trim()) {
    alert('Please enter your UPI ID');
    return;
  }
  if (payment === 'card') {
    if (!document.getElementById('cardnum').value.trim() ||
        !document.getElementById('expiry').value.trim() ||
        !document.getElementById('cvv').value.trim()) {
      alert('Please fill in card details');
      return;
    }
  }

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let orderId = 1000 + orders.length + 1;
  let date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  orders.push({
    id: orderId,
    items: cart,
    date,
    status: 'Pending',
    customer: { name, phone, email, address, city, pincode, payment }
  });

  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('cart', JSON.stringify([]));

  alert('Order placed! Thank you, ' + name);
  window.location.href = 'order.html';
}