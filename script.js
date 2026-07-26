/* ==========================================================
   GERADOR DE SIMULADOS SAEB - LÓGICA COMPLETA (script.js)
   ========================================================== */

// Estado Global da Aplicação
let currentZoom = 1;
let questoesNaProva = [];
let questaoSelecionadaAtual = null;

document.addEventListener('DOMContentLoaded', () => {
    inicializarResizer();
    inicializarZoom();
    inicializarModosEModais();
    inicializarEventosCabecalho();
    inicializarCriacaoManual();
    inicializarBancoQuestoes();
});

/* ==========================================================
   1. BARRA DIVISÓRIA MÓVEL (RESIZER)
   ========================================================== */
function inicializarResizer() {
    const resizer = document.getElementById('dragHandle');
    const leftSide = document.getElementById('panelBuilder');
    const container = document.getElementById('appContainer');

    if (!resizer || !leftSide || !container) return;

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

        renderizarProvaA4();
    };

    resizer.addEventListener('mousedown', mouseDownHandler);

    // Evento de alteração de layout (1 ou 2 colunas)
    const selectColunas = document.getElementById('selectColunas');
    if (selectColunas) {
        selectColunas.addEventListener('change', () => {
            renderizarProvaA4();
        });
    }
}

/* ==========================================================
   2. CONTROLE DE ZOOM
   ========================================================== */
function applyZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, 0.5), 1.5);

    const wrapper = document.getElementById('provaPagesWrapper') || document.querySelector('.prova-pages-wrapper');
    if (wrapper) {
        wrapper.style.transform = `scale(${currentZoom})`;
    }

    const zoomDisplay = document.getElementById('zoomLevel');
    if (zoomDisplay) {
        zoomDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

function inicializarZoom() {
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomReset = document.getElementById('btnZoomReset');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => applyZoom(currentZoom + 0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => applyZoom(currentZoom - 0.1));
    if (btnZoomReset) btnZoomReset.addEventListener('click', () => applyZoom(1.0));
}

/* ==========================================================
   3. TROCA DE MODOS E PAINÉIS EXPANDÍVEIS
   ========================================================== */
function inicializarModosEModais() {
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

    // Recolher / Expandir Cabeçalho
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

    // Botões Principais da Topbar
    const btnInserirQuebra = document.getElementById('btnInserirQuebra');
    if (btnInserirQuebra) {
        btnInserirQuebra.addEventListener('click', () => {
            if (questoesNaProva.length === 0) {
                alert("Adicione pelo menos uma questão antes de inserir uma quebra de página.");
                return;
            }
            const ultimaQuestao = questoesNaProva[questoesNaProva.length - 1];
            ultimaQuestao.quebraApos = !ultimaQuestao.quebraApos;
            renderizarProvaA4();
        });
    }

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
}

/* ==========================================================
   4. SINCRONIZAÇÃO DO CABEÇALHO EM TEMPO REAL
   ========================================================== */
function inicializarEventosCabecalho() {
    const mapeamento = [
        { input: 'inputNomeEscola', display: 'displayNomeEscola', uppercase: true },
        { input: 'inputTituloProva', display: 'displayTituloProva', uppercase: true },
        { input: 'inputSerie', display: 'displaySerie', uppercase: false },
        { input: 'inputTurma', display: 'displayTurma', uppercase: false },
        { input: 'inputProfessor', display: 'displayProfessor', uppercase: false }
    ];

    mapeamento.forEach(item => {
        const inputEl = document.getElementById(item.input);
        const displayEl = document.getElementById(item.display);

        if (inputEl && displayEl) {
            inputEl.addEventListener('input', (e) => {
                displayEl.textContent = item.uppercase ? e.target.value.toUpperCase() : e.target.value;
            });
        }
    });

    // Upload da Logo da Escola
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
}

/* ==========================================================
   5. BANCO DE QUESTÕES (JSON + FILTRO + MODAL)
   ========================================================== */
function inicializarBancoQuestoes() {
    const filtroDescritor = document.getElementById('filtroDescritor');
    const listaQuestoesBanco = document.getElementById('listaQuestoesBanco');
    const modalPreview = document.getElementById('modalPreview');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const btnAdicionarDoModal = document.getElementById('btnAdicionarDoModal');

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
                listaQuestoesBanco.innerHTML = `<p class="placeholder-text" style="color: #dc2626;">Não foi possível carregar a pasta/arquivo <strong>questoes/${descritor}.json</strong>.</p>`;
            }
        });
    }

    if (btnFecharModal && modalPreview) {
        btnFecharModal.addEventListener('click', () => modalPreview.classList.add('hidden'));
    }

    if (btnAdicionarDoModal && modalPreview) {
        btnAdicionarDoModal.addEventListener('click', () => {
            if (questaoSelecionadaAtual) {
                adicionarQuestaoNaProva(questaoSelecionadaAtual);
                modalPreview.classList.add('hidden');
            }
        });
    }
}

function renderizarListaCompacta(questoes) {
    const listaQuestoesBanco = document.getElementById('listaQuestoesBanco');
    if (!listaQuestoesBanco) return;

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
    const modalPreview = document.getElementById('modalPreview');
    const modalPreviewBody = document.getElementById('modalPreviewBody');
    if (!modalPreview || !modalPreviewBody) return;

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

/* ==========================================================
   6. MODO DE CRIAÇÃO MANUAL DE QUESTÕES
   ========================================================== */
function inicializarCriacaoManual() {
    const btnSubmit = document.getElementById('btnCriarQuestaoSubmit');
    if (!btnSubmit) return;

    btnSubmit.addEventListener('click', () => {
        const inputDescritor = document.getElementById('inputNovoDescritor');
        const inputEnunciado = document.getElementById('inputNovoEnunciado');
        const altInputs = document.querySelectorAll('.input-alt-texto');
        const radiosCorreta = document.querySelectorAll('input[name="correta"]');

        const enunciado = inputEnunciado ? inputEnunciado.value.trim() : '';
        const descritor = inputDescritor ? inputDescritor.value.trim() : '';

        if (!enunciado) {
            alert('Por favor, digite o enunciado da questão.');
            return;
        }

        const letras = ['A', 'B', 'C', 'D'];
        let alternativasObj = {};
        let respostaCorreta = null;

        altInputs.forEach((input, index) => {
            const valor = input.value.trim();
            if (valor !== '') {
                alternativasObj[letras[index]] = valor;
            }
        });

        radiosCorreta.forEach((radio, index) => {
            if (radio.checked) {
                respostaCorreta = letras[index];
            }
        });

        const novaQuestao = {
            descritor: descritor || 'D1',
            enunciado: enunciado,
            alternativas: Object.keys(alternativasObj).length > 0 ? alternativasObj : null,
            respostaCorreta: respostaCorreta
        };

        adicionarQuestaoNaProva(novaQuestao);

        // Limpa os campos após inserção
        inputEnunciado.value = '';
        if (inputDescritor) inputDescritor.value = '';
        altInputs.forEach(i => i.value = '');
        radiosCorreta.forEach(r => r.checked = false);
    });
}

/* ==========================================================
   7. RENDERIZAÇÃO E MONTAGEM DA PROVA A4
   ========================================================== */
function adicionarQuestaoNaProva(questao) {
    const novaQuestao = JSON.parse(JSON.stringify(questao));
    novaQuestao.espacoInferior = 1;
    novaQuestao.quebraApos = false;
    
    questoesNaProva.push(novaQuestao);
    renderizarProvaA4();
}

function removerQuebraPagina(indexQuestao) {
    if (questoesNaProva[indexQuestao]) {
        questoesNaProva[indexQuestao].quebraApos = false;
        renderizarProvaA4();
    }
}

function criarElementoQuestaoHTML(q, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'questao-item';
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
    `;

    // Eventos dos botões da Toolbar de cada questão
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

function renderizarProvaA4() {
    const primeiraFolha = document.querySelector('.folha-a4');
    if (!primeiraFolha) return;

    // Limpa páginas geradas adicionais e separadores antigos
    document.querySelectorAll('.folha-a4-gerada, .separador-quebra-pagina').forEach(el => el.remove());

    // Busca o container principal de questões da primeira página
    let containerPrimeiraPagina = primeiraFolha.querySelector('#containerQuestoes') || primeiraFolha.querySelector('.prova-questoes-2colunas');
    if (!containerPrimeiraPagina) return;

    // Limpa o conteúdo da primeira folha
    containerPrimeiraPagina.innerHTML = '';

    // SE A PROVA ESTIVER VAZIA: Exibe a instrução em bloco único (sem grid de 2 colunas)
    if (questoesNaProva.length === 0) {
        containerPrimeiraPagina.className = 'container-instrucao-vazia';
        containerPrimeiraPagina.innerHTML = `
            <div class="instrucao-inicial">
                <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">👈</span>
                <h3 style="margin: 0 0 0.5rem 0; color: #334155; font-size: 1.2rem;">Monte seu Simulado SAEB</h3>
                <p style="margin: 0; font-size: 0.95rem; max-width: 450px;">Selecione um descritor no painel à esquerda ou crie uma questão manualmente para começar a preencher esta folha.</p>
            </div>
        `;
        return;
    }

    // SE HOUVER QUESTÕES: Restaura o layout de colunas
    const selectColunas = document.getElementById('selectColunas');
    const layoutUmaColuna = selectColunas && selectColunas.value === '1';

    containerPrimeiraPagina.className = `prova-questoes-2colunas ${layoutUmaColuna ? 'layout-1coluna' : ''}`;

    let folhaAtual = primeiraFolha;
    let containerAtual = containerPrimeiraPagina;
    let numeroPagina = 1;

    // Renderiza cada questão cadastrada
    questoesNaProva.forEach((q, idx) => {
        const elQuestao = criarElementoQuestaoHTML(q, idx);
        containerAtual.appendChild(elQuestao);

        if (q.quebraApos) {
            numeroPagina++;

            const elementoSeparador = document.createElement('div');
            elementoSeparador.className = 'separador-quebra-pagina';
            elementoSeparador.innerHTML = `
                <span>✂️ Quebra de página inserida aqui</span>
                <button type="button" class="btn-remover-quebra">🗑️ Remover Quebra</button>
            `;

            elementoSeparador.querySelector('.btn-remover-quebra').addEventListener('click', () => {
                removerQuebraPagina(idx);
            });

            const novaFolha = document.createElement('div');
            novaFolha.className = 'folha-a4 folha-a4-gerada';
            novaFolha.id = `pagina-a4-${numeroPagina}`;

            novaFolha.innerHTML = `
                <div class="cabecalho-pagina-secundaria" style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px; font-weight: bold; font-size: 0.85rem;">
                    <span>SIMULADO SAEB</span>
                    <span>Página ${numeroPagina}</span>
                </div>
                <div class="prova-questoes-2colunas ${layoutUmaColuna ? 'layout-1coluna' : ''}"></div>
            `;

            folhaAtual.parentNode.insertBefore(elementoSeparador, folhaAtual.nextSibling);
            elementoSeparador.parentNode.insertBefore(novaFolha, elementoSeparador.nextSibling);

            folhaAtual = novaFolha;
            containerAtual = novaFolha.querySelector('.prova-questoes-2colunas');
        }
    });

    applyZoom(currentZoom);
}
