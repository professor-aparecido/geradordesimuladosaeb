// DICIONÁRIO PRÉ-CADASTRADO DOS DESCRITORES SAEB
const BASE_DESCRITORES = {
    // MATEMÁTICA
    "D1": "Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas.",
    "D2": "Identificar propriedades de figuras bidimensionais pelo reconhecimento de que superfícies planas são delimitadas por contornos fechados.",
    "D3": "Identificar propriedades de triângulos pela comparação de medidas de lados e ângulos.",
    "D4": "Identificar relação entre quadriláteros por meio de suas propriedades.",
    "D5": "Reconhecer a conservação ou modificação de medidas nos lados, do perímetro, da área em ampliação/redução de figuras.",
    "D6": "Reconhecer ângulos como mudança de direção ou giros, identificando ângulos retos e não retos.",
    "D7": "Reconhecer que as imagens de uma figura construída por uma transformação hipsométrica são congruentes.",
    "D8": "Resolver problema utilizando propriedades dos polígonos (soma dos ângulos internos, número de diagonais, cálculo da medida de cada ângulo interno).",
    "D9": "Interpretar informações apresentadas por meio de coordenadas cartesianas.",
    "D10": "Utilizar relações métricas do triângulo retângulo para resolver problemas significativos.",
    "D11": "Reconhecer círculo/circunferência, seus elementos e algumas de suas relações.",
    "D12": "Resolver problema envolvendo o cálculo de perímetro de figuras planas.",
    "D13": "Resolver problema envolvendo o cálculo de área de figuras planas.",
    "D14": "Resolver problema envolvendo noção de volume.",
    "D15": "Resolver problema envolvendo relações entre diferentes unidades de medida.",
    "D16": "Identificar a localização de números inteiros na reta numérica.",
    "D17": "Identificar a localização de números racionais na reta numérica.",
    "D18": "Efetuar cálculos com números inteiros envolvendo as operações básicas.",
    "D19": "Resolver problema com números naturais envolvendo diferentes significados das operações.",
    "D20": "Resolver problema com números inteiros envolvendo as operações.",
    "D21": "Reconhecer as diferentes representações de um número racional.",
    "D22": "Identificar fração como representação que pode estar associada a diferentes significados.",
    "D23": "Resolver problema com números racionais envolvendo as operações.",
    "D24": "Resolver problema que envolva porcentagem.",
    "D25": "Resolver problema que envolva variação proporcional, direta ou inversa, entre grandezas.",
    "D26": "Resolver problema envolvendo equação do 1º grau.",
    "D27": "Resolver problema envolvendo sistema de equações do 1º grau.",
    "D28": "Resolver problema envolvendo equação do 2º grau.",
    "D29": "Resolver problema envolvendo função do 1º grau.",
    "D30": "Identificar a expressão algébrica que expressa uma regularidade observada em sequências de números ou figuras.",
    "D31": "Resolver problema envolvendo informações apresentadas em tabelas e/ou gráficos.",
    "D32": "Resolver problema envolvendo a média aritmética.",
    "D33": "Resolver problema envolvendo o cálculo de probabilidade de um evento.",

    // LÍNGUA PORTUGUESA (EXEMPLOS)
    "D1_LP": "Localizar informações explícitas em um texto.",
    "D2_LP": "Estabelecer relações entre partes de um texto, identificando repetições ou substituições.",
    "D3_LP": "Inferir o sentido de uma palavra ou expressão.",
    "D4_LP": "Inferir uma informação implícita em um texto.",
    "D5_LP": "Interpretar texto com auxílio de material gráfico diverso (propagandas, quadrinhos, foto).",
    "D6_LP": "Identificar o tema de um texto."
};

// ESTADO GLOBAL DA APLICAÇÃO
let listaQuestoes = [];
let questaoBancoCarregadas = []; // Armazena as questões do JSON ativo
let proximoId = 1;
let zoomNivel = 1.0;
let numColunas = 2;
let imagemCarregadaTemp = "";
let exibirGabaritoProfessor = false;

// DADOS DO CABEÇALHO
let dadosCabecalho = {
    nomeEscola: "ESCOLA MUNICIPAL DE EDUCAÇÃO BÁSICA NOSSA SENHORA DO PILAR",
    logoUrl: "",
    tituloProva: "SIMULADO DE MATEMÁTICA - SAEB 2026",
    serie: "8º ANO",
    turma: "A",
    professor: "Aparecido Sousa"
};

// REFERÊNCIAS DOM - GENERALS
const containerFolhas = document.getElementById('container-folhas');
const selectColunas = document.getElementById('selectColunas');
const zoomVal = document.getElementById('zoomVal');
const paginaAtualEl = document.getElementById('paginaAtual');
const totalPaginasEl = document.getElementById('totalPaginas');

const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const btnExpandSidebar = document.getElementById('btnExpandSidebar');
const btnRefazer = document.getElementById('btnRefazer');
const btnToggleGabarito = document.getElementById('btnToggleGabarito');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomReset = document.getElementById('btnZoomReset');

// MODAL REFERÊNCIAS
const modalPreview = document.getElementById('modalPreview');
const modalBodyContent = document.getElementById('modalBodyContent');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnModalFechar = document.getElementById('btnModalFechar');

// REFERÊNCIAS DOM - CABEÇALHO
const btnToggleCabecalho = document.getElementById('btnToggleCabecalho');
const bodyCabecalho = document.getElementById('bodyCabecalho');
const btnAccIcon = document.getElementById('btnAccIcon');
const inputNomeEscola = document.getElementById('inputNomeEscola');
const inputLogoEscola = document.getElementById('inputLogoEscola');
const inputTituloProva = document.getElementById('inputTituloProva');
const inputSerie = document.getElementById('inputSerie');
const inputTurma = document.getElementById('inputTurma');
const inputProfessor = document.getElementById('inputProfessor');

// REFERÊNCIAS DOM - CRIAR QUESTÃO (BLOCO 2)
const btnToggleCriarQuestao = document.getElementById('btnToggleCriarQuestao');
const bodyCriarQuestao = document.getElementById('bodyCriarQuestao');
const btnAccIconQuestao = document.getElementById('btnAccIconQuestao');

const inputCodigoDescritor = document.getElementById('inputCodigoDescritor');
const inputEnunciado = document.getElementById('inputEnunciado');
const inputImagemQuestao = document.getElementById('inputImagemQuestao');
const radiosTipo = document.getElementsByName('tipoQuestao');
const painelAlternativas = document.getElementById('painelAlternativas');
const painelSubjetiva = document.getElementById('painelSubjetiva');

const altA = document.getElementById('altA');
const altB = document.getElementById('altB');
const altC = document.getElementById('altC');
const altD = document.getElementById('altD');

const inputRespostaGabarito = document.getElementById('inputRespostaGabarito');
const inputAlturaCalculo = document.getElementById('inputAlturaCalculo');

const btnPreVisualizar = document.getElementById('btnPreVisualizar');
const btnAdicionarQuestao = document.getElementById('btnAdicionarQuestao');

// REFERÊNCIAS DOM - BANCO DE QUESTÕES (BLOCO 3)
const btnToggleBanco = document.getElementById('btnToggleBanco');
const bodyBanco = document.getElementById('bodyBanco');
const btnAccIconBanco = document.getElementById('btnAccIconBanco');
const selectDescritorBanco = document.getElementById('selectDescritorBanco');
const containerBancoQuestoes = document.getElementById('containerBancoQuestoes');

// 1. RECOLHER / EXPANDIR PAINÉIS ACCORDION
btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    btnExpandSidebar.classList.remove('hidden');
});

btnExpandSidebar.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    btnExpandSidebar.classList.add('hidden');
});

btnToggleCabecalho.addEventListener('click', () => {
    const isCollapsed = bodyCabecalho.classList.toggle('collapsed');
    btnAccIcon.innerText = isCollapsed ? '▲' : '▼';
});

btnToggleCriarQuestao.addEventListener('click', () => {
    const isCollapsed = bodyCriarQuestao.classList.toggle('collapsed');
    btnAccIconQuestao.innerText = isCollapsed ? '▲' : '▼';
});

if (btnToggleBanco) {
    btnToggleBanco.addEventListener('click', () => {
        const isCollapsed = bodyBanco.classList.toggle('collapsed');
        if (btnAccIconBanco) btnAccIconBanco.innerText = isCollapsed ? '▲' : '▼';
    });
}

// LISTENERS DO SELECT DO BANCO DE QUESTÕES
if (selectDescritorBanco) {
    // Carrega quando a opção é trocada
    selectDescritorBanco.addEventListener('change', carregarBancoPorDescritor);
}

// ALTERNÂNCIA DE TIPO DE QUESTÃO
radiosTipo.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'alternativas') {
            painelAlternativas.classList.remove('hidden');
            painelSubjetiva.classList.add('hidden');
        } else {
            painelAlternativas.classList.add('hidden');
            painelSubjetiva.classList.remove('hidden');
        }
    });
});

// BOTÃO VER GABARITO (VERSÃO PROFESSOR)
btnToggleGabarito.addEventListener('click', () => {
    exibirGabaritoProfessor = !exibirGabaritoProfessor;
    if (exibirGabaritoProfessor) {
        btnToggleGabarito.classList.add('ativo');
        btnToggleGabarito.innerText = '✅ Gabarito Ativado (Professor)';
    } else {
        btnToggleGabarito.classList.remove('ativo');
        btnToggleGabarito.innerText = '👁️ Mostrar Gabarito (Professor)';
    }
    renderizar();
});

// UPLOAD DA IMAGEM DA QUESTÃO
inputImagemQuestao.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            imagemCarregadaTemp = evt.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagemCarregadaTemp = "";
    }
});

// LISTENERS DO CABEÇALHO
inputNomeEscola.addEventListener('input', (e) => { dadosCabecalho.nomeEscola = e.target.value; renderizar(); });
inputTituloProva.addEventListener('input', (e) => { dadosCabecalho.tituloProva = e.target.value; renderizar(); });
inputSerie.addEventListener('input', (e) => { dadosCabecalho.serie = e.target.value; renderizar(); });
inputTurma.addEventListener('input', (e) => { dadosCabecalho.turma = e.target.value; renderizar(); });
inputProfessor.addEventListener('input', (e) => { dadosCabecalho.professor = e.target.value; renderizar(); });

inputLogoEscola.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            dadosCabecalho.logoUrl = evt.target.result;
            renderizar();
        };
        reader.readAsDataURL(file);
    }
});

// 2. OBTER DADOS DO FORMULÁRIO DE QUESTÃO MANUAL (BLOCO 2)
function obterDadosFormularioQuestao() {
    const codigoUpper = inputCodigoDescritor.value.trim().toUpperCase();
    const textoDescritor = BASE_DESCRITORES[codigoUpper] || `Descritor ${codigoUpper}`;
    const enunciado = inputEnunciado.value.trim() || "Enunciado da questão...";
    const tipo = Array.from(radiosTipo).find(r => r.checked).value;
    const espacoCalculo = parseInt(inputAlturaCalculo.value) || 0;

    let questao = {
        id: proximoId,
        codigoDescritor: codigoUpper,
        textoDescritor: textoDescritor,
        texto: enunciado,
        imagem: imagemCarregadaTemp,
        tipo: tipo,
        espacoCalculo: espacoCalculo
    };

    if (tipo === 'alternativas') {
        const gabaritoOpcao = document.querySelector('input[name="gabarito"]:checked').value;
        const disposicaoAlt = document.querySelector('input[name="disposicaoAlt"]:checked').value;

        questao.disposicao = disposicaoAlt;
        questao.alternativas = [
            { letra: 'A', texto: altA.value.trim() || 'Opção A' },
            { letra: 'B', texto: altB.value.trim() || 'Opção B' },
            { letra: 'C', texto: altC.value.trim() || 'Opção C' },
            { letra: 'D', texto: altD.value.trim() || 'Opção D' }
        ];
        questao.gabarito = gabaritoOpcao;
    } else {
        questao.respostaGabarito = inputRespostaGabarito.value.trim();
    }

    return questao;
}

// BOTÃO ADICIONAR QUESTÃO MANUAL
btnAdicionarQuestao.addEventListener('click', () => {
    const novaQuestao = obterDadosFormularioQuestao();
    proximoId++;
    listaQuestoes.push(novaQuestao);

    // LIMPAR FORMULÁRIO
    inputEnunciado.value = "";
    inputCodigoDescritor.value = "";
    inputImagemQuestao.value = "";
    imagemCarregadaTemp = "";
    altA.value = ""; altB.value = ""; altC.value = ""; altD.value = "";
    inputRespostaGabarito.value = "";
    inputAlturaCalculo.value = "0";

    renderizar();
});

// ===================================================
// 3. FUNÇÕES DO BANCO DE QUESTÕES (BLOCO 3)
// ===================================================
async function carregarBancoPorDescritor() {
    if (!selectDescritorBanco) return;
    const descritorSelecionado = selectDescritorBanco.value; // Ex: "d1", "d2"

    if (!descritorSelecionado) {
        containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Selecione um descritor acima para carregar as questões.</p>';
        questaoBancoCarregadas = [];
        return;
    }

    containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Carregando questões...</p>';

    try {
        const response = await fetch(`./questoes/${descritorSelecionado}.json`);

        if (!response.ok) {
            throw new Error(`Arquivo ${descritorSelecionado}.json não encontrado.`);
        }

        questaoBancoCarregadas = await response.json();

        if (!questaoBancoCarregadas || questaoBancoCarregadas.length === 0) {
            containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Nenhuma questão cadastrada neste descritor.</p>';
            return;
        }

        renderizarListaBanco(questaoBancoCarregadas);

    } catch (error) {
        console.error("Erro ao carregar banco:", error);
        containerBancoQuestoes.innerHTML = `
            <div class="msg-erro-banco">
                ⚠️ Não foi possível carregar as questões do descritor <strong>${descritorSelecionado.toUpperCase()}</strong>.
                <br><small>Verifique se o arquivo <code>questoes/${descritorSelecionado}.json</code> existe.</small>
            </div>
        `;
    }
}

// Renderiza a lista do Banco de Questões com Botões de Pré-Visualizar e Adicionar
function renderizarListaBanco(questoes) {
    containerBancoQuestoes.innerHTML = '';

    questoes.forEach(q => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-banco-questao';

        let textoLimpo = q.texto ? q.texto.replace(/\[IMAGEM\]/g, '').trim() : 'Questão sem enunciado';
        const textoResumido = textoLimpo.length > 35 ? textoLimpo.substring(0, 35) + '...' : textoLimpo;

        itemDiv.innerHTML = `
            <div class="item-banco-info">
                <p class="item-banco-texto" title="${textoLimpo}">${textoResumido}</p>
            </div>
            <div class="banco-acoes-btn">
                <button class="btn btn-secondary btn-mini-add" onclick="previsualizarQuestaoDoBanco('${q.id}')" title="Pré-visualizar Questão">👁️</button>
                <button class="btn btn-primary btn-mini-add" onclick="adicionarQuestaoDoBanco('${q.id}')" title="Adicionar ao Simulado">➕</button>
            </div>
        `;

        containerBancoQuestoes.appendChild(itemDiv);
    });
}

// PRÉ-VISUALIZAR QUESTÃO DO BANCO NO MODAL
function previsualizarQuestaoDoBanco(idQuestao) {
    const qEncontrada = questaoBancoCarregadas.find(q => q.id === idQuestao);

    if (qEncontrada) {
        const qTemp = JSON.parse(JSON.stringify(qEncontrada));
        qTemp.textoDescritor = BASE_DESCRITORES[qTemp.codigoDescritor] || `Descritor ${qTemp.codigoDescritor}`;
        
        const el = criarElementoQuestao(qTemp, 0, true);
        modalBodyContent.innerHTML = "";
        modalBodyContent.appendChild(el);
        modalPreview.classList.remove('hidden');

        if (window.renderMathInElement) {
            renderMathInElement(modalBodyContent, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }
}

// ADICIONAR QUESTÃO DO BANCO À PROVA
function adicionarQuestaoDoBanco(idQuestao) {
    const questaoEncontrada = questaoBancoCarregadas.find(q => q.id === idQuestao);

    if (questaoEncontrada) {
        const novaQuestao = JSON.parse(JSON.stringify(questaoEncontrada));
        
        novaQuestao.id = proximoId++;
        novaQuestao.textoDescritor = BASE_DESCRITORES[novaQuestao.codigoDescritor] || `Descritor ${novaQuestao.codigoDescritor}`;
        
        listaQuestoes.push(novaQuestao);
        renderizar();
    }
}

// MODAL DE PRÉ-VISUALIZAÇÃO DA CRIAÇÃO MANUAL (BLOCO 2)
btnPreVisualizar.addEventListener('click', () => {
    const qTemp = obterDadosFormularioQuestao();
    const el = criarElementoQuestao(qTemp, 0, true);
    
    modalBodyContent.innerHTML = "";
    modalBodyContent.appendChild(el);
    modalPreview.classList.remove('hidden');

    if (window.renderMathInElement) {
        renderMathInElement(modalBodyContent, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
});

btnFecharModal.addEventListener('click', () => modalPreview.classList.add('hidden'));
btnModalFechar.addEventListener('click', () => modalPreview.classList.add('hidden'));

btnRefazer.addEventListener('click', () => {
    if (listaQuestoes.length === 0 || confirm("Deseja realmente apagar todas as questões e refazer a prova?")) {
        listaQuestoes = [];
        proximoId = 1;
        renderizar();
    }
});

// CONTROLES DE ZOOM
btnZoomIn.addEventListener('click', () => { if (zoomNivel < 1.5) { zoomNivel += 0.1; aplicarZoom(); } });
btnZoomOut.addEventListener('click', () => { if (zoomNivel > 0.5) { zoomNivel -= 0.1; aplicarZoom(); } });
btnZoomReset.addEventListener('click', () => { zoomNivel = 1.0; aplicarZoom(); });

function aplicarZoom() {
    containerFolhas.style.transform = `scale(${zoomNivel})`;
    zoomVal.innerText = `${Math.round(zoomNivel * 100)}%`;
}

// FUNÇÕES DE AÇÃO NAS QUESTÕES
window.alterarEspaco = function(index, delta) {
    const novoEspaco = (listaQuestoes[index].espacoCalculo || 0) + delta;
    if (novoEspaco >= 0 && novoEspaco <= 500) {
        listaQuestoes[index].espacoCalculo = novoEspaco;
        renderizar();
    }
};

window.moverQuestao = function(index, direcao) {
    const novoIndex = index + direcao;
    if (novoIndex < 0 || novoIndex >= listaQuestoes.length) return;
    const temp = listaQuestoes[index];
    listaQuestoes[index] = listaQuestoes[novoIndex];
    listaQuestoes[novoIndex] = temp;
    renderizar();
};

window.excluirQuestao = function(index) {
    listaQuestoes.splice(index, 1);
    renderizar();
};

selectColunas.addEventListener('change', (e) => {
    numColunas = parseInt(e.target.value);
    renderizar();
});

// CRIAR ELEMENTO HTML DA QUESTÃO
function criarElementoQuestao(q, index, isPreviewMode = false) {
    const div = document.createElement('div');
    div.className = 'questao';
    
    const isPrimeiro = index === 0;
    const isUltimo = index === listaQuestoes.length - 1;

    let textoProcessado = q.texto;
    let htmlImagem = q.imagem ? `<img src="${q.imagem}" class="questao-imagem" alt="Imagem da questão">` : '';

    if (q.imagem) {
        if (textoProcessado.includes('[IMAGEM]')) {
            textoProcessado = textoProcessado.replace('[IMAGEM]', htmlImagem);
            htmlImagem = ''; 
        }
    } else {
        textoProcessado = textoProcessado.replace(/\[IMAGEM\]/g, '');
    }

    let textoTooltip = BASE_DESCRITORES[q.codigoDescritor] || q.textoDescritor || q.codigoDescritor;
    let tagDescritor = q.codigoDescritor ? `<span class="questao-descritor-tag" title="${textoTooltip}">${q.codigoDescritor}</span>` : '';

    let htmlConteudoTipo = '';

    if (q.tipo === 'alternativas' && q.alternativas) {
        let classeDisposicao = q.disposicao === 'horizontal' ? 'horizontal' : 'vertical';
        let altHtml = q.alternativas.map(alt => {
            let marcaGabarito = (exibirGabaritoProfessor && alt.letra === q.gabarito) 
                ? `<span class="gabarito-tag" title="Gabarito Marcado">✓</span>` 
                : '';
            return `
                <div class="opcao-alt">
                    <strong>(${alt.letra})</strong>
                    <span>${alt.texto}</span>
                    ${marcaGabarito}
                </div>
            `;
        }).join('');

        htmlConteudoTipo = `<div class="questao-alternativas ${classeDisposicao}">${altHtml}</div>`;
    } else {
        let htmlGabaritoSubjetiva = (exibirGabaritoProfessor && q.respostaGabarito)
            ? `<div class="gabarito-subjetiva"><strong>Gabarito Esperado:</strong> ${q.respostaGabarito}</div>`
            : '';

        htmlConteudoTipo = htmlGabaritoSubjetiva;
    }

    let htmlEspacoCalculo = q.espacoCalculo > 0 
        ? `<div class="espaco-calculo" style="height: ${q.espacoCalculo}px;"></div>` 
        : '';

    let acoesHtml = isPreviewMode ? '' : `
        <div class="questao-acoes">
            <button class="btn-mini-compact btn-move" onclick="moverQuestao(${index}, -1)" ${isPrimeiro ? 'disabled' : ''} title="Subir">▲</button>
            <button class="btn-mini-compact btn-move" onclick="moverQuestao(${index}, 1)" ${isUltimo ? 'disabled' : ''} title="Descer">▼</button>
            <button class="btn-mini-compact" onclick="alterarEspaco(${index}, 10)" title="+10px Espaço">+E</button>
            <button class="btn-mini-compact" onclick="alterarEspaco(${index}, -10)" title="-10px Espaço">-E</button>
            <span class="espaco-tag">${q.espacoCalculo || 0}px</span>
            <button class="btn-mini-compact btn-del" onclick="excluirQuestao(${index})" title="Excluir">🗑️</button>
        </div>
    `;

    div.innerHTML = `
        <div class="questao-top-bar">
            <div class="questao-top-left">
                <div class="questao-retangulo-titulo">QUESTÃO ${index + 1}</div>
                ${acoesHtml}
            </div>
            ${tagDescritor}
        </div>
        <div class="questao-linha-divisoria"></div>
        <div class="questao-corpo">
            <div class="questao-enunciado">${textoProcessado}</div>
            ${htmlImagem}
            ${htmlConteudoTipo}
            ${htmlEspacoCalculo}
        </div>
    `;
    return div;
}

// CRIAR FOLHA A4
function criarNovaFolha(numPagina) {
    const folha = document.createElement('div');
    folha.className = 'folha-a4';
    
    let htmlCabecalho = '';

    if (numPagina === 1) {
        const logoImg = dadosCabecalho.logoUrl 
            ? `<img src="${dadosCabecalho.logoUrl}" alt="Logo">` 
            : `<span style="font-size: 10px; color: #999;">[LOGO]</span>`;

        htmlCabecalho = `
            <div class="folha-cabecalho-container">
                <div class="cabecalho-box">
                    <div class="cabecalho-logo-col">
                        ${logoImg}
                    </div>
                    <div class="cabecalho-info-col">
                        <div class="cabecalho-nome-escola">${dadosCabecalho.nomeEscola}</div>
                        <div class="cabecalho-aluno-row">
                            ALUNO(A): <div class="linha-aluno"></div>
                        </div>
                        <div class="cabecalho-detalhes-row">
                            <div>Série: <span>${dadosCabecalho.serie}</span></div>
                            <div>Turma: <span>${dadosCabecalho.turma}</span></div>
                            <div>Data: ____/____/_______</div>
                            <div>Professor(a): <span>${dadosCabecalho.professor}</span></div>
                        </div>
                    </div>
                </div>

                <div class="prova-titulo-container">
                    <div class="prova-titulo">${dadosCabecalho.tituloProva} ${exibirGabaritoProfessor ? ' (GABARITO DO PROFESSOR)' : ''}</div>
                    <div class="prova-nota-box">
                        NOTA: <div class="box-nota-quadrado"></div>
                    </div>
                </div>
            </div>
        `;
    } else {
        htmlCabecalho = `
            <div class="folha-cabecalho-container" style="border-bottom: 1px solid #000; padding-bottom: 5px;">
                <div style="font-size: 10px; display: flex; justify-content: space-between; font-weight: bold;">
                    <span>${dadosCabecalho.nomeEscola}</span>
                    <span>${dadosCabecalho.tituloProva} ${exibirGabaritoProfessor ? ' (GABARITO)' : ''}</span>
                </div>
            </div>
        `;
    }

    const conteudo = document.createElement('div');
    conteudo.className = 'folha-conteudo';
    if (numColunas === 2) conteudo.classList.add('duas-colunas');

    folha.innerHTML = htmlCabecalho;
    folha.appendChild(conteudo);

    const rodape = document.createElement('div');
    rodape.className = 'folha-rodape';
    rodape.innerText = `Página ${numPagina}`;
    folha.appendChild(rodape);

    containerFolhas.appendChild(folha);
    return { folha, conteudo, rodape };
}

function testarOverflow(conteudoDiv) {
    if (numColunas === 1) {
        return conteudoDiv.scrollHeight > conteudoDiv.clientHeight;
    } else {
        return conteudoDiv.scrollWidth > conteudoDiv.clientWidth || conteudoDiv.scrollHeight > conteudoDiv.clientHeight;
    }
}

// RENDERIZADOR PRINCIPAL
function renderizar() {
    containerFolhas.innerHTML = '';

    if (listaQuestoes.length === 0) {
        criarNovaFolha(1);
        if (paginaAtualEl) paginaAtualEl.innerText = "1";
        if (totalPaginasEl) totalPaginasEl.innerText = "1";
        return;
    }

    let numPagina = 1;
    let folhaAtual = criarNovaFolha(numPagina);

    listaQuestoes.forEach((qData, index) => {
        const elQuestao = criarElementoQuestao(qData, index);
        folhaAtual.conteudo.appendChild(elQuestao);

        if (testarOverflow(folhaAtual.conteudo)) {
            folhaAtual.conteudo.removeChild(elQuestao);
            numPagina++;
            folhaAtual = criarNovaFolha(numPagina);
            folhaAtual.conteudo.appendChild(elQuestao);
        }
    });

    const todasFolhas = containerFolhas.querySelectorAll('.folha-a4');
    todasFolhas.forEach((folha, idx) => {
        const rodape = folha.querySelector('.folha-rodape');
        rodape.innerText = `Página ${idx + 1} de ${todasFolhas.length}`;
    });

    if (paginaAtualEl) paginaAtualEl.innerText = "1";
    if (totalPaginasEl) totalPaginasEl.innerText = todasFolhas.length;

    // PROCESSAR FÓRMULAS LATEX
    if (window.renderMathInElement) {
        renderMathInElement(containerFolhas, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

// CARREGAR EXEMPLO DE QUESTÃO INICIAL
listaQuestoes.push({
    id: proximoId++,
    codigoDescritor: "D13",
    textoDescritor: BASE_DESCRITORES["D13"],
    texto: "Um reservatório contém $3,5$ litros de água. Sabendo que a equação da capacidade total é $f(x) = x^2 + 10$, qual o volume final?",
    tipo: "alternativas",
    disposicao: "horizontal",
    espacoCalculo: 20,
    alternativas: [
        { letra: 'A', texto: "$12,25$ L" },
        { letra: 'B', texto: "$22,25$ L" },
        { letra: 'C', texto: "$15,00$ L" },
        { letra: 'D', texto: "$30,50$ L" }
    ],
    gabarito: "B"
});

renderizar();
