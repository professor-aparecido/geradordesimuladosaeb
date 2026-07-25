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
   ALTERNAR MODO DE QUESTÕES (BANCO x CRIAR)
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
        areaCriarQuestao.classList.add('hidden');
    });

    // Clique em Criar Questão
    btnModoCriar.addEventListener('click', () => {
        btnModoCriar.classList.add('active');
        btnModoBanco.classList.remove('active');
        
        areaCriarQuestao.classList.remove('hidden');
        areaBancoQuestoes.classList.remove('hidden');
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

// VARIÁVEIS DO BANCO DE QUESTÕES
const filtroDescritor = document.getElementById('filtroDescritor');
const listaQuestoesBanco = document.getElementById('listaQuestoesBanco');

// MODAL
const modalPreview = document.getElementById('modalPreview');
const modalPreviewBody = document.getElementById('modalPreviewBody');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnAdicionarDoModal = document.getElementById('btnAdicionarDoModal');

let questaoSelecionadaAtual = null;

// EVENTO: Quando seleciona um descritor no menu
if (filtroDescritor) {
    filtroDescritor.addEventListener('change', async (e) => {
        const descritor = e.target.value;
        if (!descritor) {
            listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Selecione um descritor acima para carregar as questões.</p>';
            return;
        }

        listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Carregando questões...</p>';

        try {
            // Busca o arquivo JSON correspondente (ex: questoes/d36.json)
            const response = await fetch(`questoes/${descritor}.json`);
            if (!response.ok) throw new Error("Arquivo não encontrado");

            const questoes = await response.json();
            renderizarListaQuestoes(questoes);

        } catch (error) {
            listaQuestoesBanco.innerHTML = `<p class="placeholder-text" style="color:red;">Não foi possível carregar as questões do descritor ${descritor.toUpperCase()}. Verifique se o arquivo JSON existe.</p>`;
        }
    });
}

// RENDERIZA OS CARDS DA LISTA
function renderizarListaQuestoes(questoes) {
    if (questoes.length === 0) {
        listaQuestoesBanco.innerHTML = '<p class="placeholder-text">Nenhuma questão cadastrada para este descritor.</p>';
        return;
    }

    listaQuestoesBanco.innerHTML = ''; // Limpa a lista

    questoes.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'card-questao-banco';
        card.innerHTML = `
            <strong>Questão ${index + 1} (${q.descritor})</strong>
            <p class="enunciado-resumo">${q.enunciado}</p>
            <div class="card-actions">
                <button class="btn btn-outline btn-sm btn-preview">👁️ Pré-visualizar</button>
                <button class="btn btn-primary btn-sm btn-add">➕ Adicionar</button>
            </div>
        `;

        // Botão de Pré-visualizar
        card.querySelector('.btn-preview').addEventListener('click', () => abrirModalPreview(q));

        // Botão de Adicionar direto
        card.querySelector('.btn-add').addEventListener('click', () => adicionarQuestaoNaProva(q));

        listaQuestoesBanco.appendChild(card);
    });
}

// ABRIR E FECHAR MODAL
function abrirModalPreview(questao) {
    questaoSelecionadaAtual = questao;
    
    // Monta o HTML do modal com o enunciado e alternativas
    let html = `<p><strong>Descritor:</strong> ${questao.descritor}</p>`;
    html += `<p style="margin-top:0.5rem;">${questao.enunciado}</p>`;

    if (questao.alternativas) {
        html += `<ul style="list-style:none; padding:0; margin-top:0.8rem;">`;
        for (let key in questao.alternativas) {
            html += `<li style="margin-bottom:0.3rem;"><strong>${key})</strong> ${questao.alternativas[key]}</li>`;
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

// FUNÇÃO PARA INSERIR A QUESTÃO NA FOLHA A4
function adicionarQuestaoNaProva(questao) {
    console.log("Questão adicionada à prova:", questao);
    alert(`Questão do descritor ${questao.descritor} adicionada com sucesso!`);
    // AQUI ENTRA A SUA LÓGICA QUE RENDERIZA O HTML DA QUESTÃO DENTRO DA FOLHA A4 (.prova-questoes-2colunas)
}
