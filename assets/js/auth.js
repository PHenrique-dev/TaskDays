// Função para renderizar login/cadastro
function renderAuth() {
  const authDiv = document.getElementById('auth');
  authDiv.innerHTML = `
    <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div class="card p-4 w-100" style="max-width: 350px;">
        <h2 class="mb-3 text-success text-center">Entrar no TaskDay</h2>
        <form id="loginForm">
          <input type="email" class="form-control mb-2" placeholder="Email" required>
          <input type="password" class="form-control mb-2" placeholder="Senha" required>
          <button type="submit" class="btn btn-success w-100 mb-2">Login</button>
        </form>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success w-50 mb-2" id="googleLogin"><i class="fab fa-google"></i> Google</button>
          <button class="btn btn-success w-50 mb-2" id="showRegister"><i class="fa fa-user-plus"></i> Cadastrar</button>
        </div>
      </div>
    </div>
    <div id="registerDiv" class="d-none position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style="background:rgba(0,0,0,0.7);z-index:1050;">
      <div class="card p-4 w-100" style="max-width: 350px;">
        <h2 class="mb-3 text-success text-center">Cadastro</h2>
        <form id="registerForm">
          <input type="text" class="form-control mb-2" placeholder="Nome completo" required>
          <input type="email" class="form-control mb-2" placeholder="Email" required>
          <input type="password" class="form-control mb-2" placeholder="Senha" required>
          <button type="submit" class="btn btn-success w-100 mb-2">Cadastrar</button>
        </form>
        <button class="btn btn-link w-100" id="showLogin">Voltar ao Login</button>
      </div>
    </div>
  `;
  // Adicionar lógica de alternância entre login/cadastro
  document.getElementById('showRegister').onclick = () => {
    document.getElementById('registerDiv').classList.remove('d-none');
  };
  document.getElementById('showLogin').onclick = () => {
    document.getElementById('registerDiv').classList.add('d-none');
  };

  // Lógica de cadastro
  document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const nome = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;
    if (nome && email && senha) {
      localStorage.setItem('taskday_user', JSON.stringify({ nome, email, senha, pontos: 0, conquistas: [], historico: [] }));
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      document.getElementById('registerDiv').classList.add('d-none');
      document.getElementById('loginForm').parentElement.parentElement.classList.remove('d-none');
    }
  };

  // Lógica de login
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;
    const user = JSON.parse(localStorage.getItem('taskday_user'));
    if (user && user.email === email && user.senha === senha) {
      localStorage.setItem('taskday_logged', 'true');
      window.location.href = 'main.html';
    } else {
      alert('Email ou senha incorretos!');
    }
  };

  // Remover Google Sign-In oficial da tela
  if (document.getElementById('g_id_onload')) {
    document.getElementById('g_id_onload').remove();
  }
  if (document.querySelector('.g_id_signin')) {
    document.querySelector('.g_id_signin').remove();
  }

  // Adicionar evento ao botão estilizado
  document.getElementById('googleLogin').onclick = function() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: '444431190037-l6nfst70c32eii4230gcp3uc1o70d3ve.apps.googleusercontent.com',
        callback: onGoogleSignIn
      });
      window.google.accounts.id.prompt();
    } else {
      alert('Google Identity SDK não carregado. Tente recarregar a página.');
    }
  };

  // Adicionar callback global para Google Sign-In
  window.onGoogleSignIn = function(response) {
    // O token está em response.credential
    // Você pode decodificar o JWT ou enviar para seu backend
    console.log('Google JWT:', response.credential);
    // Exemplo: autenticar usuário localmente
    // window.location.href = 'main.html'; // redireciona após login
  };
}
