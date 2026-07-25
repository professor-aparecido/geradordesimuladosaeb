/* ==========================================================
   GERENCIAMENTO DE QUESTÕES NA PROVA A4 
   (ORDENAÇÃO, ESPAÇAMENTO E PAGINAÇÃO AUTOMÁTICA EM FOLHAS A4)
   ========================================================== */

// Array global que gerencia as questões ativas na folha de prova
let questoesNaProva = [];

// Altura útil limite de conteúdo em uma folha A4 (em pixels)
const ALTURA_MAXIMA_A4_PX = 920; 

/**
 * Insere uma nova questão no array global e atualiza a renderização
 */
function adicionarQuestaoNaProva(questao) {
    const novaQuestao = JSON.parse(JSON.stringify(questao));
    novaQuestao.espacoInferior = 1; // Padrão 1rem
    
    questoesNaProva.push(novaQuestao);
    renderizarProvaA4();
}

/**
 * Redesenha as questões distribuindo-as em múltiplas folhas A4 reais
 */
function renderizarProvaA4() {
    // Busca o container onde as folhas A4 ficam abrigadas
    const previewArea = document.querySelector('.preview-area') || document.getElementById('previewContainer') || document.body;
    
    // Captura a primeira folha A4 para usar como referência/origem
    let primeiraFolha = document.querySelector('.folha-a4');
    if (!primeiraFolha) return;

    // Guarda o elemento do cabeçalho da escola para poder duplicar/manter
    const cabecalhoEscola = primeiraFolha.querySelector('.cabecalho-prova') || primeiraFolha.querySelector('.cabecalho-prova-container');
    const htmlCabecalho = cabecalhoEscola ? cabecalhoEscola.outerHTML : '';

    // Remove páginas adicionais criadas em renderizações anteriores
    document.querySelectorAll('.folha-a4-gerada').forEach(el => el.remove());

    // Se não houver questões, limpa o container da primeira página
    const containerPrimeiraPagina = primeiraFolha.querySelector('.prova-questoes-2colunas');
    if (!containerPrimeiraPagina) return;

    containerPrimeiraPagina.innerHTML = '';

    if (questoesNaProva.length === 0) return;

    // Verifica o estado atual do layout (1 ou 2 colunas)
    const selectColunas = document.getElementById('selectColunas');
    const layoutUmaColuna = selectColunas && selectColunas.value === '1';

    let folhaAtual = primeiraFolha;
    let containerAtual = containerPrimeiraPagina;
    let numeroPagina = 1;

    // Garante a classe do layout na primeira página
    if (layoutUmaColuna) {
        containerAtual.classList.add('layout-1coluna');
    } else {
        containerAtual.classList.remove('layout-1coluna');
    }

    // Processa e aloca cada questão na folha correta
    questoesNaProva.forEach((q, idx) => {
        const elQuestao = criarElementoQuestaoHTML(q, idx);
        containerAtual.appendChild(elQuestao);

        // Define a altura limite (Página 1 considera o cabeçalho completo)
        const limiteAltura = (numeroPagina === 1) ? ALTURA_MAXIMA_A4_PX : (ALTURA_MAXIMA_A4_PX + 120);

        // Se a questão fizer o conteúdo transbordar da folha A4 atual
        if (folhaAtual.offsetHeight > limiteAltura && containerAtual.children.length > 1) {
            // Remove a questão da folha estourada
            containerAtual.removeChild(elQuestao);

            // Cria uma NOVA Folha A4
            numeroPagina++;
            const novaFolha = document.createElement('div');
            novaFolha.className = 'folha-a4 folha-a4-gerada';
            novaFolha.id = `pagina-a4-${numeroPagina}`;
            
            // Aplica o zoom atual na nova folha se a variável global currentZoom existir
            if (typeof currentZoom !== 'undefined') {
                novaFolha.style.transform = `scale(${currentZoom})`;
                novaFolha.style.transformOrigin = 'top center';
            }

            // Cabeçalho simplificado para páginas de continuação
            let htmlNovaPagina = `
                <div style="border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 15px; font-size: 0.8rem; display: flex; justify-content: space-between; font-weight: bold;">
                    <span>SIMULADO SAEB</span>
                    <span>Página ${numeroPagina}</span>
                </div>
                <div class="prova-questoes-2colunas ${layoutUmaColuna ? 'layout-1coluna' : ''}"></div>
            `;
            novaFolha.innerHTML = htmlNovaPagina;

            // Insere a nova folha no DOM logo após a folha anterior
            folhaAtual.parentNode.insertBefore(novaFolha, folhaAtual.nextSibling);

            // Atualiza as referências para a nova folha
            folhaAtual = novaFolha;
            containerAtual = novaFolha.querySelector('.prova-questoes-2colunas');

            // Adiciona a questão no início da nova folha
            containerAtual.appendChild(elQuestao);
        }
    });
}

/**
 * Cria o elemento HTML individual de cada questão (Preservando suas classes e eventos)
 */
function criarElementoQuestaoHTML(q, idx) {
    const numQuestao = idx + 1;
    const novaColuna = document.createElement('div');
    novaColuna.className = 'coluna-questao';
    novaColuna.style.marginBottom = `${q.espacoInferior || 1}rem`;
    novaColuna.setAttribute('data-index', idx);

    const desabilitarSubir = idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : '';
    const desabilitarDescer = idx === questoesNaProva.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : '';

    let htmlQuestao = `
        <div class="item-questao">
            <div class="questao-header-pilar">
                <div class="questao-title-group">
                    <span class="box-num-questao">QUESTÃO ${numQuestao}</span>

                    <!-- BARRA DE FERRAMENTAS DE EDIÇÃO RÁPIDA -->
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

    // Renderiza Tabela se existir no objeto
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

    // Renderiza Alternativas
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

/**
 * LÓGICA DE ORDENAÇÃO E REORDENAMENTO DAS QUESTÕES
 */
function moverQuestaoNaProva(indexAtual, direcao) {
    const novoIndex = indexAtual + direcao;

    // Impede movimentação fora dos limites do array
    if (novoIndex < 0 || novoIndex >= questoesNaProva.length) return;

    // Troca as posições (Array Destructuring)
    [questoesNaProva[indexAtual], questoesNaProva[novoIndex]] = 
    [questoesNaProva[novoIndex], questoesNaProva[indexAtual]];

    // Re-renderiza atualizando a numeração de todas as questões
    renderizarProvaA4();
}

/**
 * LÓGICA DE ESPAÇAMENTO VERTICAL
 */
function ajustarEspacoQuestao(index, delta) {
    if (questoesNaProva[index]) {
        const espacoAtual = questoesNaProva[index].espacoInferior || 1;
        const novoEspaco = Math.max(0, espacoAtual + delta);
        questoesNaProva[index].espacoInferior = novoEspaco;
        renderizarProvaA4();
    }
}

/**
 * REMOÇÃO DE QUESTÃO
 */
function removerQuestaoDaProva(index) {
    questoesNaProva.splice(index, 1);
    renderizarProvaA4();
}
