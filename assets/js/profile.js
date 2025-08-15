// Lógica de perfil e relatório semanal será implementada aqui
document.addEventListener('DOMContentLoaded', () => {
	if (!window.location.pathname.endsWith('profile.html')) return;
	renderProfile();
});

function renderProfile() {
	const user = JSON.parse(localStorage.getItem('taskday_user')) || {};
	const container = document.getElementById('profile');
	let html = `<h3 class="mb-3 text-success">Perfil</h3>`;
	html += `<div class="card mb-3">
		<div class="card-body">
			<h5 class="card-title">${user.nome || ''}</h5>
			<p class="card-text mb-1"><b>Email:</b> ${user.email || ''}</p>
			<p class="card-text mb-1"><b>Pontos:</b> ${user.pontos || 0}</p>
			<p class="card-text mb-1"><b>Conquistas desbloqueadas:</b> ${(user.conquistas || []).length}</p>
		</div>
	</div>`;
	html += renderRelatorio(user);
	container.innerHTML = html;
}

function renderRelatorio(user) {
	// Relatório semanal
	const historico = user.historico || [];
	const semana = getDiasSemana();
	const mes = getDiasMes();
	const concluidasSemana = semana.filter(dia => historico.includes(dia)).length;
	const concluidasMes = mes.filter(dia => historico.includes(dia)).length;
	let rel = `<div class="card mb-3">
		<div class="card-body">
			<h5 class="card-title">Relatório Semanal</h5>
			<p class="card-text mb-1"><b>Tarefas concluídas na semana:</b> ${concluidasSemana}</p>
			<p class="card-text mb-1"><b>Tarefas concluídas no mês:</b> ${concluidasMes}</p>
			<p class="card-text mb-1"><b>Histórico de dias concluídos:</b> ${historico.join(', ')}</p>
		</div>
	</div>`;
	return rel;
}

function getDiasSemana() {
	const now = new Date();
	const start = new Date(now);
	start.setDate(now.getDate() - now.getDay());
	let diasSemana = [];
	for (let i = 0; i < 7; i++) {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		diasSemana.push(d.toISOString().slice(0,10));
	}
	return diasSemana;
}

function getDiasMes() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	let diasMes = [];
	for (let d = 1; d <= 31; d++) {
		const date = new Date(year, month, d);
		if (date.getMonth() !== month) break;
		diasMes.push(date.toISOString().slice(0,10));
	}
	return diasMes;
}
