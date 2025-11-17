// Referências aos botões e ao conteúdo principal
const conteudo = document.getElementById('conteudo');
const btnArmas = document.getElementById('btnArmas');
const btnAtualizacoes = document.getElementById('btnAtualizacoes');
const btnNoticias = document.getElementById('btnNoticias');
const btnStats = document.getElementById('btnStats');
// ========= SONS DE INTERFACE ==========
const clickSound = new Audio('assets/sounds/menu-click.mp3');
clickSound.volume = 0.4; // volume mais suave

// Eventos de clique dos menus com som
btnArmas.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  mostrarArmas();
});

btnAtualizacoes.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  mostrarAtualizacoes();
});

btnNoticias.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  mostrarNoticias();
});

btnStats.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  mostrarStats();
});


// Cache para evitar recarregar JSON toda hora
let armasCache = null;
let filtroCriado = false; // <- evita duplicar o filtro

function mostrarArmas() {
  // Se o filtro já foi criado, só exibe novamente
  if (!filtroCriado) {
    conteudo.innerHTML = `
      <div class="filtro-container">
        <label for="filtroTipo">Filtrar por tipo:</label>
        <select id="filtroTipo">
          <option value="todos">Todos</option>
          <option value="Rifle de Assalto">Rifle de Assalto</option>
          <option value="Submetralhadora">Submetralhadora</option>
          <option value="Fuzil de Precisão">Fuzil de Precisão</option>
          <option value="Metralhadora Leve">Metralhadora Leve</option>
          <option value="Escopeta">Escopeta</option>
        </select>
      </div>
      <div id="listaArmas" class="lista-armas"></div>
    `;
    filtroCriado = true;
  }

  const filtro = document.getElementById('filtroTipo');
  const container = document.getElementById('listaArmas');

  // Ícones por tipo de arma
  function getIcon(tipo) {
    switch (tipo) {
      case 'Rifle de Assalto': return '<i class="fa-solid fa-gun"></i>';
      case 'Submetralhadora': return '<i class="fa-solid fa-burst"></i>';
      case 'Fuzil de Precisão': return '<i class="fa-solid fa-crosshairs"></i>';
      case 'Metralhadora Leve': return '<i class="fa-solid fa-shield-halved"></i>';
      case 'Escopeta': return '<i class="fa-solid fa-skull-crossbones"></i>';
      default: return '<i class="fa-solid fa-circle-question"></i>';
    }
  }

  // Renderiza as armas na tela
  function renderArmas(filtroTipo) {
    container.innerHTML = '';
    armasCache.forEach(arma => {
      if (filtroTipo === 'todos' || arma.tipo === filtroTipo) {
        const armaDiv = document.createElement('div');
        armaDiv.classList.add('card');

        armaDiv.innerHTML = `
          <img src="${arma.imagem}" alt="${arma.nome}" class="arma-img">
          <h3>${arma.nome}</h3>
          <p><strong>Tipo:</strong> ${getIcon(arma.tipo)} ${arma.tipo}</p>
          <p><strong>Dano:</strong> ${arma.dano}</p>
          <p><strong>Cadência:</strong> ${arma.cadencia}</p>
          <p>${arma.descricao}</p>
          <details>
            <summary>🔧 Attachments</summary>
            <ul class="attachments">
              ${arma.attachments.map(att => `
                <li><i class="fa-solid fa-screwdriver-wrench"></i>
                  <strong>${att.nome}</strong> (${att.tipo}) — ${att.efeito}
                </li>
              `).join('')}
            </ul>
          </details>
        `;
        container.appendChild(armaDiv);
      }
    });
  }

  // Carrega o JSON apenas uma vez
  if (!armasCache) {
    fetch('dados.json')
      .then(res => res.json())
      .then(armas => {
        armasCache = armas;
        renderArmas('todos');
      });
  } else {
    renderArmas(filtro.value || 'todos');
  }

  // Se o evento do filtro ainda não existe, cria apenas uma vez
  if (!filtro.onchange) {
    filtro.onchange = () => renderArmas(filtro.value);
  }
}

// 🛠 Atualizações
function mostrarAtualizacoes() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>🛠 Atualizações Recentes</h3>
      <ul>
        <li>M4A1: dano aumentado de 40 → 42</li>
        <li>MP5: leve redução de alcance</li>
        <li>Nova arma chegando em breve!</li>
      </ul>
    </div>
  `;
  filtroCriado = false;
}

// 📰 Notícias
function mostrarNoticias() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📰 Notícias</h3>
      <p>Seção ainda em desenvolvimento.</p>
    </div>
  `;
  filtroCriado = false;
}

// 📊 Estatísticas
function mostrarStats() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📊 Estatísticas</h3>
      <p>Seção de estatísticas será adicionada futuramente.</p>
    </div>
  `;
  filtroCriado = false;
}

// ========= MODO CLARO / ESCURO COM FADE ==========
const btnTema = document.getElementById('btnTema');
let modoEscuro = true;

function trocarTema() {
  document.body.classList.add('tema-trocando');
  setTimeout(() => {
    modoEscuro = !modoEscuro;
    document.body.classList.toggle('modo-claro', !modoEscuro);
    btnTema.textContent = modoEscuro ? '🌙' : '☀️';
    localStorage.setItem('modoEscuro', modoEscuro);
    document.body.classList.remove('tema-trocando');
  }, 250);
}

btnTema.addEventListener('click', trocarTema);

// Mantém o tema salvo ao carregar
window.addEventListener('load', () => {
  const salvo = localStorage.getItem('modoEscuro');
  if (salvo !== null) {
    modoEscuro = salvo === 'true';
    document.body.classList.toggle('modo-claro', !modoEscuro);
    btnTema.textContent = modoEscuro ? '🌙' : '☀️';
  }
});


