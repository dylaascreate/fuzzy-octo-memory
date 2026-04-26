// Load cart from sessionStorage
const cart = JSON.parse(sessionStorage.getItem('dsyCart') || '[]');

const summaryItems  = document.getElementById('summaryItems');
const subtotalEl    = document.getElementById('subtotal');
const serviceEl     = document.getElementById('serviceCharge');
const grandTotalEl  = document.getElementById('grandTotal');
const paynowAmount  = document.getElementById('paynowAmount');
const cashRef       = document.querySelector('.cash-order-ref span');
const modalOverlay  = document.getElementById('modalOverlay');
const modalMsg      = document.getElementById('modalMsg');

// Render summary
function renderSummary() {
  if (!cart.length) {
    summaryItems.innerHTML = '<p style="font-size:0.9rem;color:var(--ink-light)">No items in order.</p>';
    return;
  }
  const subtotal     = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const service      = subtotal * 0.1;
  const grand        = subtotal + service;

  summaryItems.innerHTML = cart.map(i => `
    <div class="summary-item">
      <span class="summary-item__name">${i.name} × ${i.qty}</span>
      <span class="summary-item__price">$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('');

  subtotalEl.textContent   = '$' + subtotal.toFixed(2);
  serviceEl.textContent    = '$' + service.toFixed(2);
  grandTotalEl.textContent = '$' + grand.toFixed(2);
  paynowAmount.textContent = '$' + grand.toFixed(2);
}

renderSummary();

// Generate order ref
const orderRef = 'DSY-' + Math.random().toString(36).substring(2,7).toUpperCase();
if (cashRef) cashRef.textContent = orderRef;

// Tab switching
document.querySelectorAll('.pay-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pay-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', false); });
    document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', true);
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Card number formatting
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
  cardNumberInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
}

// Expiry formatting
const cardExpiry = document.getElementById('cardExpiry');
if (cardExpiry) {
  cardExpiry.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.substring(0,2) + ' / ' + v.substring(2);
    e.target.value = v;
  });
}

// Show success modal
function showSuccess(msg) {
  modalMsg.textContent = msg;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', false);
  sessionStorage.removeItem('dsyCart');
}

// Card pay
const payBtn = document.getElementById('payBtn');
if (payBtn) {
  payBtn.addEventListener('click', () => {
    const name   = document.getElementById('cardName').value.trim();
    const number = document.getElementById('cardNumber').value.trim();
    const expiry = document.getElementById('cardExpiry').value.trim();
    const cvc    = document.getElementById('cardCvc').value.trim();
    if (!name || number.replace(/\s/g,'').length < 16 || expiry.length < 7 || cvc.length < 3) {
      alert('Please fill in all card details correctly.');
      return;
    }
    showSuccess('Your order has been placed. A receipt will be sent to your email.');
  });
}

// PayNow confirm
const paynowConfirm = document.getElementById('paynowConfirm');
if (paynowConfirm) {
  paynowConfirm.addEventListener('click', () => {
    showSuccess('Payment received via PayNow. Your order is being prepared.');
  });
}

// Cash confirm
const cashConfirm = document.getElementById('cashConfirm');
if (cashConfirm) {
  cashConfirm.addEventListener('click', () => {
    showSuccess(`Order ${orderRef} placed. Please proceed to the counter to pay.`);
  });
}

// Hamburger (reuse from main.js pattern)
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}
