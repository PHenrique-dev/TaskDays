// Lógica de conquistas será implementada aqui
document.addEventListener('DOMContentLoaded', () => {
	if (!window.location.pathname.endsWith('achievements.html')) return;
	renderAchievements();
});

const ACHIEVEMENTS = [
	{ id: 'first_task', nome: 'Primeira Tarefa', desc: 'Conclua sua primeira tarefa.', icon: 'fa-check', requisito: user => user.historico && user.historico.length > 0 },
	{ id: 'week_streak', nome: 'Semana Perfeita', desc: 'Conclua todas as tarefas de uma semana.', icon: 'fa-calendar-week', requisito: user => user.conquistas && user.conquistas.includes('week_streak') },
	{ id: 'consistency_3', nome: '3 Dias Seguidos', desc: 'Conclua tarefas por 3 dias consecutivos.', icon: 'fa-fire', requisito: user => user.conquistas && user.conquistas.includes('consistency_3') },
	{ id: 'consistency_7', nome: '7 Dias Seguidos', desc: 'Conclua tarefas por 7 dias consecutivos.', icon: 'fa-bolt', requisito: user => user.conquistas && user.conquistas.includes('consistency_7') },
	{ id: 'month_master', nome: 'Mestre do Mês', desc: 'Conclua tarefas todos os dias de um mês.', icon: 'fa-crown', requisito: user => user.conquistas && user.conquistas.includes('month_master') }
];

function renderAchievements() {
	const user = JSON.parse(localStorage.getItem('taskday_user')) || {};
	const container = document.getElementById('achievements');
	let html = '<h3 class="mb-3 text-success">Conquistas</h3>';
	html += '<div class="row">';
	ACHIEVEMENTS.forEach(ach => {
		const unlocked = user.conquistas && user.conquistas.includes(ach.id);
		html += `<div class="col-12 col-md-6 mb-3">
			<div class="card ${unlocked ? 'border-success' : 'border-secondary'}">
				<div class="card-body d-flex align-items-center">
					<i class="fa ${ach.icon} fa-2x me-3 ${unlocked ? 'text-success' : 'text-secondary'}"></i>
					<div>
						<h5 class="card-title mb-1">${ach.nome}</h5>
						<p class="card-text mb-1">${ach.desc}</p>
						<span class="badge ${unlocked ? 'bg-success' : 'bg-secondary'}">${unlocked ? 'Desbloqueada' : 'Bloqueada'}</span>
					</div>
				</div>
			</div>
		</div>`;
	});
	html += '</div>';
	container.innerHTML = html;
}
