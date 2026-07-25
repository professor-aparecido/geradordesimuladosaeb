// Aguarda o carregamento completo do DOM antes de executar as funções
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. BARRA DIVISÓRIA MÓVEL (REDIMENSIONAMENTO DOS PAINÉIS)
       ========================================================== */
    const resizer = document.getElementById('dragHandle');
    const leftSide = document.getElementById('panelBuilder');
    const container = document.getElementById('appContainer');

    let x = 0;
    let leftWidth = 0;

    // Disparado quando o usuário clica na barra divisória
    const mouseDownHandler = function (e) {
        // Captura a posição X inicial do mouse e a largura atual do painel esquerdo
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Escuta os movimentos do mouse e o momento de soltar o clique
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        // Evita que o texto da tela seja selecionado sem querer enquanto arrasta
        document.body.style.userSelect = 'none';
    };

    // Disparado enquanto o usuário move o mouse com o botão pressionado
    const mouseMoveHandler = function (e) {
        // Calcula a distância movida
        const dx = e.clientX - x;
        
        // Converte a nova largura para porcentagem relativa ao container
        const newLeftWidth = ((leftWidth + dx) * 100) / container.getBoundingClientRect().width;
        
        // Define limites para a barra (mínimo 20% e máximo 80% da tela)
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            leftSide.style.width = `${newLeftWidth}%`;
        }
    };

    // Disparado quando o usuário solta o botão do mouse
    const mouseUpHandler = function () {
        // Restaura a seleção de texto normal da página
        document.body.style.removeProperty('user-select');

        // Remove os ouvintes de evento temporários
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Associa o clique inicial na barra divisória (se a barra existir na página)
    if (resizer && leftSide && container) {
        resizer.addEventListener('mousedown', mouseDownHandler);
    }


    /* ==========================================================
       2. ALTERNAR LAYOUT DAS QUESTÕES (1 OU 2 COLUNAS)
       ========================================================== */
    const selectColunas = document.getElementById('selectColunas');
    const containerQuestoes = document.querySelector('.prova-questoes-2colunas');

    if (selectColunas && containerQuestoes) {
        selectColunas.addEventListener('change', (e) => {
            // Se a opção selecionada for "1", adiciona a classe CSS de 1 coluna
            if (e.target.value === '1') {
                containerQuestoes.classList.add('layout-1coluna');
            } else {
                // Caso contrário, remove a classe e volta ao padrão de 2 colunas
                containerQuestoes.classList.remove('layout-1coluna');
            }
        });
    }


    /* ==========================================================
       3. UPLOAD E ATUALIZAÇÃO DA LOGO DA ESCOLA
       ========================================================== */
    const inputLogo = document.getElementById('inputLogo');
    const imgLogo = document.getElementById('imgLogo');

    if (inputLogo && imgLogo) {
        inputLogo.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            // Se um arquivo de imagem foi selecionado
            if (file) {
                const reader = new FileReader();

                // Quando a imagem for lida, substitui a URL do elemento <img> na folha A4
                reader.onload = function(event) {
                    imgLogo.src = event.target.result;
                };

                // Lê o arquivo local como uma URL de dados (base64)
                reader.readAsDataURL(file);
            }
        });
    }

});

/* ==========================================================
   CONTROLE DE ZOOM NA PRÉ-VISUALIZAÇÃO
   ========================================================== */
const folhaA4 = document.querySelector('.folha-a4');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomReset = document.getElementById('btnZoomReset');
const zoomVal = document.getElementById('zoomVal');

let currentZoom = 1; // 1 = 100%

function updateZoom() {
    // Aplica a escala visual na folha A4
    folhaA4.style.transform = `scale(${currentZoom})`;
    // Atualiza o texto da porcentagem na tela
    zoomVal.textContent = `${Math.round(currentZoom * 100)}%`;
}

if (folhaA4 && btnZoomIn && btnZoomOut && btnZoomReset) {
    // Aumenta o Zoom (limite máximo de 150%)
    btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 1.5) {
            currentZoom += 0.1;
            updateZoom();
        }
    });

    // Diminui o Zoom (limite mínimo de 50%)
    btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.1;
            updateZoom();
        }
    });

    // Reseta para 100%
    btnZoomReset.addEventListener('click', () => {
        currentZoom = 1;
        updateZoom();
    });
}

/* ==========================================================
   ALTERNAR MODO DE QUESTÕES (BANCO x CRIAR) - [ATUALIZADO]
   ========================================================== */
const btnModoBanco = document.getElementById('btnModoBanco');
const btnModoCriar = document.getElementById('btnModoCriar');
const areaBancoQuestoes = document.getElementById('areaBancoQuestoes');
const areaCriarQuestao = document.getElementById('areaCriarQuestao');

if (btnModoBanco && btnModoCriar) {
    // Clique no Banco de Questões
    btnModoBanco.addEventListener('click', () => {
        btnModoBanco.classList.add('active');
        btnModoCriar.classList.remove('active');
        
        areaBancoQuestoes.classList.remove('hidden');
        areaCriarQuestao.classList.add('hidden'); // Oculta o formulário de criar
    });

    // Clique em Criar Questão
    btnModoCriar.addEventListener('click', () => {
        btnModoCriar.classList.add('active');
        btnModoBanco.classList.remove('active');
        
        areaCriarQuestao.classList.remove('hidden');
        areaBancoQuestoes.classList.add('hidden'); // Oculta o banco de questões (CORRIGIDO)
    });
}

/* ========================================== */
/* LÓGICA PARA RECOLHER / EXPANDIR O CABEÇALHO */
/* ========================================== */
const btnToggleCabecalho = document.getElementById('btnToggleCabecalho');
const bodyCabecalho = document.getElementById('bodyCabecalho');
const toggleText = btnToggleCabecalho ? btnToggleCabecalho.querySelector('.toggle-text') : null;

if (btnToggleCabecalho && bodyCabecalho) {
    btnToggleCabecalho.addEventListener('click', () => {
        const isCollapsed = bodyCabecalho.classList.toggle('collapsed');
        btnToggleCabecalho.classList.toggle('collapsed');
        
        // Atualiza o texto do botão conforme o estado
        if (toggleText) {
            toggleText.textContent = isCollapsed ? 'Editar' : 'Recolher';
        }
    });
}

/* ==========================================================
   LÓGICA DO BANCO DE QUESTÕES (JSON + CARDS COMPACTOS + MODAL)
   ========================================================== */
const filtroDescritor = document.getElementById('filtroDescritor');
const listaQuestoesBanco = document.getElementById('listaQuestoesBanco');

// Elementos do Modal de Pré-visualização
const modalPreview = document.getElementById('modalPreview');
const modalPreviewBody = document.getElementById('modalPreviewBody');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnAdicionarDoModal = document.getElementById('btnAdicionarDoModal');

let questaoSelecionadaAtual = null;

// Evento ao selecionar um descritor no filtro
if (filtroDescritor && listaQuestoesBanco) {
    filtroDescritor.addEventListener('change', async (e) => {
        const descritor = e.target.value.toLowerCase(); // Garante minúsculas para o arquivo d1.json...
        
        if (!descritor) {
            listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Selecione um descritor acima para carregar as questões.</p>';
            return;
        }

        listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Carregando questões...</p>';

        try {
            // Busca o arquivo dinâmico d1.json, d2.json ... d36.json dentro da pasta "questoes/"
            const response = await fetch(`questoes/${descritor}.json`);
            if (!response.ok) throw new Error("Arquivo não encontrado");

            const questoes = await response.json();
            renderizarListaCompacta(questoes);

        } catch (error) {
            listaQuestoesBanco.innerHTML = `<p class="placeholder-text" style="color: #d32f2f;">Não foi possível carregar o arquivo <strong>questoes/${descritor}.json</strong>.</p>`;
        }
    });
}

// Renderiza cada questão em formato de linha compacta com botões à direita
function renderizarListaCompacta(questoes) {
    if (questoes.length === 0) {
        listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Nenhuma questão cadastrada para este descritor.</p>';
        return;
    }

    listaQuestoesBanco.innerHTML = '';

    questoes.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = 'item-banco-compacto';
        item.innerHTML = `
            <span class="texto-questao-resumo" title="${q.enunciado}">
                <strong>Q${idx + 1}:</strong> ${q.enunciado}
            </span>
            <div class="acoes-compactas">
                <button type="button" class="btn-icon-sm btn-prev" title="Pré-visualizar questão">👁️</button>
                <button type="button" class="btn-icon-sm btn-add" title="Adicionar questão à prova">➕</button>
            </div>
        `;

        // Evento de clique para Pré-visualizar no Modal
        item.querySelector('.btn-prev').addEventListener('click', () => abrirModalPreview(q));

        // Evento de clique para Adicionar direto na prova A4
        item.querySelector('.btn-add').addEventListener('click', () => adicionarQuestaoNaProva(q));

        listaQuestoesBanco.appendChild(item);
    });
}

// Exibe a janela Modal com o conteúdo detalhado da questão
function abrirModalPreview(questao) {
    questaoSelecionadaAtual = questao;

    let html = `<p><strong>Descritor:</strong> ${questao.descritor || 'N/A'}</p>`;
    html += `<p style="margin-top: 0.5rem; line-height: 1.4;">${questao.enunciado}</p>`;

    // Se houver tabela cadastrada no JSON
    if (questao.tabela) {
        html += `<table class="tabela-questao" style="margin: 0.8rem 0; width:100%; border-collapse:collapse;">`;
        if (questao.tabela.cabecalhos) {
            html += `<thead><tr>${questao.tabela.cabecalhos.map(h => `<th style="border:1px solid #ccc; padding:4px;">${h}</th>`).join('')}</tr></thead>`;
        }
        if (questao.tabela.linhas) {
            html += `<tbody>${questao.tabela.linhas.map(row => `<tr>${row.map(cell => `<td style="border:1px solid #ccc; padding:4px;">${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        }
        html += `</table>`;
    }

    // Se houver alternativas cadastradas
    if (questao.alternativas) {
        html += `<ul style="list-style: none; padding: 0; margin-top: 0.8rem;">`;
        for (let key in questao.alternativas) {
            const isCorreta = questao.respostaCorreta === key ? ' (Correta)' : '';
            html += `<li style="margin-bottom: 0.3rem;"><strong>${key})</strong> ${questao.alternativas[key]} <em>${isCorreta}</em></li>`;
        }
        html += `</ul>`;
    }

    modalPreviewBody.innerHTML = html;
    modalPreview.classList.remove('hidden');
}

// Controles de fechamento e adição via Modal
if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => modalPreview.classList.add('hidden'));
}

if (btnAdicionarDoModal) {
    btnAdicionarDoModal.addEventListener('click', () => {
        if (questaoSelecionadaAtual) {
            adicionarQuestaoNaProva(questaoSelecionadaAtual);
            modalPreview.classList.add('hidden');
        }
    });
}

/* ==========================================================
   SISTEMA DE PAGINAÇÃO AUTOMÁTICA EM MÚLTIPLAS FOLHAS A4
   ========================================================== */

let questoesNaProva = [];

// Altura máxima do conteúdo em pixels dentro de uma folha A4 (descontando as margens)
const ALTURA_UTIL_A4_PX = 920; 

function adicionarQuestaoNaProva(questao) {
    const novaQuestao = JSON.parse(JSON.stringify(questao));
    novaQuestao.espacoInferior = 1;
    questoesNaProva.push(novaQuestao);
    renderizarProvaA4();
}

/**
 * Renderiza as questões distribuindo-as automaticamente em Páginas A4
 */
function renderizarProvaA4() {
    const previewContainer = document.getElementById('previewContainer') || document.querySelector('.preview-area');
    if (!previewContainer) return;

    // Limpa todas as folhas anteriores
    previewContainer.innerHTML = '';

    if (questoesNaProva.length === 0) {
        // Cria uma folha A4 vazia padrão
        const folhaVazia = criarEstruturaFolhaA4(1);
        previewContainer.appendChild(folhaVazia);
        return;
    }

    let numeroPagina = 1;
    let folhaAtual = criarEstruturaFolhaA4(numeroPagina);
    previewContainer.appendChild(folhaAtual);

    let containerQuestoesAtual = folhaAtual.querySelector('.prova-questoes-2colunas');
    
    // Mantém o layout de 1 ou 2 colunas selecionado pelo usuário
    const selectColunas = document.getElementById('selectColunas');
    if (selectColunas && selectColunas.value === '1') {
        containerQuestoesAtual.classList.add('layout-1coluna');
    }

    // Processa e aloca cada questão na folha correta
    questoesNaProva.forEach((q, idx) => {
        const elementoQuestao = criarElementoQuestaoHTML(q, idx);
        
        // Adiciona temporariamente para medir a altura real
        containerQuestoesAtual.appendChild(elementoQuestao);

        // Verifica se o conteúdo da folha ultrapassou a altura limite A4
        // (Considera o cabeçalho apenas na Primeira Página)
        const alturaLimite = (numeroPagina === 1) ? ALTURA_UTIL_A4_PX : (ALTURA_UTIL_A4_PX + 150);

        if (folhaAtual.offsetHeight > alturaLimite && containerQuestoesAtual.children.length > 1) {
            // Remove a questão da folha atual
            containerQuestoesAtual.removeChild(elementoQuestao);

            // Cria uma NOVA folha A4 (Página 2, Página 3...)
            numeroPagina++;
            folhaAtual = criarEstruturaFolhaA4(numeroPagina, false); // false = sem cabeçalho da escola
            previewContainer.appendChild(folhaAtual);

            containerQuestoesAtual = folhaAtual.querySelector('.prova-questoes-2colunas');
            if (selectColunas && selectColunas.value === '1') {
                containerQuestoesAtual.classList.add('layout-1coluna');
            }

            // Adiciona a questão na nova folha
            containerQuestoesAtual.appendChild(elementoQuestao);
        }
    });
}

/**
 * Monta o container de uma folha A4 (com ou sem o Cabeçalho da Escola)
 */
function criarEstruturaFolhaA4(numPagina, incluirCabecalho = true) {
    const divFolha = document.createElement('div');
    divFolha.className = 'folha-a4';
    divFolha.id = `pagina-a4-${numPagina}`;

    let htmlInterno = '';

    // Se for a primeira página, clona/mantém o cabeçalho da escola
    if (incluirCabecalho) {
        const cabecalhoExistente = document.getElementById('cabecalhoProvaTemplate');
        if (cabecalhoExistente) {
            htmlInterno += cabecalhoExistente.outerHTML;
        } else {
            // Caso não tenha template separado, busca o elemento atual do HTML
            const elemCabecalho = document.querySelector('.cabecalho-prova-container');
            if (elemCabecalho) htmlInterno += elemCabecalho.outerHTML;
        }
    } else {
        // Cabeçalho simples/compacto para as páginas seguintes
        htmlInterno += `
            <div style="border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 15px; font-size: 0.8rem; display: flex; justify-content: space-between;">
                <span>PROVA DE MATEMÁTICA</span>
                <span>Página ${numPagina}</span>
            </div>
        `;
    }

    htmlInterno += `<div class="prova-questoes-2colunas"></div>`;
    divFolha.innerHTML = htmlInterno;

    return divFolha;
}

/**
 * Cria o elemento HTML de uma única questão
 */
function criarElementoQuestaoHTML(q, idx) {
    const numQuestao = idx + 1;
    const novaColuna = document.createElement('div');
    novaColuna.className = 'coluna-questao';
    novaColuna.style.marginBottom = `${q.espacoInferior || 1}rem`;

    const desabilitarSubir = idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : '';
    const desabilitarDescer = idx === questoesNaProva.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : '';

    let htmlQuestao = `
        <div class="item-questao">
            <div class="questao-header-pilar">
                <div class="questao-title-group">
                    <span class="box-num-questao">QUESTÃO ${numQuestao}</span>

                    <div class="q-actions-toolbar">
                        <button type="button" class="btn-q-action btn-q-space-plus" onclick="ajustarEspacoQuestao(${idx}, 0.5)" title="Aumentar espaço">↕ +</button>
                        <button type="button" class="btn-q-action btn-q-space-minus" onclick="ajustarEspacoQuestao(${idx}, -0.5)" title="Diminuir espaço">↕ -</button>
                        <button type="button" class="btn-q-action btn-q-move-up" onclick="moverQuestaoNaProva(${idx}, -1)" ${desabilitarSubir} title="Subir questão">▲</button>
                        <button type="button" class="btn-q-action btn-q-move-down" onclick="moverQuestaoNaProva(${idx}, 1)" ${desabilitarDescer} title="Descer questão">▼</button>
                        <button type="button" class="btn-q-action btn-q-delete" onclick="removerQuestaoDaProva(${idx})" title="Excluir questão">✖</button>
                    </div>
                </div>

                ${q.descritor ? `<span class="tag-descritor">${q.descritor}</span>` : ''}
            </div>

            <p class="enunciado-pilar">${q.enunciado}</p>
    `;

    if (q.tabela) {
        htmlQuestao += `<table class="tabela-questao">`;
        if (q.tabela.cabecalhos) {
            htmlQuestao += `<thead><tr>${q.tabela.cabecalhos.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        }
        if (q.tabela.linhas) {
            htmlQuestao += `<tbody>${q.tabela.linhas.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        }
        htmlQuestao += `</table>`;
    }

    if (q.alternativas) {
        htmlQuestao += `<div class="alternativas-prova" style="margin-top:0.5rem;">`;
        for (let key in q.alternativas) {
            htmlQuestao += `<div style="font-size:0.82rem; margin-bottom:2px;"><strong>(${key})</strong> ${q.alternativas[key]}</div>`;
        }
        htmlQuestao += `</div>`;
    }

    htmlQuestao += `</div>`;
    novaColuna.innerHTML = htmlQuestao;

    return novaColuna;
}
