// script.js
let balance = 0;

function updateBalance() {
  document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

function showMessage(msg, isError = false) {
  const message = document.getElementById('message');
  message.textContent = msg;
  message.style.color = isError ? 'red' : 'green';
}

function deposit() {
  const amount = parseFloat(document.getElementById('amount').value);
  if (isNaN(amount) || amount <= 0) {
    showMessage('Please enter a valid amount.', true);
    return;
  }

  balance += amount;
  updateBalance();
  showMessage(`Deposited $${amount.toFixed(2)} successfully.`);
  document.getElementById('amount').value = '';
}

function withdraw() {
  const amount = parseFloat(document.getElementById('amount').value);
  if (isNaN(amount) || amount <= 0) {
    showMessage('Please enter a valid amount.', true);
    return;
  }

  if (amount > balance) {
    showMessage('Insufficient funds.', true);
    return;
  }

  balance -= amount;
  updateBalance();
  showMessage(`Withdrew $${amount.toFixed(2)} successfully.`);
  document.getElementById('amount').value = '';
}

updateBalance();
