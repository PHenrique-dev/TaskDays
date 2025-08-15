function showTrophyAnimation(text = 'Conquista desbloqueada!') {
  if (document.querySelector('.trophy-overlay')) return;

  // Som de conquista
  const audio = new Audio('sounds/Rare Achievement - Minecraft Sound Effect (HD).mp3'); // Coloque o caminho correto do seu áudio
  audio.volume = 0.7; // Ajuste o volume (0.0 a 1.0)
  audio.play().catch(err => console.error("Erro ao reproduzir áudio:", err));

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'trophy-overlay';

  // Container
  const container = document.createElement('div');
  container.className = 'trophy-container';

  // Glow
  const glow = document.createElement('div');
  glow.className = 'trophy-glow';
  container.appendChild(glow);

  // Trophy Icon (Font Awesome)
  const trophy = document.createElement('i');
  trophy.className = 'fa-solid fa-trophy trophy-icon';
  container.appendChild(trophy);

  // Text
  const trophyText = document.createElement('div');
  trophyText.className = 'trophy-text';
  trophyText.textContent = text;
  container.appendChild(trophyText);

  // Particles
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'trophy-particle';
    const angle = (360 / 24) * i;
    const radius = 60 + Math.random() * 30;
    p.style.left = (80 + Math.cos(angle * Math.PI / 180) * radius) + 'px';
    p.style.top = (80 + Math.sin(angle * Math.PI / 180) * radius) + 'px';
    p.style.animationDelay = (Math.random() * 0.7) + 's';
    container.appendChild(p);
  }

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 3000);
}
