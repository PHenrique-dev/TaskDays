// ...existing code...

document.addEventListener('DOMContentLoaded', function() {
  // Exibe login/cadastro na index.html imediatamente
  if (window.location.pathname.endsWith('index.html')) {
    var authDiv = document.getElementById('auth');
    if (authDiv) authDiv.classList.remove('d-none');
    if (typeof renderAuth === 'function') {
      try {
        renderAuth();
      } catch (err) {
        console.error('Erro ao executar renderAuth:', err);
        authDiv.innerHTML = '<div class="container text-center mt-5"><h2 class="text-success">Entrar no TaskDay</h2><p class="text-danger">Erro ao carregar o formulário de login/cadastro.<br>Verifique sua conexão, recarregue a página ou limpe o cache.</p><button class="btn btn-success mt-3" onclick="location.reload()">Recarregar</button></div>';
      }
    } else {
      authDiv.innerHTML = '<div class="container text-center mt-5"><h2 class="text-success">Entrar no TaskDay</h2><p class="text-danger">Erro ao carregar o formulário de login/cadastro.<br>Verifique sua conexão, recarregue a página ou limpe o cache.</p><button class="btn btn-success mt-3" onclick="location.reload()">Recarregar</button></div>';
    }
  }

  // Navbar dinâmica nas telas principais
  if (["main.html", "profile.html", "achievements.html"].some(p => window.location.pathname.endsWith(p))) {
    renderNavbar();
  }
});

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
