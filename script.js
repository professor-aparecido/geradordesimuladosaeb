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
   CONTROLE DE ZOOM
   ========================================================== */
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomReset = document.getElementById('btnZoomReset');
const zoomVal = document.getElementById('zoomVal');

let currentZoom = 1;

function updateZoom() {
    document.querySelectorAll('.folha-a4').forEach(folha => {
        folha.style.transform = `scale(${currentZoom})`;
        folha.style.transformOrigin = 'top center';
    });
    
    if (zoomVal) {
        zoomVal.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

if (btnZoomIn && btnZoomOut && btnZoomReset) {
    btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 1.5) {
            currentZoom += 0.1;
            updateZoom();
        }
    });

    btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.1;
            updateZoom();
        }
    });

    btnZoomReset.addEventListener('click', () => {
        currentZoom = 1;
        updateZoom();
    });
}

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
   GERENCIAMENTO DE QUESTÕES E QUEBRAS DE PÁGINA MANUAIS
   ========================================================== */

let questoesNaProva = [];

// Função para Adicionar Questão
function adicionarQuestaoNaProva(questao) {
    const novaQuestao = JSON.parse(JSON.stringify(questao));
    novaQuestao.espacoInferior = 1;
    novaQuestao.quebraApos = false; // Controle manual de quebra
    
    questoesNaProva.push(novaQuestao);
    renderizarProvaA4();
}

// Botão "Refazer Prova" / Reiniciar
const btnRefazerProva = document.getElementById('btnRefazerProva');
if (btnRefazerProva) {
    btnRefazerProva.addEventListener('click', () => {
        if (questoesNaProva.length === 0) {
            alert("A prova já está vazia!");
            return;
        }

        if (confirm("Tem certeza que deseja reiniciar a prova? Todas as questões adicionadas serão removidas.")) {
            questoesNaProva = [];
            renderizarProvaA4();
        }
    });
}

function criarElementoQuestaoHTML(q, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'coluna-questao';
    wrapper.style.marginBottom = `${q.espacoInferior || 1}rem`;

    // Botões de Ação na Questão
    let htmlAcoes = `
        <div class="q-actions-toolbar">
            <button type="button" class="btn-q-action btn-q-pagebreak ${q.quebraApos ? 'active' : ''}" 
                    style="background-color: ${q.quebraApos ? '#ef4444' : '#6b7280'};" 
                    title="Inserir/Remover Quebra de Página após esta questão">
                ✂️ ${q.quebraApos ? 'Remover Quebra' : 'Quebrar Página'}
            </button>
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

    // Eventos dos Botões
    wrapper.querySelector('.btn-q-pagebreak').addEventListener('click', () => {
        q.quebraApos = !q.quebraApos;
        renderizarProvaA4();
    });

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
 * Renderiza as folhas dividindo com base na quebra manual (ou limite seguro)
 */
function renderizarProvaA4() {
    const primeiraFolha = document.querySelector('.folha-a4');
    if (!primeiraFolha) return;

    // Limpa páginas secundárias
    document.querySelectorAll('.folha-a4-gerada').forEach(el => el.remove());

    const containerPrimeiraPagina = primeiraFolha.querySelector('.prova-questoes-2colunas');
    if (!containerPrimeiraPagina) return;

    containerPrimeiraPagina.innerHTML = '';
    if (questoesNaProva.length === 0) return;

    const selectColunas = document.getElementById('selectColunas');
    const layoutUmaColuna = selectColunas && selectColunas.value === '1';

    let folhaAtual = primeiraFolha;
    let containerAtual = containerPrimeiraPagina;
    let numeroPagina = 1;

    if (layoutUmaColuna) {
        containerAtual.classList.add('layout-1coluna');
    } else {
        containerAtual.classList.remove('layout-1coluna');
    }

    questoesNaProva.forEach((q, idx) => {
        const elQuestao = criarElementoQuestaoHTML(q, idx);
        containerAtual.appendChild(elQuestao);

        // Se o usuário clicou no botão "Quebrar Página" nesta questão
        if (q.quebraApos && idx < questoesNaProva.length - 1) {
            
            // Adiciona a mensagem visual na tela informando a quebra
            const avisoQuebra = document.createElement('div');
            avisoQuebra.className = 'indicador-quebra-pagina';
            avisoQuebra.innerHTML = `✂️ QUEBRA DE PÁGINA — (Próxima questão vai para a Página ${numeroPagina + 1})`;
            containerAtual.appendChild(avisoQuebra);

            // Cria a nova folha A4
            numeroPagina++;
            const novaFolha = document.createElement('div');
            novaFolha.className = 'folha-a4 folha-a4-gerada';
            novaFolha.id = `pagina-a4-${numeroPagina}`;

            novaFolha.innerHTML = `
                <div style="border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 15px; font-size: 0.8rem; display: flex; justify-content: space-between; font-weight: bold;">
                    <span>SIMULADO SAEB</span>
                    <span>Página ${numeroPagina}</span>
                </div>
                <div class="prova-questoes-2colunas ${layoutUmaColuna ? 'layout-1coluna' : ''}"></div>
            `;

            folhaAtual.parentNode.insertBefore(novaFolha, folhaAtual.nextSibling);

            folhaAtual = novaFolha;
            containerAtual = novaFolha.querySelector('.prova-questoes-2colunas');
        }
    });

    if (typeof updateZoom === 'function') {
        updateZoom();
    }
}
