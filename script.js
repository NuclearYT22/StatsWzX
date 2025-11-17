// =========================================
//  StatsWzX – Script Profissional (MODELO C)
//  Mantém seu layout, sons, tema e filtro.
//  Agora com METAS Reais em Badges.
// =========================================

// BOTÕES E ELEMENTOS
const conteudo = document.getElementById("conteudo");
const btnArmas = document.getElementById("btnArmas");
const btnAtualizacoes = document.getElementById("btnAtualizacoes");
const btnNoticias = document.getElementById("btnNoticias");
const btnStats = document.getElementById("btnStats");

// =====================
// 🔊 SONS DO MENU
// =====================
const clickSound = new Audio("assets/sounds/menu-click.mp3");
clickSound.volume = 0.4;

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

btnArmas.addEventListener("click", () => { playClick(); mostrarArmas(); });
btnAtualizacoes.addEventListener("click", () => { playClick(); mostrarAtualizacoes(); });
btnNoticias.addEventListener("click", () => { playClick(); mostrarNoticias(); });
btnStats.addEventListener("click", () => { playClick(); mostrarStats(); });

// =====================
// 📦 CACHE JSON
// =====================
let armasCache = null;
let filtroCriado = false;


// =========================================
// 🔥 MOSTRAR ARMAS (AGORA COM BADGES C)
// =========================================
function mostrarArmas() {

  if (!filtroCriado) {
    conteudo.innerHTML = `
      <div class="filtro-container">
        <label for="filtroTipo">Filtrar por tipo:</label>
        <select id="filtroTipo">
          <option value="todos">Todos</option>
          <option value="Assault Rifle">Rifle de Assalto</option>
          <option value="SMG">Submetralhadora</option>
          <option value="Sniper">Fuzil de Precisão</option>
          <option value="LMG">Metralhadora Leve</option>
          <option value="Shotgun">Escopeta</option>
        </select>
      </div>

      <div id="listaArmas" class="lista-armas"></div>
    `;

    filtroCriado = true;
  }

  const filtro = document.getElementById("filtroTipo");
  const container = document.getElementById("listaArmas");

  function renderArmas(tipoFiltro) {
    container.innerHTML = "";

    armasCache.armas.forEach(arma => {
      if (tipoFiltro === "todos" || arma.category === tipoFiltro) {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="${arma.image}" alt="${arma.name}" class="arma-img">
          
          <h3>${arma.name}</h3>
          <p><strong>Categoria:</strong> ${arma.category}</p>

          <!-- BADGES META (ESTILO C) -->
          <div class="badges-meta">
            <span class="badge tier-${arma.tier}">⭐ Tier ${arma.tier}</span>
            <span class="badge"><i class="fa-solid fa-chart-line"></i> Uso: ${arma.stats.usage}</span>
            <span class="badge"><i class="fa-solid fa-bullseye"></i> Winrate: ${arma.stats.winrate}</span>
            <span class="badge"><i class="fa-solid fa-skull"></i> KD: ${arma.stats.kd}</span>
            <span class="badge"><i class="fa-solid fa-bolt"></i> TTK: ${arma.stats.ttk}</span>
          </div>

          <details>
            <summary>🔧 Attachments META</summary>
            <ul class="attachments">
              ${arma.attachments.map(att => `
                <li>
                  <i class="fa-solid fa-screwdriver-wrench"></i>
                  <strong>${att.slot}:</strong> ${att.nome}
                </li>`
              ).join("")}
            </ul>
          </details>
        `;

        container.appendChild(card);
      }
    });
  }

  if (!armasCache) {
    fetch("dados.json")
      .then(res => res.json())
      .then(json => {
        armasCache = json;
        renderArmas("todos");
      });
  } else {
    renderArmas(filtro.value || "todos");
  }

  if (!filtro.onchange) {
    filtro.onchange = () => renderArmas(filtro.value);
  }
}


// =========================================
// OUTRAS SEÇÕES
// =========================================
function mostrarAtualizacoes() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>🛠 Atualizações Recentes</h3>
      <p>As armas estão sendo atualizadas automaticamente via sistema META.</p>
    </div>
  `;
  filtroCriado = false;
}

function mostrarNoticias() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📰 Notícias</h3>
      <p>Seção ainda em desenvolvimento.</p>
    </div>
  `;
  filtroCriado = false;
}

function mostrarStats() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📊 Estatísticas</h3>
      <p>Em breve: gráficos de TTK, popularidade e histórico de metas.</p>
    </div>
  `;
  filtroCriado = false;
}


// =========================================
// 🌙 MODE DARK/ LIGHT
// =========================================
const btnTema = document.getElementById("btnTema");
let modoEscuro = true;

function trocarTema() {
  document.body.classList.add("tema-trocando");

  setTimeout(() => {
    modoEscuro = !modoEscuro;
    document.body.classList.toggle("modo-claro", !modoEscuro);

    btnTema.textContent = modoEscuro ? "🌙" : "☀️";
    localStorage.setItem("modoEscuro", modoEscuro);

    document.body.classList.remove("tema-trocando");
  }, 250);
}

btnTema.addEventListener("click", trocarTema);

window.addEventListener("load", () => {
  const salvo = localStorage.getItem("modoEscuro");
  if (salvo !== null) {
    modoEscuro = salvo === "true";
    document.body.classList.toggle("modo-claro", !modoEscuro);
    btnTema.textContent = modoEscuro ? "🌙" : "☀️";
  }
});
