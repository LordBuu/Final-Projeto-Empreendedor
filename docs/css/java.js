window.onload = function () {
  // --- SWOT ---
  const swotItems = JSON.parse(localStorage.getItem("swot_items_v1") || '{"S":[],"W":[],"O":[],"T":[]}');

  function renderSWOT() {
    ["S", "W", "O", "T"].forEach(q => {
      const cell = document.getElementById(q);
      const ul = cell.querySelector("ul");
      const count = cell.querySelector(".count");
      ul.innerHTML = "";
      swotItems[q].forEach((text, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${text}</span>`;
        const btn = document.createElement("button");
        btn.textContent = "Remover";
        btn.onclick = () => removeSWOTItem(q, i);
        li.appendChild(btn);
        ul.appendChild(li);
      });
      count.textContent = swotItems[q].length;
    });
    localStorage.setItem("swot_items_v1", JSON.stringify(swotItems));
  }

  function addSWOTItem() {
    const quadrant = document.getElementById("quadrant").value;
    const text = document.getElementById("itemText").value.trim();
    if (!text) return;
    swotItems[quadrant].push(text);
    document.getElementById("itemText").value = "";
    renderSWOT();
  }

  function removeSWOTItem(q, i) {
    swotItems[q].splice(i, 1);
    renderSWOT();
  }

  function clearSWOT() {
    if (!confirm("Tem certeza que deseja limpar tudo?")) return;
    ["S", "W", "O", "T"].forEach(q => swotItems[q] = []);
    renderSWOT();
  }

  function exportSWOTJSON() {
    const blob = new Blob([JSON.stringify(swotItems, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swot.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportSWOTPNG() {
    const matrix = document.getElementById("matrix");
    html2canvas(matrix, { scale: 2 }).then(canvas => {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "swot-matrix.png";
      a.click();
    });
  }

  // Event listeners SWOT
  document.getElementById("addItem").addEventListener("click", addSWOTItem);
  document.getElementById("clearInput").addEventListener("click", () => document.getElementById("itemText").value = "");
  document.getElementById("clearAll").addEventListener("click", clearSWOT);
  document.getElementById("exportJSON").addEventListener("click", exportSWOTJSON);
  document.getElementById("exportPNG").addEventListener("click", exportSWOTPNG);
  document.getElementById("itemText").addEventListener("keydown", e => { if (e.key === "Enter") addSWOTItem(); });

  renderSWOT();

 // ---------------- DIVISÃO DE TAREFAS ----------------

const tarefas = { // Usando um objeto local para armazenar as tarefas por categoria
  figma: {},
  documentacao: {},
  splash: {}
};

const addTarefaBtn = document.getElementById('addTarefa');
const limparTarefasBtn = document.getElementById('limparTarefas');
const categoriaSelect = document.getElementById('categoria');
const descricaoInput = document.getElementById('descricao');

// Adicionar uma tarefa
addTarefaBtn?.addEventListener('click', () => {
  const categoria = categoriaSelect.value;
  const descricao = descricaoInput.value.trim();
  if (descricao && categoria) {
    // Gerando um id único simples para cada tarefa (aqui, usaremos o timestamp)
    const id = Date.now().toString();
    tarefas[categoria][id] = { descricao };
    descricaoInput.value = '';
    renderTarefas(); // Atualiza a interface com as tarefas
  }
});

// Limpar todas as tarefas
limparTarefasBtn?.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
    for (let categoria in tarefas) {
      tarefas[categoria] = {}; // Limpa as tarefas de cada categoria
    }
    renderTarefas(); // Atualiza a interface após limpeza
  }
});

// Função para renderizar as tarefas na interface
function renderTarefas() {
  ['figma', 'documentacao', 'splash'].forEach(cat => {
    const cell = document.querySelector(`.cell-tarefa.${cat}`);
    if (!cell) return;
    const ul = cell.querySelector('ul');
    const countSpan = cell.querySelector('.count');
    ul.innerHTML = ''; // Limpa a lista de tarefas

    const items = tarefas[cat];
    let count = 0;
    for (const id in items) {
      count++;
      const item = items[id];
      const li = document.createElement('li');
      li.innerHTML = `<span>${getIcon(cat)} ${item.descricao}</span><button>Remover</button>`;
      li.querySelector('button').onclick = () => {
        delete tarefas[cat][id]; // Remove a tarefa do objeto
        renderTarefas(); // Atualiza a interface após remoção
      };
      ul.appendChild(li);
    }
    countSpan.textContent = count; // Atualiza o contador de tarefas
  });
}

// Função para obter o ícone da categoria
function getIcon(categoria) {
  switch (categoria) {
    case 'figma': return '🎨';
    case 'documentacao': return '📄';
    case 'splash': return '🚀';
    default: return '📌';
  }
}

// Chama a função para renderizar as tarefas inicialmente
renderTarefas();


  // --- Slogan ---
  const sloganItems = JSON.parse(localStorage.getItem("slogan_items_v1") || "[]");
  const sloganList = document.getElementById("sloganList");

  function renderSlogan() {
    sloganList.innerHTML = "";
    sloganItems.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${s}</span>`;
      const btn = document.createElement("button");
      btn.textContent = "Remover";
      btn.onclick = () => {
        sloganItems.splice(i, 1);
        renderSlogan();
        localStorage.setItem("slogan_items_v1", JSON.stringify(sloganItems));
      };
      li.appendChild(btn);
      sloganList.appendChild(li);
    });
    localStorage.setItem("slogan_items_v1", JSON.stringify(sloganItems));
  }

  document.getElementById("saveSlogan").addEventListener("click", () => {
    const text = document.getElementById("sloganInput").value.trim();
    if (!text) return;
    sloganItems.push(text);
    document.getElementById("sloganInput").value = "";
    renderSlogan();
  });

  renderSlogan();

  // --- Canais Digitais ---
  const canais = JSON.parse(localStorage.getItem("canais_v1") || '[]');
  const canaisList = document.querySelector(".canais");

  function renderCanais() {
    canaisList.innerHTML = `
      ${canais.map((c, i) => `<li><a href="${c.url}" target="_blank">${c.icon} ${c.name}</a> <button onclick="removeCanal(${i})">X</button></li>`).join("")}
    `;
    localStorage.setItem("canais_v1", JSON.stringify(canais));
  }

  window.removeCanal = function(index) {
    canais.splice(index, 1);
    renderCanais();
  }

  // Inputs para adicionar canal
  const canaisSection = document.getElementById("canais");
  const inputWrapper = document.createElement("div");
  inputWrapper.innerHTML = `
    <input type="text" id="canalName" placeholder="Nome do canal"/>
    <input type="text" id="canalURL" placeholder="URL do canal"/>
    <input type="text" id="canalIcon" placeholder="Emoji ou ícone"/>
    <button id="addCanal">Adicionar Canal</button>
  `;
  canaisSection.appendChild(inputWrapper);

  document.getElementById("addCanal").addEventListener("click", () => {
    const name = document.getElementById("canalName").value.trim();
    const url = document.getElementById("canalURL").value.trim();
    const icon = document.getElementById("canalIcon").value.trim() || "🔗";
    if (!name || !url) return alert("Preencha nome e URL!");
    canais.push({ name, url, icon });
    document.getElementById("canalName").value = "";
    document.getElementById("canalURL").value = "";
    document.getElementById("canalIcon").value = "";
    renderCanais();
  });

  renderCanais();

  // --- Tabs com scroll suave ---
  const tabs = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", e => {
    e.preventDefault();

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach(tc => tc.classList.remove("active"));

    const tabName = tab.dataset.tab;
    const target = document.getElementById(tabName);

    if (tabName === "adicionais") {
      // Ativa ambas as seções: adicionais e observações
      document.getElementById("adicionais").classList.add("active");
      document.getElementById("observacoes").classList.add("active");
      document.getElementById("adicionais").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      target.classList.add("active");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

  // --- Logo Dominus ---
  const logoUpload = document.getElementById("logoUpload");
  const logoPreview = document.getElementById("logoPreview");
  const logoKey = "logo_dominus";

  const storedLogo = localStorage.getItem(logoKey);
  if(storedLogo) renderLogo(storedLogo);

  function renderLogo(src){
    logoPreview.innerHTML = `<img src="${src}" style="max-width:200px; margin-bottom:8px;"/><button id="removeLogo">X Remover</button>`;
    document.getElementById("removeLogo").addEventListener("click", () => {
      logoPreview.innerHTML = "";
      localStorage.removeItem(logoKey);
    });
  }

  logoUpload.addEventListener("change", e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      localStorage.setItem(logoKey, ev.target.result);
      renderLogo(ev.target.result);
    }
    reader.readAsDataURL(file);
  });

  // --- Coisas Adicionais ---
const adicionaisItems = JSON.parse(localStorage.getItem("adicionais_v1") || "[]");
const adicionaisList = document.getElementById("adicionaisList");

function renderAdicionais() {
  adicionaisList.innerHTML = "";
  adicionaisItems.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.tema}</strong>: ${item.caracteristicas} <button>Remover</button>`;
    li.querySelector("button").addEventListener("click", () => {
      adicionaisItems.splice(i, 1);
      renderAdicionais();
      localStorage.setItem("adicionais_v1", JSON.stringify(adicionaisItems));
    });
    adicionaisList.appendChild(li);
  });
  localStorage.setItem("adicionais_v1", JSON.stringify(adicionaisItems));
}

document.getElementById("addAdicional").addEventListener("click", () => {
  const tema = document.getElementById("adTema").value.trim();
  const caracteristicas = document.getElementById("adCaracteristicas").value.trim();
  if(!tema || !caracteristicas) return alert("Preencha ambos os campos!");
  adicionaisItems.push({ tema, caracteristicas });
  document.getElementById("adTema").value = "";
  document.getElementById("adCaracteristicas").value = "";
  renderAdicionais();
});

renderAdicionais();


  // --- Observações do Empresário ---
  const observacoes = JSON.parse(localStorage.getItem("observacoes_v1") || "[]");
  const feedbackList = document.getElementById("feedbackList");

  // Renderiza observações e feedbacks
  function renderObservacoes() {
    feedbackList.innerHTML = "";
    observacoes.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.tema}:</strong> ${item.observacao} <button>Remover</button>`;
      li.querySelector("button").addEventListener("click", () => {
        observacoes.splice(i, 1);
        renderObservacoes();
        localStorage.setItem("observacoes_v1", JSON.stringify(observacoes));
      });
      feedbackList.appendChild(li);
    });
    localStorage.setItem("observacoes_v1", JSON.stringify(observacoes));
  }

  // Função para salvar observações
  document.getElementById("salvarObservacao").addEventListener("click", () => {
    const observacaoText = document.getElementById("observacaoInput").value.trim();
    if (!observacaoText) return alert("Digite uma observação para salvar!");
    
    const tema = "Observação do Empresário"; // Ou o empresário pode definir um tema
    observacoes.push({ tema, observacao: observacaoText });
    document.getElementById("observacaoInput").value = "";
    renderObservacoes();
  });

  renderObservacoes();


};