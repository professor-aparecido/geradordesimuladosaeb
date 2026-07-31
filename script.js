// DICIONÁRIO PRÉ-CADASTRADO DOS DESCRITORES SAEB
const BASE_DESCRITORES = {
    // MATEMÁTICA
"D1": "Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas.",
"D2": "Identificar propriedades comuns e diferenças entre figuras bidimensionais e tridimensionais, relacionando-as com as suas planificações.",
"D3": "Identificar propriedades de triângulos pela comparação de medidas de lados e ângulos.",
"D4": "Identificar relação entre quadriláteros por meio de suas propriedades.",
"D5": "Reconhecer a conservação ou modificação de medidas dos lados, do perímetro, da área em ampliação e/ou redução de figuras poligonais usando malhas quadriculadas.",
"D6": "Reconhecer ângulos como mudança de direção ou giros, identificando ângulos retos e não retos.",
"D7": "Reconhecer que as imagens de uma figura construída por uma transformação homotética são semelhantes, identificando propriedades e/ou medidas que se modificam ou não se alteram.",
"D8": "Resolver problema utilizando propriedades dos polígonos (soma de seus ângulos internos, número de diagonais, cálculo da medida de cada ângulo interno nos polígonos regulares).",
"D9": "Interpretar informações apresentadas por meio de coordenadas cartesianas.",
"D10": "Utilizar relações métricas do triângulo retângulo para resolver problemas significativos.",
"D11": "Reconhecer círculo/circunferência, seus elementos e algumas de suas relações.",
"D12": "Resolver problema envolvendo o cálculo de perímetro de figuras planas.",
"D13": "Resolver problema envolvendo o cálculo de área de figuras planas.",
"D14": "Resolver problema envolvendo noções de volume.",
"D15": "Resolver problema utilizando relações entre diferentes unidades de medida.",
"D16": "Identificar a localização de números inteiros na reta numérica.",
"D17": "Identificar a localização de números racionais na reta numérica.",
"D18": "Efetuar cálculos com números inteiros, envolvendo as operações (adição, subtração, multiplicação, divisão, potenciação).",
"D19": "Resolver problema com números naturais, envolvendo diferentes significados das operações (adição, subtração, multiplicação, divisão, potenciação).",
"D20": "Resolver problema com números inteiros envolvendo as operações (adição, subtração, multiplicação, divisão, potenciação).",
"D21": "Reconhecer as diferentes representações de um número racional.",
"D22": "Identificar fração como representação que pode estar associada a diferentes significados.",
"D23": "Identificar frações equivalentes.",
"D24": "Reconhecer as representações decimais dos números racionais como uma extensão do sistema de numeração decimal, identificando a existência de “ordens” como décimos, centésimos e milésimos.",
"D25": "Efetuar cálculos que envolvam operações com números racionais (adição, subtração, multiplicação, divisão, potenciação).",
"D26": "Resolver problema com números racionais envolvendo as operações (adição, subtração, multiplicação, divisão, potenciação).",
"D27": "Efetuar cálculos simples com valores aproximados de radicais.",
"D28": "Resolver problema que envolva porcentagem.",
"D29": "Resolver problema que envolva variação proporcional, direta ou inversa, entre grandezas.",
"D30": "Calcular o valor numérico de uma expressão algébrica.",
"D31": "Resolver problema que envolva equação do 2º grau.",
"D32": "Identificar a expressão algébrica que expressa uma regularidade observada em seqüências de números ou figuras (padrões).",
"D33": "Identificar uma equação ou inequação do 1º grau que expressa um problema.",
"D34": "Identificar um sistema de equações do 1º grau que expressa um problema.",
"D35": "Identificar a relação entre as representações algébrica e geométrica de um sistema de equações do 1º grau.",
"D36": "Resolver problema envolvendo informações apresentadas em tabelas e/ou gráficos.",
"D37": "Associar informações apresentadas em listas e/ou tabelas simples aos gráficos que as representam e vice-versa.",
};

// ESTADO GLOBAL DA APLICAÇÃO
let listaQuestoes = [];
let questaoBancoCarregadas = []; // Armazena as questões do JSON ativo
let proximoId = 1;
let zoomNivel = 1.0;
let numColunas = 2;
let imagemCarregadaTemp = "";
let exibirGabaritoProfessor = false;
let questaoEmPreview = null;
let modoGabarito = 'final_prova'; // 'nenhum', 'final_prova' ou 'folha_separada'

const selectModoGabarito = document.getElementById('selectModoGabarito');

if (selectModoGabarito) {
    selectModoGabarito.addEventListener('change', (e) => {
        modoGabarito = e.target.value;
        renderizar();
    });
}

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
    btnAccIcon.innerText = isCollapsed ? '▼' : '▲';
});

btnToggleCriarQuestao.addEventListener('click', () => {
    const isCollapsed = bodyCriarQuestao.classList.toggle('collapsed');
    btnAccIconQuestao.innerText = isCollapsed ? '▼' : '▲';
});

if (btnToggleBanco) {
    btnToggleBanco.addEventListener('click', () => {
        const isCollapsed = bodyBanco.classList.toggle('collapsed');
        if (btnAccIconBanco) btnAccIconBanco.innerText = isCollapsed ? '▼' : '▲';
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
// POPULA O DATALIST EXIBINDO APENAS UMA LINHA COM O TEXTO EM MAIÚSCULAS
function popularDatalistDescritores() {
    const listaDatalist = document.getElementById('listaDescritores');
    if (!listaDatalist) return;

    listaDatalist.innerHTML = '';

    Object.keys(BASE_DESCRITORES).forEach(codigo => {
        const option = document.createElement('option');
        // Ao definir APENAS o value com a frase em MAIÚSCULA, o navegador exibe 1 única linha limpa
        option.value = `${codigo.toUpperCase()} - ${BASE_DESCRITORES[codigo]}`;
        listaDatalist.appendChild(option);
    });
}

// BUSCA E CARREGA O ARQUIVO JSON DO DESCRITOR SELECIONADO/DIGITADO
async function carregarBancoPorDescritor() {
    if (!selectDescritorBanco) return;
    
    let valorDigitado = selectDescritorBanco.value.trim();

    if (!valorDigitado) {
        containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Digite ou escolha um descritor acima para carregar as questões.</p>';
        questaoBancoCarregadas = [];
        return;
    }

    // Extrai apenas o código (ex: de "D1 - Identificar..." extrai "D1")
    const match = valorDigitado.match(/d\d+(_lp)?/i);
    const codigoFormatado = match ? match[0].toUpperCase() : valorDigitado.split(' ')[0].toUpperCase();

    // 💡 AQUI ESTÁ O TRUQUE: Se o campo contiver mais do que só o código, 
    // atualizamos o input para exibir Apenas o Código (ex: D1)
    if (selectDescritorBanco.value !== codigoFormatado) {
        selectDescritorBanco.value = codigoFormatado;
    }

    // Nome do arquivo .json em minúsculo (ex: "d1")
    const arquivoJson = codigoFormatado.toLowerCase();

    containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Carregando questões...</p>';

    try {
        const response = await fetch(`./questoes/${arquivoJson}.json`);

        if (!response.ok) {
            throw new Error(`Arquivo ${arquivoJson}.json não encontrado em ./questoes/`);
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
                ⚠️ Não foi possível carregar as questões do descritor <strong>${codigoFormatado}</strong>.
                <br><small>Verifique se o arquivo <code>questoes/${arquivoJson}.json</code> existe.</small>
            </div>
        `;
    }
}

// LISTENERS E INICIALIZAÇÃO
if (selectDescritorBanco) {
    popularDatalistDescritores(); // Preenche as opções do datalist no início
    selectDescritorBanco.addEventListener('input', carregarBancoPorDescritor);
    selectDescritorBanco.addEventListener('change', carregarBancoPorDescritor);
}


// Renderiza a lista do Banco de Questões com Botões de Pré-Visualizar e Adicionar
function renderizarListaBanco(questoes) {
    containerBancoQuestoes.innerHTML = '';

    questoes.forEach(q => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-banco-questao';

        let textoLimpo = q.texto ? q.texto.replace(/\[IMAGEM\]/g, '').trim() : 'Questão sem enunciado';
        // Corta um pouco antes para encaixar perfeitamente na mesma linha
        const textoResumido = textoLimpo.length > 30 ? textoLimpo.substring(0, 30) + '...' : textoLimpo;

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

// 1. PRÉ-VISUALIZAR QUESTÃO DO BANCO NO MODAL
function previsualizarQuestaoDoBanco(idQuestao) {
    const qEncontrada = questaoBancoCarregadas.find(q => q.id == idQuestao);

    if (qEncontrada) {
        // Clona a questão e garante a formatação
        questaoEmPreview = JSON.parse(JSON.stringify(qEncontrada));
        questaoEmPreview.textoDescritor = BASE_DESCRITORES[questaoEmPreview.codigoDescritor] || `Descritor ${questaoEmPreview.codigoDescritor}`;
        
        const el = criarElementoQuestao(questaoEmPreview, 0, true);
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

// 2. PRÉ-VISUALIZAR DA CRIAÇÃO MANUAL (BLOCO 2)
btnPreVisualizar.addEventListener('click', () => {
    // Armazena a questão manual na mesma variável global
    questaoEmPreview = obterDadosFormularioQuestao();
    
    const el = criarElementoQuestao(questaoEmPreview, 0, true);
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

// 3. AÇÃO DO BOTÃO "ADICIONAR À PROVA" DO MODAL
function adicionarQuestaoDoModal() {
    if (questaoEmPreview) {
        const novaQuestao = JSON.parse(JSON.stringify(questaoEmPreview));
        
        // Atribui o novo ID sequencial da prova
        novaQuestao.id = proximoId++;
        
        listaQuestoes.push(novaQuestao);
        renderizar();
        
        // Esconde o modal
        modalPreview.classList.add('hidden');
        
        // Limpa a variável
        questaoEmPreview = null;
    }
}

// Função chamada quando clica no botão "➕ Adicionar à Prova" do modal
// Função chamada quando clica no botão "➕ Adicionar à Prova" do modal
function adicionarQuestaoDoModal() {
    if (questaoEmPreview) {
        // Clona o objeto para não alterar a questão original do banco
        const novaQuestao = JSON.parse(JSON.stringify(questaoEmPreview));
        
        // Atribui o novo ID incremental da prova
        novaQuestao.id = proximoId++;
        novaQuestao.textoDescritor = BASE_DESCRITORES[novaQuestao.codigoDescritor] || `Descritor ${novaQuestao.codigoDescritor}`;
        
        // Adiciona à lista da prova e renderiza a folha A4
        listaQuestoes.push(novaQuestao);
        renderizar();
        
        // Fecha o modal
        if (modalPreview) {
            modalPreview.classList.add('hidden');
        }
    }
}

// ADICIONAR QUESTÃO DO BANCO À PROVA (direto pelo botão ➕ da lista lateral)
function adicionarQuestaoDoBanco(idQuestao) {
    const questaoEncontrada = questaoBancoCarregadas.find(q => q.id == idQuestao);

    if (questaoEncontrada) {
        const novaQuestao = JSON.parse(JSON.stringify(questaoEncontrada));
        
        novaQuestao.id = proximoId++;
        novaQuestao.textoDescritor = BASE_DESCRITORES[novaQuestao.codigoDescritor] || `Descritor ${novaQuestao.codigoDescritor}`;
        
        listaQuestoes.push(novaQuestao);
        renderizar();
    }
}


// ADICIONAR QUESTÃO DO BANCO À PROVA

function adicionarQuestaoDoBanco(idQuestao) {
    const questaoEncontrada = questaoBancoCarregadas.find(q => q.id == idQuestao);

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
let tagDescritor = q.codigoDescritor ? `<span class="questao-descritor-tag tooltip-descritor" data-tooltip="${textoTooltip}">${q.codigoDescritor}</span>` : '';

let htmlConteudoTipo = '';

    // 1. QUESTÃO DE MÚLTIPLA ESCOLHA
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
    } 

    // 2. MONTAGEM DO ESPAÇO DE RESPOSTA / CÁLCULO E GABARITO DA QUESTÃO ABERTA
    let htmlGabaritoSubjetiva = (exibirGabaritoProfessor && q.respostaGabarito)
        ? `<div class="gabarito-subjetiva"><strong>Gabarito Esperado:</strong> ${q.respostaGabarito}</div>`
        : '';

    let htmlEspacoCalculo = '';
    
    if (q.espacoCalculo > 0) {
        // Se houver espaço definido, injeta o gabarito DENTRO da própria caixa de cálculo
        htmlEspacoCalculo = `
            <div class="espaco-calculo" style="height: ${q.espacoCalculo}px;">
                ${q.tipo !== 'alternativas' ? htmlGabaritoSubjetiva : ''}
            </div>
        `;
    } else if (q.tipo !== 'alternativas' && htmlGabaritoSubjetiva) {
        // Fallback: se for questão aberta e NÃO tiver espaço de cálculo cadastrado, insere o gabarito abaixo do enunciado
        htmlConteudoTipo = htmlGabaritoSubjetiva;
    }

    // 3. BARRA DE AÇÕES (SUBIR, DESCER, ESPAÇO, EXCLUIR)
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
                    <div class="prova-titulo">${dadosCabecalho.tituloProva} ${exibirGabaritoProfessor ? ' (GABARITO)' : ''}</div>
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

function testarOverflow(el) {
    const TOLERANCIA_PX = 15; // Aceita até 15px de variação antes de pular a página
    return (el.scrollHeight - el.clientHeight) > TOLERANCIA_PX;
}


// ===================================================
// GERADOR DO CARTÃO DE RESPOSTAS (GABARITO)
// ===================================================
function criarElementoGabarito() {
    const container = document.createElement('div');
    container.className = 'cartao-respostas-container';

    let htmlItens = '';

    listaQuestoes.forEach((q, index) => {
        if (q.tipo === 'alternativas') {
            const letras = ['A', 'B', 'C', 'D'];
            let bolinhasHtml = letras.map(letra => {
                const isCorreta = (exibirGabaritoProfessor && q.gabarito === letra) ? 'correta' : '';
                return `<div class="bolinha ${isCorreta}">${letra}</div>`;
            }).join('');

            htmlItens += `
                <div class="gabarito-item">
                    <span class="gabarito-num">${String(index + 1).padStart(2, '0')}</span>
                    <div class="gabarito-opcoes">${bolinhasHtml}</div>
                </div>
            `;
        } else {
            htmlItens += `
                <div class="gabarito-item">
                    <span class="gabarito-num">${String(index + 1).padStart(2, '0')}</span>
                    <span style="font-size: 10px; color: #555;">[ Discursiva ]</span>
                </div>
            `;
        }
    });

    const totalLinhas = Math.max(1, Math.ceil(listaQuestoes.length / 2));

    container.innerHTML = `
        <div class="cartao-respostas-titulo">
            FOLHA DE RESPOSTAS (GABARITO)
        </div>

        <!-- GRADE COM AS QUESTÕES -->
        <div class="cartao-respostas-grid" style="grid-template-rows: repeat(${totalLinhas}, auto);">
            ${htmlItens}
        </div>

        <!-- ASSINATURA NO FINAL (RODAPÉ) COM TRAÇO EM CIMA DO TEXTO -->
        <div class="gabarito-assinatura-rodape">
            <div class="gabarito-linha-assinatura"></div>
            <span class="gabarito-texto-assinatura">Assinatura do Aluno(a)</span>
        </div>
    `;

    return container;
}


// RENDERIZADOR PRINCIPAL
function renderizar() {
    containerFolhas.innerHTML = '';

    // SE NÃO HOUVER QUESTÕES, EXIBE A MENSAGEM DE ORIENTAÇÃO...
    if (listaQuestoes.length === 0) {
        const folhaInicial = criarNovaFolha(1);
        const mensagemPlaceholder = document.createElement('div');
        mensagemPlaceholder.className = 'mensagem-prova-vazia';
        mensagemPlaceholder.innerHTML = `
            <div class="placeholder-conteudo">
                <span class="placeholder-icone">📝</span>
                <h3>Nenhuma questão adicionada</h3>
                <p>Utilize o menu lateral para <strong>Criar Questões</strong> ou <strong>Selecionar do Banco (SAEB)</strong>.</p>
            </div>
        `;
        folhaInicial.conteudo.appendChild(mensagemPlaceholder);

        if (paginaAtualEl) paginaAtualEl.innerText = "1";
        if (totalPaginasEl) totalPaginasEl.innerText = "1";
        return;
    }

    // 1. RENDERIZA AS QUESTÕES DA PROVA
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

    // 2. APLICA A LÓGICA DO CARTÃO DE RESPOSTAS (GABARITO)
    if (modoGabarito === 'final_prova') {
        const elGabarito = criarElementoGabarito();
        folhaAtual.conteudo.appendChild(elGabarito);

        // Se o gabarito não couber no final da última folha, cria uma nova página para ele
        if (testarOverflow(folhaAtual.conteudo)) {
            folhaAtual.conteudo.removeChild(elGabarito);
            numPagina++;
            folhaAtual = criarNovaFolha(numPagina);
            folhaAtual.conteudo.appendChild(elGabarito);
        }
    } else if (modoGabarito === 'folha_separada') {
        // Cria uma nova folha dedicada exclusivamente ao Cartão de Respostas
        numPagina++;
        const folhaGabaritoDedicada = criarNovaFolha(numPagina);
        const elGabarito = criarElementoGabarito();
        
        // Em folha separada, podemos duplicar o cartão na mesma folha para economizar papel ao cortar!
        folhaGabaritoDedicada.conteudo.appendChild(elGabarito);
    }

    // ATUALIZA NÚMERO DAS PÁGINAS NO RODAPÉ
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


renderizar();
