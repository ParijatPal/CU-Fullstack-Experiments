// script.js

const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Check saved theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
}

// Theme switcher
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');

  const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
});
