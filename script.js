// ==========================================
// VARIÁVEIS DE ESTADO E BANCO DE DADOS
// ==========================================

// Banco global de questões carregadas
let bancoQuestoes = [];

// Lista de questões inseridas na prova atual
let listaQuestoesProva = [
  {
    idUnico: 'p1',
    descritor: 'D36',
    tipo: 'objetiva',
    enunciado: 'Ana está ajudando sua mãe a calcular o orçamento para comprar os materiais escolares do ano. Observe na tabela abaixo os preços unitários e as quantidades que elas precisam comprar:',
    opcoes: ['R$ 150,00', 'R$ 206,00', 'R$ 250,00', 'R$ 300,00'],
    espacoExtra: 0
  },
  {
    idUnico: 'p2',
    descritor: 'D32',
    tipo: 'objetiva',
    enunciado: 'Qual é a área de um terreno retangular com 10 metros de largura por 20 metros de comprimento?',
    opcoes: ['100 m²', '200 m²', '300 m²', '400 m²'],
    espacoExtra: 0
  }
];

let logoCarregadaUrl = 'imagens/logopilar.png';
let historicoEstados = [];
let indiceHistorico = -1;

// ==========================================
// 1. BARRA LATERAL REDIMENSIONÁVEL (RESIZER)
// ==========================================
function inicializarResizer() {
  const resizer = document.getElementById('resizer');
  const sidebar = document.getElementById('sidebarPainel');
  let isResizing = false;

  if (!resizer || !sidebar) return;

  resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
    // Garante que a barra fique entre 280px e 600px
    if (newWidth >= 280 && newWidth <= 600) {
      sidebar.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = 'default';
    }
  });
}

// ==========================================
// 2. CARREGAMENTO DOS JSONs EXTERNOS
// ==========================================
async function carregarBancosExternos() {
  bancoQuestoes = [];
  const arquivos = ['questoes/d1.json', 'questoes/d2.json', 'questoes/d36.json'];

  for (const arquivo of arquivos) {
    try {
      const resposta = await fetch(arquivo);
      if (resposta.ok) {
        const dados = await resposta.json();
        if (Array.isArray(dados)) {
          dados.forEach(q => {
            if (!q.id && !q.idUnico) q.id = 'bq_' + Math.random().toString(36).substr(2, 9);
            else if (!q.id) q.id = q.idUnico;
          });
          bancoQuestoes.push(...dados);
        }
      }
    } catch (erro) {
      console.warn(`Não foi possível carregar o arquivo ${arquivo}:`, erro);
    }
  }

  atualizarFiltroDescritores();
  renderizarBanco();
}

// ==========================================
// 3. GERENCIADOR DE HISTÓRICO (DESFAZER / REFAZER)
// ==========================================
function salvarEstadoHistorico() {
  const copia = JSON.parse(JSON.stringify(listaQuestoesProva));
  historicoEstados = historicoEstados.slice(0, indiceHistorico + 1);
  historicoEstados.push(copia);
  indiceHistorico = historicoEstados.length - 1;
}

function desfazerAcao() {
  if (indiceHistorico > 0) {
    indiceHistorico--;
    listaQuestoesProva = JSON.parse(JSON.stringify(historicoEstados[indiceHistorico]));
    renderizarProva();
  }
}

function refazerAcao() {
  if (indiceHistorico < historicoEstados.length - 1) {
    indiceHistorico++;
    listaQuestoesProva = JSON.parse(JSON.stringify(historicoEstados[indiceHistorico]));
    renderizarProva();
  }
}

// Evento disparado quando a página termina de carregar
document.addEventListener('DOMContentLoaded', async () => {
  inicializarResizer();
  await carregarBancosExternos();
  salvarEstadoHistorico();
  renderizarProva();
});

// ==========================================
// 4. BANCO DE QUESTÕES (PAINEL LATERAL)
// ==========================================
function renderizarBanco() {
  const container = document.getElementById('bancoQuestoesContainer');
  if (!container) return;  
  
  const filtroSelect = document.getElementById('filtroDescritor');
  const filtro = filtroSelect ? filtroSelect.value : 'todos';
  container.innerHTML = '';

  const filtradas = bancoQuestoes.filter(q => filtro === 'todos' || q.descritor === filtro);

  if (filtradas.length === 0) {
    container.innerHTML = `<div style="font-size:0.8rem; color:#ef4444; padding:8px; text-align:center;">Nenhuma questão encontrada.</div>`;
    return;
  }

  filtradas.forEach(q => {
    const item = document.createElement('div');
    item.className = 'item-banco';
    const qId = q.id || q.idUnico;

    item.innerHTML = `
      <div class="item-banco-texto" title="${q.enunciado.replace(/"/g, '&quot;')}">
        <b>[${q.descritor}]</b> ${q.enunciado}
      </div>
      <div class="item-banco-acoes">
        <button type="button" class="btn-add-banco" title="Adicionar" onclick="adicionarDaQuestaoDoBanco('${qId}')">➕</button>
        <button type="button" class="btn-ver-banco" title="Ver" onclick="abrirPreviaQuestaoBanco('${qId}')">👁️</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function atualizarFiltroDescritores() {
  const select = document.getElementById('filtroDescritor');
  if (!select) return;

  const descritoresUnicos = [...new Set(bancoQuestoes.map(q => q.descritor).filter(Boolean))];
  select.innerHTML = '<option value="todos">Todos os Descritores</option>';
  descritoresUnicos.sort().forEach(d => {
    select.innerHTML += `<option value="${d}">${d}</option>`;
  });
}

function filtrarBanco() { renderizarBanco(); }

function adicionarDaQuestaoDoBanco(id) {
  const questao = bancoQuestoes.find(q => (q.id === id || q.idUnico === id));
  if (questao) {
    listaQuestoesProva.push({
      ...questao,
      idUnico: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      espacoExtra: questao.espacoExtra || 0
    });
    salvarEstadoHistorico();
    renderizarProva();
  }
}

function abrirPreviaQuestaoBanco(id) {
  const q = bancoQuestoes.find(item => (item.id === id || item.idUnico === id));
  if (q) exibirModalComQuestao(q.descritor, q.enunciado, q.tipo, q.opcoes);
}

// ==========================================
// 5. CRIAR NOVA QUESTÃO PERSONALIZADA
// ==========================================
function alternarCamposOpcoes() {
  const tipo = document.getElementById('novoTipoQuestao').value;
  const container = document.getElementById('containerOpcoesCriacao');
  if (tipo === 'objetiva') container.classList.remove('oculto');
  else container.classList.add('oculto');
}

function abrirPreviaNovaQuestao() {
  const descritor = document.getElementById('novoDescritor').value.trim() || 'D36';
  const enunciado = document.getElementById('novoEnunciado').value.trim();
  const tipo = document.getElementById('novoTipoQuestao').value;

  if (!enunciado) {
    alert('Por favor, digite o enunciado da questão.');
    return;
  }

  let opcoes = [];
  if (tipo === 'objetiva') {
    ['A', 'B', 'C', 'D'].forEach(letra => {
      const val = document.getElementById(`novaOpcao${letra}`).value.trim();
      if (val) opcoes.push(val);
    });
  }

  exibirModalComQuestao(descritor, enunciado, tipo, opcoes);
}

function exibirModalComQuestao(descritor, enunciado, tipo, opcoes) {
  let htmlPrevia = `
    <div class="card-questao" style="background: #fff; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
      <div class="cabecalho-questao-topo">
        <span class="tag-questao">QUESTÃO DE PRÉVIA</span>
        <span class="tag-descritor">${descritor}</span>
      </div>
      <div class="linha-divisoria-questao"></div>
      <p class="enunciado-texto">${enunciado}</p>
  `;

  if (tipo === 'objetiva' && opcoes && opcoes.length > 0) {
    let letras = ['A', 'B', 'C', 'D', 'E'];
    htmlPrevia += `<ul class="opcoes-multipla-list">`;
    opcoes.forEach((op, idx) => {
      htmlPrevia += `<li><b>${letras[idx] || '•'})</b> ${op}</li>`;
    });
    htmlPrevia += `</ul>`;
  } else if (tipo === 'subjetiva') {
    htmlPrevia += `<div class="linhas-respostas-aberta"></div><div class="linhas-respostas-aberta"></div>`;
  }

  htmlPrevia += `</div>`;

  const containerModal = document.getElementById('conteudoModalPreview');
  containerModal.innerHTML = htmlPrevia;
  document.getElementById('modalPreview').classList.remove('oculto');

  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([containerModal]);
  }
}

function fecharModalPreview() {
  document.getElementById('modalPreview').classList.add('oculto');
}

function salvarNovaQuestao() {
  const descritor = document.getElementById('novoDescritor').value.trim() || 'D36';
  const enunciado = document.getElementById('novoEnunciado').value.trim();
  const tipo = document.getElementById('novoTipoQuestao').value;

  if (!enunciado) {
    alert('Preencha o enunciado da questão.');
    return;
  }

  let opcoes = [];
  if (tipo === 'objetiva') {
    ['A', 'B', 'C', 'D'].forEach(letra => {
      const val = document.getElementById(`novaOpcao${letra}`).value.trim();
      if (val) opcoes.push(val);
    });
  }

  const idGerado = 'custom_' + Date.now();
  const novaQ = { id: idGerado, idUnico: idGerado, descritor, tipo, enunciado, opcoes };

  bancoQuestoes.push(novaQ);
  atualizarFiltroDescritores();
  renderizarBanco();

  listaQuestoesProva.push({ ...novaQ, idUnico: 'p_' + Date.now(), espacoExtra: 0 });

  document.getElementById('novoEnunciado').value = '';
  ['A', 'B', 'C', 'D'].forEach(l => document.getElementById(`novaOpcao${l}`).value = '');

  salvarEstadoHistorico();
  renderizarProva();
}

// ==========================================
// 6. EDIÇÃO E MANIPULAÇÃO DE QUESTÕES NA PROVA
// ==========================================
function moverQuestao(index, direcao) {
  const novoIndex = index + direcao;
  if (novoIndex >= 0 && novoIndex < listaQuestoesProva.length) {
    const temp = listaQuestoesProva[index];
    listaQuestoesProva[index] = listaQuestoesProva[novoIndex];
    listaQuestoesProva[novoIndex] = temp;
    salvarEstadoHistorico();
    renderizarProva();
  }
}

function alterarEspacoExtra(index, valor) {
  if (!listaQuestoesProva[index].espacoExtra) listaQuestoesProva[index].espacoExtra = 0;
  listaQuestoesProva[index].espacoExtra = Math.max(0, listaQuestoesProva[index].espacoExtra + valor);
  salvarEstadoHistorico();
  renderizarProva();
}

function carregarLogo(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoCarregadaUrl = e.target.result;
      atualizarCabecalho();
    };
    reader.readAsDataURL(file);
  }
}

function atualizarCabecalho() { renderizarProva(); }

function inserirQuebraPagina() {
  listaQuestoesProva.push({ tipo: 'quebra_pagina', idUnico: 'qkp_' + Date.now() });
  salvarEstadoHistorico();
  renderizarProva();
}

function removerItemProva(idUnico) {
  listaQuestoesProva = listaQuestoesProva.filter(item => item.idUnico !== idUnico);
  salvarEstadoHistorico();
  renderizarProva();
}

function reiniciarTudo() {
  if (confirm('Deseja reiniciar a prova?')) {
    listaQuestoesProva = [];
    salvarEstadoHistorico();
    renderizarProva();
  }
}

// ==========================================
// 7. CRIAÇÃO DE NOVA ESTRUTURA DE FOLHA A4
// ==========================================
function criarNovaFolha(numPagina) {
  const nomeEscola = document.getElementById('inputNomeEscola')?.value || '';
  const serie = document.getElementById('inputSerie')?.value || '';
  const turma = document.getElementById('inputTurma')?.value || '';
  const professor = document.getElementById('inputNomeProfessor')?.value || '';
  const bimestre = document.getElementById('inputBimestre')?.value || '';
  const disciplina = document.getElementById('inputDisciplina')?.value || '';

  const folha = document.createElement('div');
  folha.className = 'folha-a4';
  folha.id = `folha-${numPagina}`;

  folha.innerHTML = `
    <div class="cabecalho-oficial">
      <div class="logo-cell">
        ${logoCarregadaUrl ? `<img src="${logoCarregadaUrl}" alt="Logo">` : '<b>LOGO</b>'}
      </div>
      <div class="info-cell">
        <div class="nome-escola">${nomeEscola}</div>
        <div class="linha-aluno">ALUNO(A): <span class="underline"></span></div>
        <div class="linha-detalhes">
          <span>Série: <b>${serie}</b></span>
          <span>Turma: ${turma || '_________'}</span>
          <span>Data: ____/____/________</span>
          <span class="prof-italico">Professor: ${professor}</span>
        </div>
      </div>
    </div>

    <div class="titulo-nota-container">
      <div class="titulo-prova">${disciplina} - ${bimestre}</div>
      <div class="caixa-nota-wrap">
        <span>NOTA:</span>
        <div class="valor-nota"></div>
      </div>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'grid-questoes';
  folha.appendChild(grid);

  return { folha, grid };
}

// ==========================================
// 8. ALGORITMO CORRIGIDO DE PAGINAÇÃO AUTOMÁTICA
// ==========================================
async function renderizarProva() {
  const container = document.getElementById('conteudoProvasContainer');
  const containerAlerta = document.getElementById('containerAlertaExt');
  if (!container) return;
  
  container.innerHTML = '';
  if (containerAlerta) containerAlerta.innerHTML = '';

  let numeroQuestao = 1;
  let paginaAtualIndex = 1;

  // Cria a primeira folha A4
  let { folha: folhaAtual, grid: gridAtual } = criarNovaFolha(paginaAtualIndex);
  container.appendChild(folhaAtual);

  for (let index = 0; index < listaQuestoesProva.length; index++) {
    const item = listaQuestoesProva[index];

    // TRATAMENTO DA QUEBRA MANUALLY SOLICITADA
    if (item.tipo === 'quebra_pagina') {
      const divisor = document.createElement('div');
      divisor.className = 'divisor-quebra-pagina';
      divisor.innerHTML = `
        <span>--- QUEBRA DE PÁGINA MANUAL ---</span>
        <div class="controles-questao" style="opacity:1; visibility:visible;">
          <button type="button" class="btn-del" onclick="removerItemProva('${item.idUnico}')">✖ Remover Quebra</button>
        </div>
      `;
      container.appendChild(divisor);

      // Inicia uma nova página
      paginaAtualIndex++;
      const novaFolhaObj = criarNovaFolha(paginaAtualIndex);
      folhaAtual = novaFolhaObj.folha;
      gridAtual = novaFolhaObj.grid;
      container.appendChild(folhaAtual);
      continue;
    }

    // Cria o Card DOM da questão
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
          <button type="button" class="btn-espaco" title="Aumentar espaço" onclick="alterarEspacoExtra(${index}, 15)">↕ +</button>
          <button type="button" class="btn-espaco" title="Reduzir espaço" onclick="alterarEspacoExtra(${index}, -15)">↕ -</button>
          <button type="button" class="btn-mover" title="Subir" onclick="moverQuestao(${index}, -1)">▲</button>
          <button type="button" class="btn-mover" title="Descer" onclick="moverQuestao(${index}, 1)">▼</button>
          <button type="button" class="btn-del" title="Excluir" onclick="removerItemProva('${item.idUnico}')">✖</button>
        </div>

        <span class="tag-descritor">${item.descritor || ''}</span>
      </div>
      <div class="linha-divisoria-questao"></div>
      <p class="enunciado-texto">${item.enunciado}</p>
      ${htmlOpcoes}
    `;

    // Adiciona temporariamente a questão para cálculo de altura
    gridAtual.appendChild(card);

    if (window.MathJax && window.MathJax.typesetPromise) {
      await MathJax.typesetPromise([card]);
    }

    // VERIFICAÇÃO RIGOROSA DE ALTURA MÁXIMA DA PÁGINA A4 (880px)
    const ALTURA_MAXIMA_GRID = 880; 

    if (gridAtual.scrollHeight > ALTURA_MAXIMA_GRID) {
      // Remove a questão da folha onde estourou o espaço
      gridAtual.removeChild(card);

      // Se a folha já estava vazia, a questão é individualmente maior do que 1 página inteira
      if (gridAtual.children.length === 0) {
        gridAtual.appendChild(card);
        folhaAtual.classList.add('folha-estourada');
        if (containerAlerta) {
          containerAlerta.innerHTML = `
            <div class="alerta-estouro-banner">
              ⚠️ A Questão ${numeroQuestao - 1} é grande demais para caber em uma página A4!
            </div>`;
        }
      } else {
        // Cria automaticamente uma nova Folha A4
        paginaAtualIndex++;
        const novaFolhaObj = criarNovaFolha(paginaAtualIndex);
        folhaAtual = novaFolhaObj.folha;
        gridAtual = novaFolhaObj.grid;
        container.appendChild(folhaAtual);

        // Insere a questão no topo da nova folha criada
        gridAtual.appendChild(card);
      }
    }
  }

  // Atualiza a contagem de páginas no topo
  const info = document.getElementById('infoPaginas');
  if (info) info.innerText = `Total de Páginas: ${paginaAtualIndex}`;
}

// Aciona a impressão do navegador (Ctrl+P / Gerar PDF)
function imprimirProva() { window.print(); }
