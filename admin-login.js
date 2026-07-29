const form = document.getElementById('adminLoginForm');
const error = document.getElementById('loginError');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const password = document.getElementById('adminPassword').value;
  if (user === 'Renan' && password === '121408') {
    sessionStorage.setItem('technocellAdminAuth', 'ok');
    location.href = 'dashboard.html';
    return;
  }
  error.textContent = 'Usuário ou senha incorretos.';
});
