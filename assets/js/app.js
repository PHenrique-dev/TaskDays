// Animação de splash e transição para login/cadastro
window.onload = function() {
  // Splash na index.html
  if (window.location.pathname.endsWith('index.html')) {
    setTimeout(() => {
      document.getElementById('splash').classList.add('d-none');
      document.getElementById('auth').classList.remove('d-none');
      // Garante que renderAuth será chamado mesmo se não estiver definido imediatamente
      let tentativas = 0;
      function tentarRenderAuth() {
        if (typeof renderAuth === 'function') {
          renderAuth();
        } else if (tentativas < 10) {
          tentativas++;
          setTimeout(tentarRenderAuth, 200);
        }
      }
      tentarRenderAuth();
    }, 1800);
  }

  // Navbar dinâmica nas telas principais
  if (['/main.html', '/profile.html', '/achievements.html'].some(p => window.location.pathname.endsWith(p))) {
    renderNavbar();
  }
}

// Função para renderizar navbar dinâmica
function renderNavbar() {
  const user = JSON.parse(localStorage.getItem('taskday_user'));
  const logged = localStorage.getItem('taskday_logged') === 'true';
  const navbar = document.getElementById('navbar');
  if (!logged || !user) {
    window.location.href = 'index.html';
    return;
  }
  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand text-success">TaskDay</span>
        <span class="me-auto ms-2">Bem-vindo(a), <b>${user.nome}</b></span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="main.html"><i class="fa fa-list"></i> Atividades</a></li>
            <li class="nav-item"><a class="nav-link" href="profile.html"><i class="fa fa-user"></i> Perfil</a></li>
            <li class="nav-item"><a class="nav-link" href="achievements.html"><i class="fa fa-trophy"></i> Conquistas</a></li>
            <li class="nav-item"><a class="nav-link text-danger" href="#" id="logoutBtn"><i class="fa fa-sign-out-alt"></i> Sair</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;
  document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem('taskday_logged');
    window.location.href = 'index.html';
  };
}
