// Lógica de rotina personalizada será implementada aqui
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.endsWith('main.html')) return;
  const activitiesContainer = document.getElementById('activities');
  activitiesContainer.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 id="dayTitle" class="mb-0 text-success"></h3>
      <input type="date" id="datePicker" class="form-control form-control-sm w-auto ms-3" value="${new Date().toISOString().slice(0,10)}">
    </div>
    <div id="activitiesList"></div>
  `;
  // Função para atualizar título e atividades
  function updateDayAndActivities(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr + 'T00:00:00');
    document.getElementById('dayTitle').textContent = date.toLocaleDateString('pt-BR', options);
    renderActivities(dateStr);
    const btn = document.getElementById('addActivityBtn');
    if (!btn) {
      document.getElementById('activitiesList').insertAdjacentHTML('beforeend', `<button class="btn btn-success w-100 my-3" id="addActivityBtn"><i class="fa fa-plus"></i> Nova Atividade</button>`);
      document.getElementById('addActivityBtn').onclick = showAddActivityModal;
    }
  }
  // Evento do seletor de data
  document.getElementById('datePicker').addEventListener('change', function() {
    updateDayAndActivities(this.value);
  });
  // Inicializa com o dia atual
  updateDayAndActivities(document.getElementById('datePicker').value);
  setInterval(checkUpcomingActivities, 60000);
  checkUpcomingActivities();
});

function checkUpcomingActivities() {
  const acts = getActivities();
  const now = new Date();
  acts.forEach((act, idx) => {
    if (act.concluida) return;
    const [h, m] = act.horarioInicio.split(':');
    const actDate = new Date(act.dia + 'T' + h.padStart(2,'0') + ':' + m.padStart(2,'0'));
    const diff = (actDate - now) / 60000;
    if (diff > 0 && diff <= 5) {
      if (!act.notificado) {
        // Remove modal anterior se existir
        const oldModal = document.getElementById(`notifyModal${idx}`);
        if (oldModal) oldModal.remove();
        const modalHtml = `<div class='modal fade' id='notifyModal${idx}' tabindex='-1' aria-hidden='true'>
          <div class='modal-dialog'>
            <div class='modal-content bg-dark text-light'>
              <div class='modal-header'>
                <h5 class='modal-title text-warning'>Lembrete de Atividade</h5>
                <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div class='modal-body'>
                <p>Sua atividade "${act.nome}" começa em ${Math.round(diff)} minutos.</p>
                <div class='d-flex justify-content-end gap-2'>
                  <button class='btn btn-success' id='notifyOkBtn${idx}' data-bs-dismiss='modal'>Ok</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById(`notifyModal${idx}`));
        let alarmAudio = null;
        try {
          alarmAudio = new Audio('sounds/Alarm sound effect.mp3');
          alarmAudio.loop = true;
          alarmAudio.volume = 0.7;
          alarmAudio.play();
        } catch(e) {}
        modal.show();
        document.getElementById(`notifyOkBtn${idx}`).onclick = function() {
          if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
          }
          act.notificado = true;
          saveActivities(acts);
        };
      }
    }
  });
}

function renderDayHeader(selectedDate) {
  // Não faz mais nada, header fixo
}

// Atualiza o evento do seletor de data para funcionar após renderização do header
function setupDatePickerListener() {
  const datePicker = document.getElementById('datePicker');
  if (datePicker) {
    datePicker.addEventListener('change', function() {
      document.getElementById('activities').innerHTML = '';
      renderActivities(this.value);
      setupDatePickerListener();
      document.getElementById('activities').insertAdjacentHTML('beforeend', `<button class="btn btn-success w-100 my-3" id="addActivityBtn"><i class="fa fa-plus"></i> Nova Atividade</button>`);
      document.getElementById('addActivityBtn').onclick = showAddActivityModal;
    });
  }
}

function getActivities(selectedDate) {
  const user = JSON.parse(localStorage.getItem('taskday_user'));
  const day = selectedDate ? selectedDate : new Date().toISOString().slice(0,10);
  return (user && user.atividades && user.atividades[day]) ? user.atividades[day] : [];
}

function saveActivities(acts, dia) {
  const user = JSON.parse(localStorage.getItem('taskday_user'));
  const day = dia ? dia : new Date().toISOString().slice(0,10);
  if (!user.atividades) user.atividades = {};
  user.atividades[day] = acts;
  localStorage.setItem('taskday_user', JSON.stringify(user));
}

function renderActivities(selectedDate) {
  let acts = getActivities(selectedDate);
  acts = acts.slice().sort((a, b) => {
    const [hA, mA] = a.horarioInicio.split(':').map(Number);
    const [hB, mB] = b.horarioInicio.split(':').map(Number);
    return hA !== hB ? hA - hB : mA - mB;
  });
  let html = '';
  if (acts.length === 0) {
    html += '<div class="alert alert-secondary">Nenhuma atividade para este dia.</div>';
  } else {
    acts.forEach((act, i) => {
      html += `<div class="card mb-2">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">${act.nome}</span>
            <span class="badge bg-success">${act.horarioInicio} - ${act.horarioFim}</span>
          </div>
          <small class="text-muted">${act.dia}</small>
          <div class="mt-2 d-flex gap-2">
            ${act.concluida
              ? '<span class="text-success fw-bold">Concluída</span>'
              : `<button class="btn btn-outline-success btn-sm" id="concluirBtn${i}" onclick="concluirAtividade(${i})"><i class="fa fa-check"></i> Concluir</button>`}
            <button class="btn btn-outline-warning btn-sm" onclick="editarAtividade(${i})"><i class="fa fa-edit"></i> Editar</button>
            <button class="btn btn-outline-danger btn-sm" onclick="excluirAtividade(${i})"><i class="fa fa-trash"></i> Excluir</button>
          </div>
        </div>
      </div>`;
    });
  }
  document.getElementById('activitiesList').innerHTML = html;
  // Garante que o botão "Nova Atividade" sempre aparece
  let btn = document.getElementById('addActivityBtn');
  if (!btn) {
    document.getElementById('activitiesList').insertAdjacentHTML('beforeend', `<button class="btn btn-success w-100 my-3" id="addActivityBtn"><i class="fa fa-plus"></i> Nova Atividade</button>`);
    document.getElementById('addActivityBtn').onclick = showAddActivityModal;
  }
}

function showAddActivityModal() {
  const modalHtml = `<div class="modal fade" id="activityModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title text-success">Nova Atividade</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="activityForm">
            <input type="text" class="form-control mb-2" placeholder="Nome da atividade" required>
            <label class="mb-1">Data da atividade:</label>
            <input type="date" class="form-control mb-2" id="dataAtividade" required value="${new Date().toISOString().slice(0,10)}">
            <input type="time" class="form-control mb-2" placeholder="Horário de início" required>
            <input type="time" class="form-control mb-2" placeholder="Horário de término" required>
            <button type="submit" class="btn btn-success w-100">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('activityModal'));
  modal.show();
  document.getElementById('activityForm').onsubmit = function(e) {
    e.preventDefault();
    const nome = this.querySelector('input[type="text"]').value;
    const dia = this.querySelector('#dataAtividade').value;
    const horarioInicio = this.querySelectorAll('input[type="time"]')[0].value;
    const horarioFim = this.querySelectorAll('input[type="time"]')[1].value;
    const user = JSON.parse(localStorage.getItem('taskday_user'));
    if (!user.atividades) user.atividades = {};
    if (!user.atividades[dia]) user.atividades[dia] = [];
    user.atividades[dia].push({ nome, dia, horarioInicio, horarioFim, concluida: false });
    localStorage.setItem('taskday_user', JSON.stringify(user));
    modal.hide();
    document.getElementById('activityModal').remove();
    // Atualiza apenas a lista de atividades do dia selecionado
    renderActivities(dia);
    // Garante que o botão "Nova Atividade" sempre aparece
    const btn = document.getElementById('addActivityBtn');
    if (!btn) {
      document.getElementById('activitiesList').insertAdjacentHTML('beforeend', `<button class="btn btn-success w-100 my-3" id="addActivityBtn"><i class="fa fa-plus"></i> Nova Atividade</button>`);
      document.getElementById('addActivityBtn').onclick = showAddActivityModal;
    }
  };
	};
	// Reset semanal automático (domingo à noite ou segunda 00:00)
	setInterval(resetSemanal, 60000 * 10); // checa a cada 10 min
	resetSemanal();
function resetSemanal() {
	const now = new Date();
	// Se for domingo à noite ou segunda 00:00
	if ((now.getDay() === 0 && now.getHours() >= 22) || (now.getDay() === 1 && now.getHours() === 0)) {
		const user = JSON.parse(localStorage.getItem('taskday_user'));
		if (user && user.historico) {
			user.historico = [];
			localStorage.setItem('taskday_user', JSON.stringify(user));
			// Opcional: notificar usuário
			alert('Relatório semanal resetado! Comece uma nova semana de conquistas.');
		}
	}
}


window.concluirAtividade = function(idx) {
  const selectedDate = document.getElementById('datePicker').value;
  const acts = getActivities(selectedDate);
  const modalHtml = `<div class='modal fade' id='confirmCompleteModal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog'>
      <div class='modal-content bg-dark text-light'>
        <div class='modal-header'>
          <h5 class='modal-title text-success'>Concluir Atividade</h5>
          <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
        </div>
        <div class='modal-body'>
          <p>Deseja marcar esta atividade como concluída?</p>
          <div class='d-flex justify-content-end gap-2'>
            <button class='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
            <button class='btn btn-success' id='confirmCompleteBtn'>Concluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('confirmCompleteModal'));
  modal.show();
  document.getElementById('confirmCompleteBtn').onclick = function() {
    acts[idx].concluida = true;
    // Salva as atividades do dia correto
    const user = JSON.parse(localStorage.getItem('taskday_user'));
    user.atividades[selectedDate] = acts;
    localStorage.setItem('taskday_user', JSON.stringify(user));
    atualizarHistoricoConquistas(acts[idx].dia);
    adicionarPontos(10);
    modal.hide();
    document.getElementById('confirmCompleteModal').remove();
    if (acts.every(a => a.concluida)) {
      const frases = [
        'Você é incrível! Todas as tarefas concluídas!',
        'Produtividade máxima! Continue assim!',
        'Parabéns! Você está dominando sua rotina!',
        'Dia vencido! Orgulho do seu progresso!'
      ];
      const frase = frases[Math.floor(Math.random() * frases.length)];
      const modalParabens = `<div class='modal fade' id='parabensModal' tabindex='-1' aria-hidden='true'>
        <div class='modal-dialog'>
          <div class='modal-content bg-dark text-light'>
            <div class='modal-header'>
              <h5 class='modal-title text-success'>Parabéns!</h5>
              <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div class='modal-body'>
              <p>${frase}</p>
            </div>
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', modalParabens);
      const parabensModal = new bootstrap.Modal(document.getElementById('parabensModal'));
      parabensModal.show();
      setTimeout(() => {
        parabensModal.hide();
        document.getElementById('parabensModal').remove();
      }, 2500);
      adicionarPontos(20);
    }
    // Atualiza apenas a lista de atividades do dia selecionado
    renderActivities(selectedDate);
  };
};

function adicionarPontos(qtd) {
	const user = JSON.parse(localStorage.getItem('taskday_user'));
	user.pontos = (user.pontos || 0) + qtd;
	// Níveis: 100 pontos por nível
	user.nivel = Math.floor((user.pontos || 0) / 100) + 1;
	localStorage.setItem('taskday_user', JSON.stringify(user));
}
	;

	function atualizarHistoricoConquistas(diaConcluida) {
		const user = JSON.parse(localStorage.getItem('taskday_user'));
		const conquistasAntes = user.conquistas ? [...user.conquistas] : [];
		// Atualiza histórico removendo dias sem atividades concluídas
		user.historico = Object.keys(user.atividades || {}).filter(dia => {
			return user.atividades[dia].some(a => a.concluida);
		});
		// Desbloqueia "Primeira Tarefa"
		if (!user.conquistas) user.conquistas = [];
		if (!user.conquistas.includes('first_task')) user.conquistas.push('first_task');
		// Consistência: 3 e 7 dias seguidos
		const diasSeguidos = contarDiasSeguidos(user.historico);
		if (diasSeguidos >= 3 && !user.conquistas.includes('consistency_3')) user.conquistas.push('consistency_3');
		if (diasSeguidos >= 7 && !user.conquistas.includes('consistency_7')) user.conquistas.push('consistency_7');
		// Semana perfeita
		if (semanaPerfeita(user)) {
			if (!user.conquistas.includes('week_streak')) user.conquistas.push('week_streak');
		}
		// Mês completo
		if (mesCompleto(user)) {
			if (!user.conquistas.includes('month_master')) user.conquistas.push('month_master');
		}
		localStorage.setItem('taskday_user', JSON.stringify(user));
		// Verifica se houve nova conquista desbloqueada
		const novas = user.conquistas.filter(c => !conquistasAntes.includes(c));
		if (novas.length > 0 && typeof showTrophyAnimation === 'function') {
			const nomes = {
				'first_task': 'Primeira Tarefa',
				'consistency_3': 'Consistência 3 dias',
				'consistency_7': 'Consistência 7 dias',
				'week_streak': 'Semana Perfeita',
				'month_master': 'Mestre do Mês'
			};
			novas.forEach(c => {
				showTrophyAnimation('Conquista desbloqueada: ' + (nomes[c] || c));
			});
		}
	}

	function contarDiasSeguidos(historico) {
		historico = historico.sort();
		let maxStreak = 1, streak = 1;
		for (let i = 1; i < historico.length; i++) {
			const prev = new Date(historico[i-1]);
			const curr = new Date(historico[i]);
			if ((curr - prev) === 86400000) {
				streak++;
				if (streak > maxStreak) maxStreak = streak;
			} else {
				streak = 1;
			}
		}
		return maxStreak;
	}

	function semanaPerfeita(user) {
		// Verifica se todos os dias da semana atual têm registro no histórico
		const now = new Date();
		const start = new Date(now);
		start.setDate(now.getDate() - now.getDay());
		let diasSemana = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			diasSemana.push(d.toISOString().slice(0,10));
		}
		return diasSemana.every(dia => user.historico && user.historico.includes(dia));
	}

	function mesCompleto(user) {
		// Verifica se todos os dias do mês atual têm registro no histórico
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		let diasMes = [];
		for (let d = 1; d <= 31; d++) {
			const date = new Date(year, month, d);
			if (date.getMonth() !== month) break;
			diasMes.push(date.toISOString().slice(0,10));
		}
		return diasMes.every(dia => user.historico && user.historico.includes(dia));
	}

window.excluirAtividade = function(idx) {
  const selectedDate = document.getElementById('datePicker').value;
  const acts = getActivities(selectedDate);
  const modalHtml = `<div class='modal fade' id='confirmDeleteModal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog'>
      <div class='modal-content bg-dark text-light'>
        <div class='modal-header'>
          <h5 class='modal-title text-danger'>Confirmar Exclusão</h5>
          <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
        </div>
        <div class='modal-body'>
          <p>Tem certeza que deseja excluir esta atividade?</p>
          <div class='d-flex justify-content-end gap-2'>
            <button class='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
            <button class='btn btn-danger' id='confirmDeleteBtn'>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
  document.getElementById('confirmDeleteBtn').onclick = function() {
    acts.splice(idx, 1);
    // Salva as atividades do dia correto
    const user = JSON.parse(localStorage.getItem('taskday_user'));
    user.atividades[selectedDate] = acts;
    // Atualiza histórico removendo dias sem atividades concluídas
    user.historico = Object.keys(user.atividades || {}).filter(dia => {
      return user.atividades[dia].some(a => a.concluida);
    });
    localStorage.setItem('taskday_user', JSON.stringify(user));
    modal.hide();
    document.getElementById('confirmDeleteModal').remove();
    // Atualiza apenas a lista de atividades do dia selecionado
    renderActivities(selectedDate);
  };
};

window.editarAtividade = function(idx) {
	const acts = getActivities();
	const act = acts[idx];
	const modalHtml = `<div class="modal fade" id="editActivityModal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content bg-dark text-light">
				<div class="modal-header">
					<h5 class="modal-title text-success">Editar Atividade</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form id="editActivityForm">
						<input type="text" class="form-control mb-2" value="${act.nome}" required>
						<input type="date" class="form-control mb-2" value="${act.dia}" required>
						<input type="time" class="form-control mb-2" value="${act.horarioInicio}" required>
						<input type="time" class="form-control mb-2" value="${act.horarioFim}" required>
						<button type="submit" class="btn btn-success w-100">Salvar</button>
					</form>
				</div>
			</div>
		</div>
	</div>`;
	document.body.insertAdjacentHTML('beforeend', modalHtml);
	const modal = new bootstrap.Modal(document.getElementById('editActivityModal'));
	modal.show();
	document.getElementById('editActivityForm').onsubmit = function(e) {
		e.preventDefault();
    act.nome = this.querySelector('input[type="text"]').value;
    const oldDia = acts[idx].dia;
    const newDia = this.querySelector('input[type="date"]').value;
    act.dia = newDia;
    act.horarioInicio = this.querySelectorAll('input[type="time"]')[0].value;
    act.horarioFim = this.querySelectorAll('input[type="time"]')[1].value;
    // Remove do dia antigo
    const user = JSON.parse(localStorage.getItem('taskday_user'));
    if (!user.atividades[oldDia]) user.atividades[oldDia] = [];
    user.atividades[oldDia].splice(idx, 1);
    // Adiciona ao novo dia
    if (!user.atividades[newDia]) user.atividades[newDia] = [];
    user.atividades[newDia].push(act);
    // Atualiza histórico
    user.historico = Object.keys(user.atividades || {}).filter(dia => {
      return user.atividades[dia].some(a => a.concluida);
    });
    localStorage.setItem('taskday_user', JSON.stringify(user));
    modal.hide();
    document.getElementById('editActivityModal').remove();
    const selectedDate = document.getElementById('datePicker').value;
    renderActivities(selectedDate);
	};
}
