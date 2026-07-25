// ==========================================
// BANCO DE DADOS INICIAL DE QUESTÕES (SAEB)
// ==========================================
const bancoQuestoesSAEB = [
  {
    id: "banco-1",
    descritor: "D1",
    tipo: "objetiva",
    enunciado: "Qual é a área de um terreno retangular com 10m de largura por 20m de comprimento?",
    opcoes: ["100 m²", "200 m²", "300 m²", "400 m²"]
  },
  {
    id: "banco-2",
    descritor: "D1",
    tipo: "subjetiva",
    enunciado: "Desenhe um retângulo no espaço abaixo e calcule sua área considerando base = 5cm e altura = 3cm."
  },
  {
    id: "banco-3",
    descritor: "D36",
    tipo: "objetiva",
    enunciado: "Ana está ajudando sua mãe a calcular o orçamento de materiais escolares. Observe a tabela e determine o valor total:",
    opcoes: ["R$ 150,00", "R$ 206,00", "R$ 250,00", "R$ 300,00"]
  }
];

// ESTADOS DA APLICAÇÃO
let listaQuestoesProva = [];
let historicoEstados = [];
let ponteiroHistorico = -1;
let logoEscolaDataUrl = "";

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  carregarBancoQuestoes();
  
  // Adiciona 2 questões de exemplo no início
  adicionarItemProva({ ...bancoQuestoesSAEB[2], idUnico: 'init-1' });
  adicionarItemProva({ ...bancoQuestoesSAEB[0], idUnico: 'init-2' });

  configurarResizer();
});

// ==========================================
// GERENCIAMENTO DO BANCO LATERAL
// ==========================================
function carregarBancoQuestoes() {
  const container = document.getElementById('listaBancoQuestoes');
  const selectDescritor = document.getElementById('filtroDescritor');
  if (!container) return;

  container.innerHTML = '';
  const descritoresUnicos = new Set();

  bancoQuestoesSAEB.forEach(q => {
    descritoresUnicos.add(q.descritor);

    const div = document.createElement('div');
    div.className = 'item-banco';
    div.innerHTML = `
      <span><b>[${q.descritor}]</b> ${q.enunciado.substring(0, 35)}...</span>
      <div class="item-banco-acoes">
        <button type="button" class="btn-primary btn-icon" onclick="adicionarDoBanco('${q.id}')">➕</button>
      </div>
    `;
    container.appendChild(div);
  });

  if (selectDescritor && selectDescritor.options.length <= 1) {
    descritoresUnicos.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.innerText = `Descritor ${d}`;
      selectDescritor.appendChild(opt);
    });
  }
}

function filtrarBancoQuestoes() {
  const filtro = document.getElementById('filtroDescritor').value;
  const container = document.getElementById('listaBancoQuestoes');
  container.innerHTML = '';

  const filtradas = filtro === 'todos' 
    ? bancoQuestoesSAEB 
    : bancoQuestoesSAEB.filter(q => q.descritor === filtro);

  filtradas.forEach(q => {
    const div = document.createElement('div');
    div.className = 'item-banco';
    div.innerHTML = `
      <span><b>[${q.descritor}]</b> ${q.enunciado.substring(0, 35)}...</span>
      <div class="item-banco-acoes">
        <button type="button" class="btn-primary btn-icon" onclick="adicionarDoBanco('${q.id}')">➕</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function adicionarDoBanco(idBanco) {
  const q = bancoQuestoesSAEB.find(item => item.id === idBanco);
  if (q) {
    salvarEstadoHistorico();
    adicionarItemProva({ ...q, idUnico: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4) });
  }
}

// ==========================================
// CRIAÇÃO E MANIPULAÇÃO DA PROVA
// ==========================================
function adicionarItemProva(item) {
  listaQuestoesProva.push(item);
  renderizarProva();
}

function adicionarQuestaoPersonalizada() {
  const tipo = document.getElementById('novoTipo').value;
  const descritor = document.getElementById('novoDescritor').value || 'D-GERAL';
  const enunciado = document.getElementById('novoEnunciado').value;

  if (!enunciado.trim()) {
    alert("Por favor, digite o enunciado da questão.");
    return;
  }

  let opcoes = [];
  if (tipo === 'objetiva') {
    const inputs = document.querySelectorAll('.input-opcao');
    inputs.forEach(i => {
      if (i.value.trim()) opcoes.push(i.value.trim());
    });
  }

  salvarEstadoHistorico();
  adicionarItemProva({
    idUnico: 'custom_' + Date.now(),
    tipo,
    descritor,
    enunciado,
    opcoes
  });

  document.getElementById('novoEnunciado').value = '';
}

function inserirQuebraPaginaManual() {
  salvarEstadoHistorico();
  adicionarItemProva({
    idUnico: 'quebra_' + Date.now(),
    tipo: 'quebra_pagina'
  });
}

function removerItemProva(idUnico) {
  salvarEstadoHistorico();
  listaQuestoesProva = listaQuestoesProva.filter(item => item.idUnico !== idUnico);
  renderizarProva();
}

function moverQuestao(index, direcao) {
  const novoIndex = index + direcao;
  if (novoIndex < 0 || novoIndex >= listaQuestoesProva.length) return;

  salvarEstadoHistorico();
  const temp = listaQuestoesProva[index];
  listaQuestoesProva[index] = listaQuestoesProva[novoIndex];
  listaQuestoesProva[novoIndex] = temp;
  renderizarProva();
}

function alterarEspacoExtra(index, delta) {
  salvarEstadoHistorico();
  if (!listaQuestoesProva[index].espacoExtra) listaQuestoesProva[index].espacoExtra = 0;
  listaQuestoesProva[index].espacoExtra += delta;
  if (listaQuestoesProva[index].espacoExtra < 0) listaQuestoesProva[index].espacoExtra = 0;
  renderizarProva();
}

// ==========================================
// CONSTRUTOR DE FOLHAS A4 E CABEÇALHOS
// ==========================================
function criarNovaFolha(numPagina) {
  const folha = document.createElement('div');
  folha.className = 'folha-a4';

  const escola = document.getElementById('inputEscola')?.value || '';
  const serie = document.getElementById('inputSerie')?.value || '';
  const turma = document.getElementById('inputTurma')?.value || '';
  const professor = document.getElementById('inputProfessor')?.value || '';
  const disciplina = document.getElementById('inputDisciplina')?.value || '';
  const bimestre = document.getElementById('inputBimestre')?.value || '';
  const qtdColunas = document.getElementById('selectColunas')?.value || '2';

  if (numPagina === 1) {
    // PÁGINA 1: CABEÇALHO OFICIAL COMPLETO
    folha.innerHTML = `
      <div class="cabecalho-oficial">
        <img class="logo-escola" src="${logoEscolaDataUrl || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\'><rect width=\'50\' height=\'50\' fill=\'%23eee\'/><text x=\'10\' y=\'30\' font-size=\'10\'>LOGO</text></svg>'}" alt="Logo">
        <div class="dados-escola">
          <h3>${escola}</h3>
          <div>ALUNO(A): <span class="linha-aluno"></span></div>
          <div class="linha-detalhes">
            <span>Série: <b>${serie}</b></span>
            <span>Turma: <b>${turma}</b></span>
            <span>Data: ____/____/_______</span>
            <span>Professor: <b>${professor}</b></span>
          </div>
        </div>
      </div>
      <div class="titulo-prova-container">
        <span class="titulo-prova-texto">${disciplina} - ${bimestre}</span>
        <div class="caixa-nota">NOTA: <span style="display:inline-block; width:30px;"></span></div>
      </div>
    `;
  } else {
    // PÁGINA 2+: CABEÇALHO COMPACTO DE CONTINUAÇÃO
    folha.innerHTML = `
      <div class="cabecalho-compacto">
        <span>${disciplina.toUpperCase()} - CONTINUAÇÃO</span>
        <span>PÁGINA ${numPagina}</span>
      </div>
    `;
  }

  // Grid de questões configurado para 1 ou 2 colunas
  const grid = document.createElement('div');
  grid.className = `grid-questoes colunas-${qtdColunas}`;
  folha.appendChild(grid);

  return { folha, grid };
}

// ==========================================
// RENDERIZAÇÃO ESTÁVEL E PAGINAÇÃO INTELIGENTE
// ==========================================
function renderizarProva() {
  const container = document.getElementById('conteudoProvasContainer');
  if (!container) return;
  
  container.innerHTML = '';
  const qtdColunas = document.getElementById('selectColunas')?.value || '2';

  let numeroQuestao = 1;
  let paginaAtualIndex = 1;

  let { folha: folhaAtual, grid: gridAtual } = criarNovaFolha(paginaAtualIndex);
  container.appendChild(folhaAtual);

  for (let index = 0; index < listaQuestoesProva.length; index++) {
    const item = listaQuestoesProva[index];

    // QUEBRA DE PÁGINA MANUAL
    if (item.tipo === 'quebra_pagina') {
      const divisor = document.createElement('div');
      divisor.className = 'divisor-quebra-pagina';
      divisor.innerHTML = `
        <span>--- QUEBRA DE PÁGINA MANUAL ---</span>
        <div class="controles-questao" style="display:flex; position:relative; top:0;">
          <button type="button" class="btn-del" onclick="removerItemProva('${item.idUnico}')">✖ Remover Quebra</button>
        </div>
      `;
      container.appendChild(divisor);

      paginaAtualIndex++;
      const novaFolhaObj = criarNovaFolha(paginaAtualIndex);
      folhaAtual = novaFolhaObj.folha;
      gridAtual = novaFolhaObj.grid;
      container.appendChild(folhaAtual);
      continue;
    }

    // CARD DA QUESTÃO
    const card = document.createElement('div');
    card.className = 'card-questao';
    if (item.espacoExtra) card.style.marginBottom = `${item.espacoExtra}px`;

    let letras = ['A', 'B', 'C', 'D', 'E'];
    let htmlOpcoes = '';

    if (item.tipo === 'objetiva' && item.opcoes && item.opcoes.length > 0) {
      htmlOpcoes = '<ul class="opcoes-multipla-list">';
      item.opcoes.forEach((op, idx) => {
        htmlOpcoes += `<li><b>${letras[idx] || '•'})</b> ${op}</li>`;
      });
      htmlOpcoes += '</ul>';
    } else {
      htmlOpcoes = `<div class="linhas-respostas-aberta"></div><div class="linhas-respostas-aberta"></div>`;
    }

    card.innerHTML = `
      <div class="cabecalho-questao-topo">
        <span class="tag-questao">QUESTÃO ${numeroQuestao++}</span>
        
        <div class="controles-questao">
          <button type="button" onclick="alterarEspacoExtra(${index}, 15)">↕ +</button>
          <button type="button" onclick="alterarEspacoExtra(${index}, -15)">↕ -</button>
          <button type="button" onclick="moverQuestao(${index}, -1)">▲</button>
          <button type="button" onclick="moverQuestao(${index}, 1)">▼</button>
          <button type="button" class="btn-del" onclick="removerItemProva('${item.idUnico}')">✖</button>
        </div>

        <span class="tag-descritor">${item.descritor || ''}</span>
      </div>
      <div class="linha-divisoria-questao"></div>
      <p class="enunciado-texto">${item.enunciado || ''}</p>
      ${htmlOpcoes}
    `;

    gridAtual.appendChild(card);

    // Limites de altura verticais em pixels por folha A4
    let limiteAlturaPixel;
    if (qtdColunas === '1') {
      limiteAlturaPixel = paginaAtualIndex === 1 ? 750 : 880;
    } else {
      limiteAlturaPixel = paginaAtualIndex === 1 ? 780 : 900;
    }

    // AUTO-PAGINAÇÃO: Se ultrapassar o limite, move a questão para a próxima página
    if (gridAtual.scrollHeight > limiteAlturaPixel) {
      gridAtual.removeChild(card);

      paginaAtualIndex++;
      const novaFolhaObj = criarNovaFolha(paginaAtualIndex);
      folhaAtual = novaFolhaObj.folha;
      gridAtual = novaFolhaObj.grid;
      container.appendChild(folhaAtual);

      gridAtual.appendChild(card);
    }
  }

  // Renderiza fórmulas matemáticas do MathJax se presente
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([container]).catch(err => console.warn(err));
  }

  const info = document.getElementById('infoPaginas');
  if (info) info.innerText = `Total de Páginas: ${paginaAtualIndex}`;
}

// Atualiza o layout ao mudar dados do cabeçalho ou colunas
function atualizarCabecalho() {
  renderizarProva();
}

function carregarLogo(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoEscolaDataUrl = e.target.result;
      renderizarProva();
    };
    reader.readAsDataURL(file);
  }
}

function alternarCamposOpcoes() {
  const tipo = document.getElementById('novoTipo').value;
  const container = document.getElementById('containerOpcoes');
  if (container) container.style.display = tipo === 'objetiva' ? 'block' : 'none';
}

// ==========================================
// HISTÓRICO (DESFAZER / REFAZER / REINICIAR)
// ==========================================
function salvarEstadoHistorico() {
  historicoEstados = historicoEstados.slice(0, ponteiroHistorico + 1);
  historicoEstados.push(JSON.stringify(listaQuestoesProva));
  ponteiroHistorico++;
}

function desfazer() {
  if (ponteiroHistorico > 0) {
    ponteiroHistorico--;
    listaQuestoesProva = JSON.parse(historicoEstados[ponteiroHistorico]);
    renderizarProva();
  }
}

function refazer() {
  if (ponteiroHistorico < historicoEstados.length - 1) {
    ponteiroHistorico++;
    listaQuestoesProva = JSON.parse(historicoEstados[ponteiroHistorico]);
    renderizarProva();
  }
}

function reiniciarProva() {
  if (confirm("Tem certeza que deseja reiniciar a prova? Todas as questões serão removidas.")) {
    salvarEstadoHistorico();
    listaQuestoesProva = [];
    renderizarProva();
  }
}

// ==========================================
// REDIMENSIONAMENTO DA SIDEBAR (RESIZER)
// ==========================================
function configurarResizer() {
  const resizer = document.getElementById('resizer');
  const sidebar = document.getElementById('sidebar');
  if (!resizer || !sidebar) return;

  let isResizing = false;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
    if (newWidth >= 280 && newWidth <= 520) {
      sidebar.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = 'default';
  });
}
