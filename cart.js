// Cart state
let cart = [];

const cartBtn     = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose   = document.getElementById('cartClose');
const cartItems   = document.getElementById('cartItems');
const cartCount   = document.getElementById('cartCount');
const cartTotal   = document.getElementById('cartTotal');
const orderBtn    = document.getElementById('orderBtn');

// Open / close
function openCart()  { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); }

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card  = btn.closest('.menu-card');
    const name  = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    // Button feedback
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+ Add to Order'; btn.classList.remove('added'); }, 1200);

    renderCart();
    openCart();
  });
});

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    orderBtn.disabled = true;
    cartCount.textContent = '0';
    cartTotal.textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = '$' + total.toFixed(2);
  orderBtn.disabled = false;

  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item__qty">
        <button aria-label="Decrease quantity" data-idx="${idx}" data-action="dec">−</button>
        <span>${item.qty}</span>
        <button aria-label="Increase quantity" data-idx="${idx}" data-action="inc">+</button>
      </div>
    </div>
  `).join('');

  // Qty controls
  cartItems.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === 'inc') {
        cart[idx].qty++;
      } else {
        cart[idx].qty--;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
      }
      renderCart();
    });
  });
}

// Order Now → payment page
orderBtn.addEventListener('click', () => {
  // Pass cart via sessionStorage
  sessionStorage.setItem('dsyCart', JSON.stringify(cart));
  window.location.href = 'payment.html';
});
