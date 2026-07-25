// Banco global de questões
let bancoQuestoes = [];

// Lista de questões na prova
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

// Configuração do Painel Redimensionável (Resizer)
function inicializarResizer() {
  const resizer = document.getElementById('resizer');
  const sidebar = document.getElementById('sidebarPainel');
  let isResizing = false;

  if (!resizer || !sidebar) return;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
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

// Carrega os bancos JSON
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

// Histórico (Desfazer / Refazer)
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

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  inicializarResizer();
  await carregarBancosExternos();
  salvarEstadoHistorico();
  renderizarProva();
});

// Renderiza o Banco de Questões (Painel Esquerdo)
function renderizarBanco() {
  const container = document.getElementById('bancoQuestoesContainer');
  if (!container) return;  
  
  const filtroSelect = document.getElementById('filtroDescritor');
  const filtro = filtroSelect ? filtroSelect.value : 'todos';
  container.innerHTML = '';

  const filtradas = bancoQuestoes.filter(q => filtro === 'todos' || q.descritor === filtro);

  if (filtradas.length === 0) {
    container.innerHTML = `
      <div style="font-size:0.8rem; color:#ef4444; padding:8px; text-align:center;">
        Nenhuma questão encontrada.
      </div>`;
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
        <button type="button" class="btn-add-banco" title="Adicionar à prova" onclick="adicionarDaQuestaoDoBanco('${qId}')">➕</button>
        <button type="button" class="btn-ver-banco" title="Visualizar questão" onclick="abrirPreviaQuestaoBanco('${qId}')">👁️</button>
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
    alert('Por favor, digite o enunciado da questão para visualizar a prévia.');
    return;
  }

  let opcoes = [];
  if (tipo === 'objetiva') {
    const opA = document.getElementById('novaOpcaoA').value.trim();
    const opB = document.getElementById('novaOpcaoB').value.trim();
    const opC = document.getElementById('novaOpcaoC').value.trim();
    const opD = document.getElementById('novaOpcaoD').value.trim();
    if (opA) opcoes.push(opA);
    if (opB) opcoes.push(opB);
    if (opC) opcoes.push(opC);
    if (opD) opcoes.push(opD);
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
    htmlPrevia += `
      <div class="linhas-respostas-aberta"></div>
      <div class="linhas-respostas-aberta"></div>
      <div class="linhas-respostas-aberta"></div>
    `;
  }

  htmlPrevia += `</div>`;

  const containerModal = document.getElementById('conteudoModalPreview');
  containerModal.innerHTML = htmlPrevia;

  const modal = document.getElementById('modalPreview');
  modal.classList.remove('oculto');

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
    const opA = document.getElementById('novaOpcaoA').value.trim();
    const opB = document.getElementById('novaOpcaoB').value.trim();
    const opC = document.getElementById('novaOpcaoC').value.trim();
    const opD = document.getElementById('novaOpcaoD').value.trim();
    if (opA) opcoes.push(opA);
    if (opB) opcoes.push(opB);
    if (opC) opcoes.push(opC);
    if (opD) opcoes.push(opD);
  }

  const idGerado = 'custom_' + Date.now();
  const novaQ = {
    id: idGerado,
    idUnico: idGerado,
    descritor: descritor,
    tipo: tipo,
    enunciado: enunciado,
    opcoes: opcoes
  };

  bancoQuestoes.push(novaQ);
  atualizarFiltroDescritores();
  renderizarBanco();

  listaQuestoesProva.push({
    ...novaQ,
    idUnico: 'p_' + Date.now(),
    espacoExtra: 0
  });

  document.getElementById('novoEnunciado').value = '';
  document.getElementById('novaOpcaoA').value = '';
  document.getElementById('novaOpcaoB').value = '';
  document.getElementById('novaOpcaoC').value = '';
  document.getElementById('novaOpcaoD').value = '';

  salvarEstadoHistorico();
  renderizarProva();
}

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
  if (!listaQuestoesProva[index].espacoExtra) {
    listaQuestoesProva[index].espacoExtra = 0;
  }
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
  listaQuestoesProva.push({
    tipo: 'quebra_pagina',
    idUnico: 'qkp_' + Date.now()
  });
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

// Criar Elemento de Folha A4
function criarNovaFolha(numPagina) {
  const nomeEscola = document.getElementById('inputNomeEscola') ? document.getElementById('inputNomeEscola').value : '';
  const serie = document.getElementById('inputSerie') ? document.getElementById('inputSerie').value : '';
  const turma = document.getElementById('inputTurma') ? document.getElementById('inputTurma').value : '';
  const professor = document.getElementById('inputNomeProfessor') ? document.getElementById('inputNomeProfessor').value : '';
  const bimestre = document.getElementById('inputBimestre') ? document.getElementById('inputBimestre').value : '';
  const disciplina = document.getElementById('inputDisciplina') ? document.getElementById('inputDisciplina').value : '';

  const folha = document.createElement('div');
  folha.className = 'folha-a4';
  folha.id = `folha-${numPagina}`;

  let htmlCabecalho = `
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

  folha.innerHTML = htmlCabecalho;

  const grid = document.createElement('div');
  grid.className = 'grid-questoes';
  folha.appendChild(grid);

  return { folha, grid };
}

// Renderiza a prova na Folha A4 com detecção de estouro e borda de atenção
function renderizarProva() {
  const container = document.getElementById('conteudoProvasContainer');
  const containerAlerta = document.getElementById('containerAlertaExt');
  if (!container) return;
  container.innerHTML = '';
  if (containerAlerta) containerAlerta.innerHTML = '';

  let numeroQuestao = 1;
  let paginaAtualIndex = 1;
  let houveEstouro = false;

  let { folha: folhaAtual, grid: gridAtual } = criarNovaFolha(paginaAtualIndex);
  container.appendChild(folhaAtual);

  listaQuestoesProva.forEach((item, index) => {
    if (item.tipo === 'quebra_pagina') {
      paginaAtualIndex++;
      const novaFolhaObj = criarNovaFolha(paginaAtualIndex);
      folhaAtual = novaFolhaObj.folha;
      gridAtual = novaFolhaObj.grid;
      container.appendChild(folhaAtual);

      const divisor = document.createElement('div');
      divisor.className = 'divisor-quebra-pagina';
      divisor.innerHTML = `
        <span>--- QUEBRA DE PÁGINA MANUAL ---</span>
        <div class="controles-questao" style="opacity:1; visibility:visible;">
          <button type="button" class="btn-del" onclick="removerItemProva('${item.idUnico}')">✖ Remover Quebra</button>
        </div>
      `;
      container.insertBefore(divisor, folhaAtual);
      return;
    }

    const card = document.createElement('div');
    card.className = 'card-questao';

    if (item.espacoExtra) {
      card.style.marginBottom = `${item.espacoExtra}px`;
    }

    let letras = ['A', 'B', 'C', 'D', 'E'];
    let htmlOpcoes = '';

    if (item.tipo === 'objetiva' && item.opcoes && item.opcoes.length > 0) {
      htmlOpcoes = '<ul class="opcoes-multipla-list">';
      item.opcoes.forEach((op, idx) => {
        htmlOpcoes += `<li><b>${letras[idx] || '•'})</b> ${op}</li>`;
      });
      htmlOpcoes += '</ul>';
    } else if (item.tipo === 'subjetiva' || !item.opcoes || item.opcoes.length === 0) {
      htmlOpcoes = `
        <div class="linhas-respostas-aberta"></div>
        <div class="linhas-respostas-aberta"></div>
      `;
    }

    card.innerHTML = `
      <div class="cabecalho-questao-topo">
        <span class="tag-questao">QUESTÃO ${numeroQuestao++}</span>
        
        <div class="controles-questao">
          <button type="button" class="btn-espaco" title="Aumentar espaço" onclick="alterarEspacoExtra(${index}, 15)">↕ +</button>
          <button type="button" class="btn-espaco" title="Reduzir espaço" onclick="alterarEspacoExtra(${index}, -15)">↕ -</button>
          <button type="button" class="btn-mover" title="Mover para cima" onclick="moverQuestao(${index}, -1)">▲</button>
          <button type="button" class="btn-mover" title="Mover para baixo" onclick="moverQuestao(${index}, 1)">▼</button>
          <button type="button" class="btn-del" title="Excluir Questão" onclick="removerItemProva('${item.idUnico}')">✖</button>
        </div>

        <span class="tag-descritor">${item.descritor || ''}</span>
      </div>
      <div class="linha-divisoria-questao"></div>
      <p class="enunciado-texto">${item.enunciado}</p>
      ${htmlOpcoes}
    `;

    gridAtual.appendChild(card);

    // VERIFICA SE ESTOUROU O ESPAÇO DA PÁGINA
    if (gridAtual.scrollHeight > gridAtual.clientHeight + 5) {
      houveEstouro = true;
      folhaAtual.classList.add('folha-estourada');
    }
  });

  // SE HOUVER ESTOURO, MOSTRA O AVISO VERMELHO FORA DA FOLHA
  if (houveEstouro && containerAlerta) {
    containerAlerta.innerHTML = `
      <div class="alerta-estouro-banner">
        ⚠️ Atenção: O conteúdo atingiu o limite da folha! Insira uma quebra de página ou reduza o espaço entre as questões.
      </div>
    `;
  }

  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([container]);
  }

  const info = document.getElementById('infoPaginas');
  if (info) info.innerText = `Total de Páginas: ${paginaAtualIndex}`;
}

// Imprimir
function imprimirProva() { 
  window.print(); 
}
