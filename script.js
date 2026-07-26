document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
       1. BARRA DIVISÓRIA MÓVEL (RESIZER)
       ========================================================== */
    const resizer = document.getElementById('dragHandle');
    const leftSide = document.getElementById('panelBuilder');
    const container = document.getElementById('appContainer');

    let x = 0;
    let leftWidth = 0;

    const mouseDownHandler = function (e) {
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        document.body.style.userSelect = 'none';
    };

    const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const newLeftWidth = ((leftWidth + dx) * 100) / container.getBoundingClientRect().width;
        
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            leftSide.style.width = `${newLeftWidth}%`;
        }
    };

    const mouseUpHandler = function () {
        document.body.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        // Re-renderiza para ajustar folha A4 após mudar espaço lateral
        renderizarProvaA4();
    };

    if (resizer && leftSide && container) {
        resizer.addEventListener('mousedown', mouseDownHandler);
    }


    /* ==========================================================
       2. ALTERNAR LAYOUT DE COLUNAS
       ========================================================== */
    const selectColunas = document.getElementById('selectColunas');

    if (selectColunas) {
        selectColunas.addEventListener('change', () => {
            renderizarProvaA4();
        });
    }


    /* ==========================================================
       3. UPLOAD DE LOGO
       ========================================================== */
    const inputLogo = document.getElementById('inputLogo');
    const imgLogo = document.getElementById('imgLogo');

    if (inputLogo && imgLogo) {
        inputLogo.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    imgLogo.src = event.target.result;
                };

                reader.readAsDataURL(file);
            }
        });
    }

});

/* ==========================================================
   GERENCIAMENTO DE ZOOM DA FOLHA DE PROVA
   ========================================================== */

let currentZoom = 1; // 1 = 100%

function applyZoom(newZoom) {
    // Trava o zoom entre 50% (0.5) e 150% (1.5)
    currentZoom = Math.min(Math.max(newZoom, 0.5), 1.5);

    // 1. Aplica a escala visual no container da folha
    const previewContainer = document.querySelector('.folha-a4');
    if (previewContainer) {
        previewContainer.style.transform = `scale(${currentZoom})`;
        previewContainer.style.transformOrigin = 'top center';
    }

    // 2. ATUALIZA OS NÚMEROS NO DISPLAY DO TOPO
    const zoomDisplay = document.getElementById('zoomLevel');
    if (zoomDisplay) {
        zoomDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

// Inicialização dos Eventos dos Botões de Zoom
document.addEventListener('DOMContentLoaded', () => {
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomReset = document.getElementById('btnZoomReset');

    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
            applyZoom(currentZoom + 0.1);
        });
    }

    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
            applyZoom(currentZoom - 0.1);
        });
    }

    if (btnZoomReset) {
        btnZoomReset.addEventListener('click', () => {
            applyZoom(1.0);
        });
    }
});

/* ==========================================================
   ALTERNAR MODO (BANCO x CRIAR)
   ========================================================== */
const btnModoBanco = document.getElementById('btnModoBanco');
const btnModoCriar = document.getElementById('btnModoCriar');
const areaBancoQuestoes = document.getElementById('areaBancoQuestoes');
const areaCriarQuestao = document.getElementById('areaCriarQuestao');

if (btnModoBanco && btnModoCriar) {
    btnModoBanco.addEventListener('click', () => {
        btnModoBanco.classList.add('active');
        btnModoCriar.classList.remove('active');
        
        areaBancoQuestoes.classList.remove('hidden');
        areaCriarQuestao.classList.add('hidden');
    });

    btnModoCriar.addEventListener('click', () => {
        btnModoCriar.classList.add('active');
        btnModoBanco.classList.remove('active');
        
        areaCriarQuestao.classList.remove('hidden');
        areaBancoQuestoes.classList.add('hidden');
    });
}

/* ==========================================================
   RECOLHER / EXPANDIR CABEÇALHO
   ========================================================== */
const btnToggleCabecalho = document.getElementById('btnToggleCabecalho');
const bodyCabecalho = document.getElementById('bodyCabecalho');
const toggleText = btnToggleCabecalho ? btnToggleCabecalho.querySelector('.toggle-text') : null;

if (btnToggleCabecalho && bodyCabecalho) {
    btnToggleCabecalho.addEventListener('click', () => {
        const isCollapsed = bodyCabecalho.classList.toggle('collapsed');
        btnToggleCabecalho.classList.toggle('collapsed');
        
        if (toggleText) {
            toggleText.textContent = isCollapsed ? 'Editar' : 'Recolher';
        }
    });
}

/* ==========================================================
   BANCO DE QUESTÕES (JSON + CARDS + MODAL)
   ========================================================== */
const filtroDescritor = document.getElementById('filtroDescritor');
const listaQuestoesBanco = document.getElementById('listaQuestoesBanco');

const modalPreview = document.getElementById('modalPreview');
const modalPreviewBody = document.getElementById('modalPreviewBody');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnAdicionarDoModal = document.getElementById('btnAdicionarDoModal');

let questaoSelecionadaAtual = null;

if (filtroDescritor && listaQuestoesBanco) {
    filtroDescritor.addEventListener('change', async (e) => {
        const descritor = e.target.value.toLowerCase();
        
        if (!descritor) {
            listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Selecione um descritor acima para carregar as questões.</p>';
            return;
        }

        listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Carregando questões...</p>';

        try {
            const response = await fetch(`questoes/${descritor}.json`);
            if (!response.ok) throw new Error("Arquivo não encontrado");

            const questoes = await response.json();
            renderizarListaCompacta(questoes);

        } catch (error) {
            listaQuestoesBanco.innerHTML = `<p class="placeholder-text" style="color: #d32f2f;">Não foi possível carregar o arquivo <strong>questoes/${descritor}.json</strong>.</p>`;
        }
    });
}

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

        item.querySelector('.btn-prev').addEventListener('click', () => abrirModalPreview(q));
        item.querySelector('.btn-add').addEventListener('click', () => adicionarQuestaoNaProva(q));

        listaQuestoesBanco.appendChild(item);
    });
}

function abrirModalPreview(questao) {
    questaoSelecionadaAtual = questao;

    let html = `<p><strong>Descritor:</strong> ${questao.descritor || 'N/A'}</p>`;
    html += `<p style="margin-top: 0.5rem; line-height: 1.4;">${questao.enunciado}</p>`;

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
   GERENCIAMENTO DE QUESTÕES E QUEBRAS DE PÁGINA
   ========================================================== */

let questoesNaProva = [];

// Adicionar Questão na Prova
function adicionarQuestaoNaProva(questao) {
    const novaQuestao = JSON.parse(JSON.stringify(questao));
    novaQuestao.espacoInferior = 1;
    novaQuestao.quebraApos = false;
    
    questoesNaProva.push(novaQuestao);
    renderizarProvaA4();
}

/* ==========================================================
   INSERIR / REMOVER QUEBRA DE PÁGINA COM PÁGINA VAZIA
   ========================================================== */

const btnInserirQuebra = document.getElementById('btnInserirQuebra');

if (btnInserirQuebra) {
    btnInserirQuebra.addEventListener('click', () => {
        // Se a prova estiver completamente vazia, não faz nada
        if (questoesNaProva.length === 0) {
            alert("Adicione pelo menos uma questão antes de inserir uma quebra de página.");
            return;
        }

        // Pega a última questão adicionada até agora
        const ultimaQuestao = questoesNaProva[questoesNaProva.length - 1];

        // Alterna o estado de quebra (se já tinha, remove; se não tinha, ativa)
        ultimaQuestao.quebraApos = !ultimaQuestao.quebraApos;

        // Renderiza a prova atualizada imediatamente
        renderizarProvaA4();
    });
}

// Função para remover a quebra associada a uma questão específica
function removerQuebraPagina(indexQuestao) {
    if (questoesNaProva[indexQuestao]) {
        questoesNaProva[indexQuestao].quebraApos = false;
        renderizarProvaA4();
    }
}
// Botão "Refazer Prova" (Topbar)
const btnRefazerProva = document.getElementById('btnRefazerProva');
if (btnRefazerProva) {
    btnRefazerProva.addEventListener('click', () => {
        if (questoesNaProva.length === 0) {
            alert("A prova já está vazia!");
            return;
        }

        if (confirm("Tem certeza que deseja reiniciar a prova? Todas as questões serão removidas.")) {
            questoesNaProva = [];
            renderizarProvaA4();
        }
    });
}

// Criação do elemento HTML da Questão
function criarElementoQuestaoHTML(q, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'coluna-questao';
    wrapper.style.marginBottom = `${q.espacoInferior || 1}rem`;

    let htmlAcoes = `
        <div class="q-actions-toolbar">
            <button type="button" class="btn-q-action btn-q-space-plus" title="Aumentar Espaço">+</button>
            <button type="button" class="btn-q-action btn-q-space-minus" title="Diminuir Espaço">-</button>
            <button type="button" class="btn-q-action btn-q-move-up" title="Mover para Cima">▲</button>
            <button type="button" class="btn-q-action btn-q-move-down" title="Mover para Baixo">▼</button>
            <button type="button" class="btn-q-action btn-q-delete" title="Excluir Questão">✖</button>
        </div>
    `;

    let htmlTabela = '';
    if (q.tabela) {
        htmlTabela += `<table class="tabela-questao" style="margin: 0.5rem 0;">`;
        if (q.tabela.cabecalhos) {
            htmlTabela += `<thead><tr>${q.tabela.cabecalhos.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        }
        if (q.tabela.linhas) {
            htmlTabela += `<tbody>${q.tabela.linhas.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        }
        htmlTabela += `</table>`;
    }

    let htmlAlternativas = '';
    if (q.alternativas) {
        htmlAlternativas += `<div style="display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem; font-size: 0.82rem;">`;
        for (let key in q.alternativas) {
            htmlAlternativas += `<div><strong>(${key})</strong> ${q.alternativas[key]}</div>`;
        }
        htmlAlternativas += `</div>`;
    }

    wrapper.innerHTML = `
        <div class="item-questao">
            <div class="questao-header-pilar">
                <div class="questao-title-group">
                    <span class="box-num-questao">QUESTÃO ${index + 1}</span>
                    ${htmlAcoes}
                </div>
                <span class="tag-descritor">${q.descritor || 'D1'}</span>
            </div>
            <div class="enunciado-pilar">${q.enunciado}</div>
            ${htmlTabela}
            ${htmlAlternativas}
        </div>
    `;

    // Eventos dos botões individuais
    wrapper.querySelector('.btn-q-space-plus').addEventListener('click', () => {
        q.espacoInferior = (q.espacoInferior || 1) + 0.5;
        renderizarProvaA4();
    });

    wrapper.querySelector('.btn-q-space-minus').addEventListener('click', () => {
        if ((q.espacoInferior || 1) > 0.5) {
            q.espacoInferior -= 0.5;
            renderizarProvaA4();
        }
    });

    wrapper.querySelector('.btn-q-move-up').addEventListener('click', () => {
        if (index > 0) {
            const temp = questoesNaProva[index];
            questoesNaProva[index] = questoesNaProva[index - 1];
            questoesNaProva[index - 1] = temp;
            renderizarProvaA4();
        }
    });

    wrapper.querySelector('.btn-q-move-down').addEventListener('click', () => {
        if (index < questoesNaProva.length - 1) {
            const temp = questoesNaProva[index];
            questoesNaProva[index] = questoesNaProva[index + 1];
            questoesNaProva[index + 1] = temp;
            renderizarProvaA4();
        }
    });

    wrapper.querySelector('.btn-q-delete').addEventListener('click', () => {
        questoesNaProva.splice(index, 1);
        renderizarProvaA4();
    });

    return wrapper;
}

/**
 * RENDERIZAÇÃO A4 COM CRIAÇÃO DE NOVA PÁGINA GARANTIDA
 */
function renderizarProvaA4() {
    const primeiraFolha = document.querySelector('.folha-a4');
    if (!primeiraFolha) return;

    // Limpa páginas geradas anteriormente
    document.querySelectorAll('.folha-a4-gerada').forEach(el => el.remove());

    const containerPrimeiraPagina = primeiraFolha.querySelector('.prova-questoes-2colunas');
    if (!containerPrimeiraPagina) return;

    containerPrimeiraPagina.innerHTML = '';

    const selectColunas = document.getElementById('selectColunas');
    const layoutUmaColuna = selectColunas && selectColunas.value === '1';

    let folhaAtual = primeiraFolha;
    let containerAtual = containerPrimeiraPagina;
    let numeroPagina = 1;

    questoesNaProva.forEach((q, idx) => {
        // Adiciona a questão
        const elQuestao = criarElementoQuestaoHTML(q, idx);
        containerAtual.appendChild(elQuestao);

        // Se a questão possui quebra de página ativada
        if (q.quebraApos) {
            numeroPagina++;

            // 1. Cria imediatamente a nova folha A4 vazia
            const novaFolha = document.createElement('div');
            novaFolha.className = 'folha-a4 folha-a4-gerada';
            novaFolha.id = `pagina-a4-${numeroPagina}`;

            novaFolha.innerHTML = `
                <div class="cabecalho-pagina-secundaria">
                    <span>SIMULADO SAEB</span>
                    <span>Página ${numeroPagina}</span>
                </div>
                <!-- Banner com botão para Remover a Página/Quebra -->
                <div class="banner-quebra-pagina">
                    <span>✂️ Quebra de página inserida aqui</span>
                    <button type="button" class="btn-remover-quebra" onclick="removerQuebraPagina(${idx})">
                        🗑️ Remover Página
                    </button>
                </div>
                <div class="prova-questoes-2colunas ${layoutUmaColuna ? 'layout-1coluna' : ''}"></div>
            `;

            // Insere a nova página no DOM
            folhaAtual.parentNode.insertBefore(novaFolha, folhaAtual.nextSibling);

            // Atualiza os ponteiros para que as próximas questões entrem nesta nova folha
            folhaAtual = novaFolha;
            containerAtual = novaFolha.querySelector('.prova-questoes-2colunas');
        }
    });
}

/* ==========================================================
   SINCRONIZAÇÃO E ATUALIZAÇÃO DO CABEÇALHO EM TEMPO REAL
   ========================================================== */

function inicializarEventosCabecalho() {
    // 1. Nome da Escola
    const inputNomeEscola = document.getElementById('inputNomeEscola');
    const displayNomeEscola = document.querySelector('.nome-escola');
    if (inputNomeEscola && displayNomeEscola) {
        inputNomeEscola.addEventListener('input', (e) => {
            displayNomeEscola.textContent = e.target.value.toUpperCase();
        });
    }

    // 2. Título da Prova
    const inputTituloProva = document.getElementById('inputTituloProva');
    const displayTituloProva = document.querySelector('.titulo-prova');
    if (inputTituloProva && displayTituloProva) {
        inputTituloProva.addEventListener('input', (e) => {
            displayTituloProva.textContent = e.target.value.toUpperCase();
        });
    }

    // 3. Série / Etapa
    const inputSerie = document.getElementById('inputSerie');
    const displaySerie = document.querySelector('.info-serie'); 
    if (inputSerie && displaySerie) {
        inputSerie.addEventListener('input', (e) => {
            displaySerie.textContent = e.target.value;
        });
    }

    // 4. Turma
    const inputTurma = document.getElementById('inputTurma');
    const displayTurma = document.querySelector('.info-turma');
    if (inputTurma && displayTurma) {
        inputTurma.addEventListener('input', (e) => {
            displayTurma.textContent = e.target.value;
        });
    }

    // 5. Professor(a)
    const inputProfessor = document.getElementById('inputProfessor');
    const displayProfessor = document.querySelector('.info-professor');
    if (inputProfessor && displayProfessor) {
        inputProfessor.addEventListener('input', (e) => {
            displayProfessor.textContent = e.target.value;
        });
    }
}

// Chame a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventosCabecalho();
});
