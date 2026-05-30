// cart items stored here
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
  let found = cart.find(item => item.name === name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  saveCart();
  alert(name + ' added to cart!');
}

function renderCart() {
  let tbody = document.getElementById('cart-body');
  let subtotalEl = document.getElementById('subtotal');
  if (!tbody) return;

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#888">Your cart is empty</td></tr>';
    subtotalEl.textContent = '₹0';
    return;
  }

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    tbody.innerHTML += `
      <tr>
        <td><img src="${item.img}" class="cart-img" alt="${item.name}"> ${item.name}</td>
        <td>₹${item.price}</td>
        <td><input type="number" value="${item.qty}" min="1" class="qty-input" onchange="updateQty(${index}, this.value)"></td>
        <td>₹${itemTotal}</td>
        <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
      </tr>`;
  });

  subtotalEl.textContent = '₹' + total.toLocaleString();
}

function updateQty(index, val) {
  cart[index].qty = parseInt(val);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let orderId = 1000 + orders.length + 1;
  let date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  orders.push({ id: orderId, items: cart, date, status: 'Pending' });
  localStorage.setItem('orders', JSON.stringify(orders));

  cart = [];
  saveCart();
  alert('Order placed successfully!');
  window.location.href = 'order.html';
}

function renderOrders() {
  let container = document.getElementById('orders-container');
  if (!container) return;

  let orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (orders.length === 0) {
    container.innerHTML = '<p style="color:#888; text-align:center">No orders yet. Go shop something!</p>';
    return;
  }

  container.innerHTML = '';
  orders.reverse().forEach(order => {
    let itemsHTML = order.items.map(item => `
      <div class="order-body">
        <img src="${item.img}" alt="${item.name}" class="cart-img">
        <div>
          <p><strong>${item.name}</strong></p>
          <p class="price">₹${item.price}</p>
          <p style="font-size:0.85rem; color:#888">Qty: ${item.qty}</p>
        </div>
      </div>`).join('');

    let statusClass = order.status === 'Delivered' ? 'delivered' : order.status === 'Cancelled' ? 'cancelled' : 'pending';

    container.innerHTML += `
      <div class="order-card">
        <div class="order-header">
          <span>Order #${order.id}</span>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>
        ${itemsHTML}
        <p class="order-date">${order.date}</p>
      </div>`;
  });
}

renderCart();
renderOrders();