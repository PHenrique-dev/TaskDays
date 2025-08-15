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
        <button class="btn btn-outline-success w-100 mb-2" id="googleLogin"><i class="fab fa-google"></i> Entrar com Google</button>
        <button class="btn btn-primary w-100" id="showRegister"><i class="fa fa-user-plus"></i> Cadastrar</button>
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

  // Lógica de login Google (simulação)
  document.getElementById('googleLogin').onclick = function() {
    const nome = 'Google User';
    const email = 'googleuser@email.com';
    localStorage.setItem('taskday_user', JSON.stringify({ nome, email, senha: '', pontos: 0, conquistas: [], historico: [] }));
    localStorage.setItem('taskday_logged', 'true');
    window.location.href = 'main.html';
  };
}
