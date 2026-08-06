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
    logoUrl: "imagens/logopilar.png",
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
const inputEscalaImagem = document.getElementById('inputEscalaImagem');
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
const inputDescritorBanco = document.getElementById('inputDescritorBanco');
const comboboxDescritores = document.getElementById('comboboxDescritores');
const contadorDescritorAtual = document.getElementById('contadorDescritorAtual');
const btnContarTotalBanco = document.getElementById('btnContarTotalBanco');
const resultadoContadorTotal = document.getElementById('resultadoContadorTotal');
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
        escalaImagem: parseInt(inputEscalaImagem.value) || 100,
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
    inputEscalaImagem.value = "100";
    imagemCarregadaTemp = "";
    altA.value = ""; altB.value = ""; altC.value = ""; altD.value = "";
    inputRespostaGabarito.value = "";
    inputAlturaCalculo.value = "0";

    renderizar();
});

// ===================================================
// 3. FUNÇÕES DO BANCO DE QUESTÕES (BLOCO 3)
// ===================================================
// COMBOBOX CUSTOMIZADO DE DESCRITORES (substitui o antigo <datalist>)
// ===================================================
let opcoesDescritores = [];
let indiceAtivoCombobox = -1;

function popularOpcoesDescritores() {
    opcoesDescritores = Object.keys(BASE_DESCRITORES).map(codigo => ({
        codigo: codigo.toUpperCase(),
        texto: BASE_DESCRITORES[codigo]
    }));
}

function escapeHtmlCombobox(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Envolve o trecho que bateu com o termo digitado em <mark> pra destacar
function destacarTermo(texto, termo) {
    const textoSeguro = escapeHtmlCombobox(texto);
    if (!termo) return textoSeguro;
    const idx = texto.toLowerCase().indexOf(termo.toLowerCase());
    if (idx === -1) return textoSeguro;
    const antes = escapeHtmlCombobox(texto.slice(0, idx));
    const meio = escapeHtmlCombobox(texto.slice(idx, idx + termo.length));
    const depois = escapeHtmlCombobox(texto.slice(idx + termo.length));
    return `${antes}<mark>${meio}</mark>${depois}`;
}

function posicionarComboboxDescritores() {
    const rect = inputDescritorBanco.getBoundingClientRect();
    comboboxDescritores.style.top = (rect.bottom + 4) + 'px';
    comboboxDescritores.style.left = rect.left + 'px';
    comboboxDescritores.style.width = rect.width + 'px';
}

function renderComboboxDescritores(termoBruto) {
    posicionarComboboxDescritores();
    const termo = termoBruto.trim().toLowerCase();
    // Busca "fuzzy": bate tanto no código (D12) quanto em qualquer
    // palavra do texto do descritor -- não só no começo da frase.
    const resultados = termo
        ? opcoesDescritores.filter(op =>
            op.codigo.toLowerCase().includes(termo) || op.texto.toLowerCase().includes(termo))
        : opcoesDescritores;

    indiceAtivoCombobox = -1;

    if (resultados.length === 0) {
        comboboxDescritores.innerHTML = `<div class="combobox-vazio">Nenhum descritor encontrado</div>`;
        comboboxDescritores.hidden = false;
        return;
    }

    comboboxDescritores.innerHTML = resultados.map(op => `
        <div class="combobox-item" data-codigo="${op.codigo}">
            <span class="combobox-item-codigo">${destacarTermo(op.codigo, termo)}</span>
            <span class="combobox-item-texto">${destacarTermo(op.texto, termo)}</span>
        </div>
    `).join('');
    comboboxDescritores.hidden = false;

    comboboxDescritores.querySelectorAll('.combobox-item').forEach(item => {
        // mousedown (não click) pra disparar ANTES do blur do input esconder a lista
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selecionarDescritor(item.dataset.codigo);
        });
    });
}

function atualizarDestaqueCombobox(itens) {
    itens.forEach((item, i) => item.classList.toggle('combobox-item--ativo', i === indiceAtivoCombobox));
    if (indiceAtivoCombobox >= 0) itens[indiceAtivoCombobox].scrollIntoView({ block: 'nearest' });
}

function selecionarDescritor(codigo) {
    inputDescritorBanco.value = codigo;
    comboboxDescritores.hidden = true;
    carregarBancoPorDescritor(codigo);
}

// ===================================================
// CONTAGEM TOTAL DO BANCO (todos os descritores)
// ===================================================
// Busca todos os arquivos .json de uma vez (em paralelo) e soma quantas
// questões cada um tem. Arquivos que não existem (descritor sem .json
// cadastrado ainda) são simplesmente ignorados na soma.
async function contarTotalDoBanco() {
    const codigos = Object.keys(BASE_DESCRITORES);

    const resultados = await Promise.all(codigos.map(async codigo => {
        try {
            const resp = await fetch(`./questoes/${codigo.toLowerCase()}.json`);
            if (!resp.ok) return { codigo, quantidade: 0, existe: false };
            const dados = await resp.json();
            return { codigo, quantidade: Array.isArray(dados) ? dados.length : 0, existe: true };
        } catch (e) {
            return { codigo, quantidade: 0, existe: false };
        }
    }));

    const totalQuestoes = resultados.reduce((soma, r) => soma + r.quantidade, 0);
    const descritoresComArquivo = resultados.filter(r => r.existe).length;

    return { totalQuestoes, descritoresComArquivo, totalDescritores: codigos.length };
}

if (btnContarTotalBanco) {
    btnContarTotalBanco.addEventListener('click', async () => {
        btnContarTotalBanco.disabled = true;
        btnContarTotalBanco.textContent = '⏳ Contando...';
        resultadoContadorTotal.hidden = true;

        try {
            const { totalQuestoes, descritoresComArquivo, totalDescritores } = await contarTotalDoBanco();
            resultadoContadorTotal.innerHTML = `
                <strong>${totalQuestoes}</strong> questões no total
                <br><small>${descritoresComArquivo} de ${totalDescritores} descritores têm arquivo .json cadastrado</small>
            `;
            resultadoContadorTotal.hidden = false;
        } catch (e) {
            resultadoContadorTotal.innerHTML = `⚠️ Não foi possível contar o banco.`;
            resultadoContadorTotal.hidden = false;
        }

        btnContarTotalBanco.disabled = false;
        btnContarTotalBanco.textContent = '📊 Contar Total do Banco';
    });
}

if (inputDescritorBanco) {
    popularOpcoesDescritores();

    inputDescritorBanco.addEventListener('input', () => renderComboboxDescritores(inputDescritorBanco.value));
    inputDescritorBanco.addEventListener('focus', () => renderComboboxDescritores(inputDescritorBanco.value));

    inputDescritorBanco.addEventListener('blur', () => {
        // pequeno atraso pra dar tempo do mousedown do item rodar antes de esconder
        setTimeout(() => { comboboxDescritores.hidden = true; }, 120);
    });

    // Como o dropdown é position:fixed (pra escapar do overflow:auto do
    // painel lateral), ele precisa ser recalculado a cada scroll pra
    // continuar alinhado embaixo do campo -- em vez de simplesmente
    // fechar, ele acompanha a rolagem e continua aberto.
    document.addEventListener('scroll', () => {
        if (!comboboxDescritores.hidden) posicionarComboboxDescritores();
    }, true);
    window.addEventListener('resize', () => {
        if (!comboboxDescritores.hidden) posicionarComboboxDescritores();
    });

    inputDescritorBanco.addEventListener('keydown', (e) => {
        const itens = comboboxDescritores.querySelectorAll('.combobox-item');
        if (comboboxDescritores.hidden || itens.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            indiceAtivoCombobox = Math.min(indiceAtivoCombobox + 1, itens.length - 1);
            atualizarDestaqueCombobox(itens);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            indiceAtivoCombobox = Math.max(indiceAtivoCombobox - 1, 0);
            atualizarDestaqueCombobox(itens);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (indiceAtivoCombobox >= 0 && itens[indiceAtivoCombobox]) {
                selecionarDescritor(itens[indiceAtivoCombobox].dataset.codigo);
            } else {
                comboboxDescritores.hidden = true;
                carregarBancoPorDescritor(inputDescritorBanco.value);
            }
        } else if (e.key === 'Escape') {
            comboboxDescritores.hidden = true;
        }
    });
}

// BUSCA E CARREGA O ARQUIVO JSON DO DESCRITOR SELECIONADO/DIGITADO
async function carregarBancoPorDescritor(valorBruto) {
    if (!inputDescritorBanco) return;

    let valorDigitado = (typeof valorBruto === 'string' ? valorBruto : inputDescritorBanco.value).trim();

    if (!valorDigitado) {
        containerBancoQuestoes.innerHTML = '<p class="msg-orientacao">Digite ou escolha um descritor acima para carregar as questões.</p>';
        questaoBancoCarregadas = [];
        return;
    }

    // Extrai apenas o código (ex: de "D1 - Identificar..." extrai "D1")
    const match = valorDigitado.match(/d\d+(_lp)?/i);
    const codigoFormatado = match ? match[0].toUpperCase() : valorDigitado.split(' ')[0].toUpperCase();

    if (inputDescritorBanco.value !== codigoFormatado) {
        inputDescritorBanco.value = codigoFormatado;
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
            if (contadorDescritorAtual) contadorDescritorAtual.hidden = true;
            return;
        }

        renderizarListaBanco(questaoBancoCarregadas);

        if (contadorDescritorAtual) {
            const plural = questaoBancoCarregadas.length === 1 ? 'questão' : 'questões';
            contadorDescritorAtual.textContent = `${questaoBancoCarregadas.length} ${plural} em ${codigoFormatado}`;
            contadorDescritorAtual.hidden = false;
        }

    } catch (error) {
        console.error("Erro ao carregar banco:", error);
        if (contadorDescritorAtual) contadorDescritorAtual.hidden = true;
        containerBancoQuestoes.innerHTML = `
            <div class="msg-erro-banco">
                ⚠️ Não foi possível carregar as questões do descritor <strong>${codigoFormatado}</strong>.
                <br><small>Verifique se o arquivo <code>questoes/${arquivoJson}.json</code> existe.</small>
            </div>
        `;
    }
}


// Identifica de forma única a origem de uma questão do banco (descritor +
// id dentro do arquivo .json), já que o "id" sozinho se repete entre
// arquivos de descritores diferentes (cada um numera a partir de 1).
function origemBancoIdDe(q) {
    return `${(q.codigoDescritor || '').toUpperCase()}_${q.id}`;
}

function jaAdicionada(origemBancoId) {
    if (!origemBancoId) return false;
    return listaQuestoes.some(item => item.origemBancoId === origemBancoId);
}

// Atualiza os selos "Já adicionada" na lista do banco depois que a
// prova muda (adicionar, excluir, refazer) -- sem isso, a lista do
// banco ficaria com informação desatualizada até uma nova busca.
function atualizarBadgesBanco() {
    if (questaoBancoCarregadas && questaoBancoCarregadas.length > 0) {
        renderizarListaBanco(questaoBancoCarregadas);
    }
}

// Renderiza a lista do Banco de Questões com Botões de Pré-Visualizar e Adicionar
function renderizarListaBanco(questoes) {
    containerBancoQuestoes.innerHTML = '';

    questoes.forEach(q => {
        const itemDiv = document.createElement('div');
        const origemId = origemBancoIdDe(q);
        const jaEsta = jaAdicionada(origemId);
        itemDiv.className = 'item-banco-questao' + (jaEsta ? ' item-banco-questao--adicionada' : '');

        let textoLimpo = q.texto ? q.texto.replace(/\[IMAGEM\]/g, '').trim() : 'Questão sem enunciado';
        // Corta um pouco antes para encaixar perfeitamente na mesma linha
        const textoResumido = textoLimpo.length > 30 ? textoLimpo.substring(0, 30) + '...' : textoLimpo;

        itemDiv.innerHTML = `
            <div class="item-banco-info">
                <p class="item-banco-texto" title="${textoLimpo}">${textoResumido}</p>
                ${jaEsta ? '<span class="item-banco-badge">✓ Já adicionada</span>' : ''}
            </div>
            <div class="banco-acoes-btn">
                <button class="btn btn-secondary btn-mini-add" onclick="previsualizarQuestaoDoBanco('${q.id}')" title="Pré-visualizar Questão">👁️</button>
                <button class="btn btn-primary btn-mini-add" onclick="adicionarQuestaoDoBanco('${q.id}')" ${jaEsta ? 'disabled title="Esta questão já foi adicionada à prova"' : 'title="Adicionar ao Simulado"'}>➕</button>
            </div>
        `;

        containerBancoQuestoes.appendChild(itemDiv);
    });
}

// 1. PRÉ-VISUALIZAR QUESTÃO DO BANCO NO MODAL
function previsualizarQuestaoDoBanco(idQuestao) {
    const qEncontrada = questaoBancoCarregadas.find(q => q.id == idQuestao);

    if (qEncontrada) {
        // Clona a questão e garante a formatação
        questaoEmPreview = JSON.parse(JSON.stringify(qEncontrada));
        questaoEmPreview.origemBancoId = origemBancoIdDe(qEncontrada);
        questaoEmPreview.textoDescritor = BASE_DESCRITORES[questaoEmPreview.codigoDescritor] || `Descritor ${questaoEmPreview.codigoDescritor}`;

        const el = criarElementoQuestao(questaoEmPreview, 0, true);
        modalBodyContent.innerHTML = "";
        modalBodyContent.appendChild(el);

        modalPreview.classList.remove('hidden');
        renderizarLatexEm(modalBodyContent);
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
    renderizarLatexEm(modalBodyContent);
});

// 3. AÇÃO DO BOTÃO "ADICIONAR À PROVA" DO MODAL
function adicionarQuestaoDoModal() {
    if (questaoEmPreview) {
        if (questaoEmPreview.origemBancoId && jaAdicionada(questaoEmPreview.origemBancoId)) {
            alert("Esta questão já foi adicionada à prova.");
            if (modalPreview) modalPreview.classList.add('hidden');
            questaoEmPreview = null;
            return;
        }

        // Clona o objeto para não alterar a questão original do banco/formulário
        const novaQuestao = JSON.parse(JSON.stringify(questaoEmPreview));

        // Atribui o novo ID incremental da prova
        novaQuestao.id = proximoId++;
        novaQuestao.textoDescritor = BASE_DESCRITORES[novaQuestao.codigoDescritor] || `Descritor ${novaQuestao.codigoDescritor}`;

        // Adiciona à lista da prova e renderiza a folha A4
        listaQuestoes.push(novaQuestao);
        renderizar();
        atualizarBadgesBanco();

        // Fecha o modal e limpa a variável
        if (modalPreview) modalPreview.classList.add('hidden');
        questaoEmPreview = null;
    }
}

// ADICIONAR QUESTÃO DO BANCO À PROVA (direto pelo botão ➕ da lista lateral)
function adicionarQuestaoDoBanco(idQuestao) {
    const questaoEncontrada = questaoBancoCarregadas.find(q => q.id == idQuestao);

    if (questaoEncontrada) {
        const origemId = origemBancoIdDe(questaoEncontrada);
        if (jaAdicionada(origemId)) {
            alert("Esta questão já foi adicionada à prova.");
            return;
        }

        const novaQuestao = JSON.parse(JSON.stringify(questaoEncontrada));

        novaQuestao.origemBancoId = origemId;
        novaQuestao.id = proximoId++;
        novaQuestao.textoDescritor = BASE_DESCRITORES[novaQuestao.codigoDescritor] || `Descritor ${novaQuestao.codigoDescritor}`;

        listaQuestoes.push(novaQuestao);
        renderizar();
        atualizarBadgesBanco();
    }
}

btnFecharModal.addEventListener('click', () => modalPreview.classList.add('hidden'));
btnModalFechar.addEventListener('click', () => modalPreview.classList.add('hidden'));

btnRefazer.addEventListener('click', () => {
    if (listaQuestoes.length === 0 || confirm("Deseja realmente apagar todas as questões e refazer a prova?")) {
        listaQuestoes = [];
        proximoId = 1;
        renderizar();
        atualizarBadgesBanco();
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

window.alterarEscalaImagem = function(index, delta) {
    const escalaAtual = listaQuestoes[index].escalaImagem || 100;
    const novaEscala = escalaAtual + delta;
    if (novaEscala >= 10 && novaEscala <= 300) {
        listaQuestoes[index].escalaImagem = novaEscala;
        renderizar();
    }
};

// Alterna a disposição das alternativas direto pelo menu da questão já
// adicionada, sem precisar voltar no formulário de criação.
window.alterarDisposicao = function(index) {
    const ordem = ['vertical', 'horizontal', 'grade2x2'];
    const atual = listaQuestoes[index].disposicao || 'vertical';
    const proxima = ordem[(ordem.indexOf(atual) + 1) % ordem.length];
    listaQuestoes[index].disposicao = proxima;
    renderizar();
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
    atualizarBadgesBanco();
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
    const escalaImg = q.escalaImagem || 100;
    // zoom (não width) faz a escala partir do tamanho natural/ajustado da
    // própria imagem, em vez de "esticar pra caber no card". O CSS já tem
    // max-width:100% e max-height:160px em .questao-imagem, que seguem
    // valendo como trava de segurança mesmo com o zoom aplicado.
    let htmlImagem = q.imagem ? `<img src="${q.imagem}" class="questao-imagem" style="zoom: ${escalaImg}%;" alt="Imagem da questão">` : '';

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
        const disposicoesValidas = ['vertical', 'horizontal', 'grade2x2'];
        let classeDisposicao = disposicoesValidas.includes(q.disposicao) ? q.disposicao : 'vertical';
        let altHtml = q.alternativas.map(alt => {
            const classeCorreta = (exibirGabaritoProfessor && alt.letra === q.gabarito) ? 'opcao-alt-correta' : '';
            return `
                <div class="opcao-alt ${classeCorreta}" data-letra="${alt.letra}">
                    <strong>(${alt.letra})</strong>
                    <span>${alt.texto}</span>
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

    const rotulosDisposicao = { vertical: 'Vertical', horizontal: 'Horizontal', grade2x2: 'Grade 2x2' };
    let botaoDisposicao = (q.tipo === 'alternativas') ? `
            <button class="btn-mini-compact" onclick="alterarDisposicao(${index})" title="Alternar disposição das alternativas (atual: ${rotulosDisposicao[q.disposicao] || 'Vertical'}) → clique para trocar">⇄</button>
    ` : '';

    let botoesEscalaImagem = q.imagem ? `
            <button class="btn-mini-compact" onclick="alterarEscalaImagem(${index}, 10)" title="+10% na Imagem (atual: ${escalaImg}%)">I+</button>
            <button class="btn-mini-compact" onclick="alterarEscalaImagem(${index}, -10)" title="-10% na Imagem (atual: ${escalaImg}%)">I-</button>
    ` : '';

    // 3. BARRA DE AÇÕES (SUBIR, DESCER, ESPAÇO, DISPOSIÇÃO, ESCALA DE IMAGEM, EXCLUIR)
    let acoesHtml = isPreviewMode ? '' : `
        <div class="questao-acoes">
            <button class="btn-mini-compact btn-move" onclick="moverQuestao(${index}, -1)" ${isPrimeiro ? 'disabled' : ''} title="Subir">▲</button>
            <button class="btn-mini-compact btn-move" onclick="moverQuestao(${index}, 1)" ${isUltimo ? 'disabled' : ''} title="Descer">▼</button>
            <button class="btn-mini-compact" onclick="alterarEspaco(${index}, 5)" title="+5px Espaço (atual: ${q.espacoCalculo || 0}px)">+E</button>
            <button class="btn-mini-compact" onclick="alterarEspaco(${index}, -5)" title="-5px Espaço (atual: ${q.espacoCalculo || 0}px)">-E</button>
            ${botaoDisposicao}
            ${botoesEscalaImagem}
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
function criarNovaFolha(numPagina, forcarUmaColuna = false) {
    const nColunasDestaFolha = forcarUmaColuna ? 1 : numColunas;
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
    if (nColunasDestaFolha === 2) conteudo.classList.add('duas-colunas');

    // Colunas reais (divs), controladas 100% pelo JS -- substitui o
    // column-count nativo do CSS. É isso que elimina a imprevisibilidade
    // de altura/linha divisória: cada coluna tem sua própria altura real,
    // medida pelo próprio flexbox, sem depender de cálculo manual em JS.
    const colunas = [];
    for (let i = 0; i < nColunasDestaFolha; i++) {
        const col = document.createElement('div');
        col.className = 'coluna';
        conteudo.appendChild(col);
        colunas.push(col);
    }

    folha.innerHTML = htmlCabecalho;
    folha.appendChild(conteudo);

    const rodape = document.createElement('div');
    rodape.className = 'folha-rodape';
    rodape.innerText = `Página ${numPagina}`;
    folha.appendChild(rodape);

    containerFolhas.appendChild(folha);
    return { folha, conteudo, colunas, rodape };
}

// Testa se UMA coluna específica estourou (vertical ou horizontal).
// Muito mais confiável que medir o container de colunas inteiro: cada
// .coluna é uma div comum, sem o comportamento especial do multi-coluna
// nativo do CSS (que enchia a 1ª coluna até o talo e só sobrava pra 2ª).
function testarOverflowColuna(col) {
    const TOLERANCIA_PX = 2;
    const estouroVertical = (col.scrollHeight - col.clientHeight) > TOLERANCIA_PX;
    const estouroHorizontal = (col.scrollWidth - col.clientWidth) > TOLERANCIA_PX;
    return estouroVertical || estouroHorizontal;
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


// Renderiza fórmulas LaTeX (KaTeX) dentro de um elemento específico.
// Precisa ser chamada questão por questão, ANTES de medir overflow,
// porque o texto cru ("$x^2$") é bem menor que a fórmula já renderizada
// -- se a medição de altura/largura ocorrer antes do KaTeX rodar, uma
// questão pode "parecer" que cabe na página/coluna e só estourar depois,
// gerando colunas extras (a famosa "3ª coluna fantasma").
function renderizarLatexEm(el) {
    if (!window.renderMathInElement) return;
    renderMathInElement(el, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

// RENDERIZADOR PRINCIPAL
// Pré-carrega uma lista de URLs de imagem, só resolvendo quando TODAS
// tiverem terminado de carregar (ou falhado -- não trava esperando pra
// sempre se uma imagem der erro). Isso evita que a paginação seja
// calculada com uma imagem ainda em altura 0 (não carregada), o que
// fazia a caixa "crescer" depois que a imagem terminava de carregar,
// bagunçando uma página que já estava montada corretamente.
function precarregarImagens(urls) {
    const unicas = [...new Set(urls.filter(Boolean))];
    return Promise.all(unicas.map(url => new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
    })));
}

async function renderizar() {
    // Espera todas as imagens das questões carregarem ANTES de calcular
    // a paginação -- mesma lógica já aplicada ao LaTeX (renderizar antes
    // de medir). Enquanto isso, a página anterior continua visível na
    // tela (só é limpa depois que as imagens já estão prontas).
    const urlsImagens = listaQuestoes.map(q => q.imagem).filter(Boolean);
    await precarregarImagens(urlsImagens);

    containerFolhas.innerHTML = '';

    // SE NÃO HOUVER QUESTÕES, EXIBE A MENSAGEM DE ORIENTAÇÃO...
    if (listaQuestoes.length === 0) {
        const folhaInicial = criarNovaFolha(1, true);
        const mensagemPlaceholder = document.createElement('div');
        mensagemPlaceholder.className = 'mensagem-prova-vazia';
        mensagemPlaceholder.style.flex = '1';
        mensagemPlaceholder.innerHTML = `
            <div class="placeholder-conteudo">
                <span class="placeholder-icone">📝</span>
                <h3>Nenhuma questão adicionada</h3>
                <p>Utilize o menu lateral para <strong>Criar Questões</strong> ou <strong>Selecionar do Banco (SAEB)</strong>.</p>
            </div>
        `;
        folhaInicial.colunas[0].appendChild(mensagemPlaceholder);

        if (paginaAtualEl) paginaAtualEl.innerText = "1";
        if (totalPaginasEl) totalPaginasEl.innerText = "1";
        return;
    }

    // 1. RENDERIZA AS QUESTÕES DA PROVA
    // Empacotamento manual: o JS decide em qual das colunas (divs reais)
    // cada questão entra. A ORDEM das questões nunca muda (a numeração
    // impressa continua igual à ordem em que você adicionou/organizou),
    // só a decisão de "cabe aqui ou vai pra próxima coluna/página" fica
    // mais precisa -- cada coluna é medida individualmente, então a
    // coluna 2 é preenchida de verdade, em vez de só receber a "sobra"
    // do que não coube na coluna 1.
    let numPagina = 1;
    let folhaAtual = criarNovaFolha(numPagina);
    let colIndex = 0;
    let colunaAtual = folhaAtual.colunas[colIndex];

    function avancarColuna() {
        colIndex++;
        if (colIndex >= folhaAtual.colunas.length) {
            numPagina++;
            folhaAtual = criarNovaFolha(numPagina);
            colIndex = 0;
        }
        colunaAtual = folhaAtual.colunas[colIndex];
        return colunaAtual;
    }

    listaQuestoes.forEach((qData, index) => {
        const elQuestao = criarElementoQuestao(qData, index);
        colunaAtual.appendChild(elQuestao);

        // Renderiza o LaTeX da questão ANTES de medir overflow, para que
        // a medição use o tamanho real da fórmula já processada.
        renderizarLatexEm(elQuestao);

        if (testarOverflowColuna(colunaAtual)) {
            colunaAtual.removeChild(elQuestao);
            let tentativas = 0;
            do {
                avancarColuna();
                colunaAtual.appendChild(elQuestao);
                tentativas++;
            } while (testarOverflowColuna(colunaAtual) && colunaAtual.children.length > 1 && tentativas < 6);
            // Se mesmo sozinha numa coluna vazia a questão não couber
            // (colunaAtual.children.length === 1), é porque ela é maior
            // que uma coluna inteira -- não há mais pra onde mover, então
            // ela fica ali mesmo, podendo ultrapassar o limite.
        }
    });

    // 2. APLICA A LÓGICA DO CARTÃO DE RESPOSTAS (GABARITO)
    if (modoGabarito === 'final_prova') {
        const elGabarito = criarElementoGabarito();
        colunaAtual.appendChild(elGabarito);

        // Continua tentando a próxima coluna/página até caber -- uma
        // única tentativa não bastava quando a coluna seguinte também já
        // estava ocupada por questões, deixando o gabarito cortado.
        let tentativas = 0;
        while (testarOverflowColuna(colunaAtual) && tentativas < 6) {
            colunaAtual.removeChild(elGabarito);
            avancarColuna();
            colunaAtual.appendChild(elGabarito);
            tentativas++;
        }
    } else if (modoGabarito === 'folha_separada') {
        // Cria uma nova folha dedicada exclusivamente ao Cartão de Respostas
        numPagina++;
        const folhaGabaritoDedicada = criarNovaFolha(numPagina);
        const elGabarito = criarElementoGabarito();
        folhaGabaritoDedicada.colunas[0].appendChild(elGabarito);
    }

    // ATUALIZA NÚMERO DAS PÁGINAS NO RODAPÉ
    const todasFolhas = containerFolhas.querySelectorAll('.folha-a4');
    todasFolhas.forEach((folha, idx) => {
        const rodape = folha.querySelector('.folha-rodape');
        rodape.innerText = `Página ${idx + 1} de ${todasFolhas.length}`;
    });

    if (paginaAtualEl) paginaAtualEl.innerText = "1";
    if (totalPaginasEl) totalPaginasEl.innerText = todasFolhas.length;

    // Rede de segurança: as questões já tiveram o LaTeX renderizado
    // individualmente acima (antes da medição de overflow). Esta chamada
    // cobre qualquer conteúdo fora das questões, como o cartão de respostas.
    renderizarLatexEm(containerFolhas);
}

//Detecta a rolagem em QUALQUER elemento e atualiza o X (paginaAtual)
function atualizarNumeroPaginaAtual() {
    const elX = document.getElementById('paginaAtual');
    const folhas = document.querySelectorAll('.folha-a4');

    if (!elX || folhas.length === 0) return;

    let paginaVisivel = 1;
    const centroTela = window.innerHeight / 2;

    folhas.forEach((folha, index) => {
        const rect = folha.getBoundingClientRect();
        // Verifica se a folha A4 cruzou a metade vertical da tela
        if (rect.top <= centroTela && rect.bottom >= 0) {
            paginaVisivel = index + 1;
        }
    });

    elX.textContent = paginaVisivel;
}

// Escuta o scroll na janela (useCapture = true garante que pega o scroll de divs internas também)
window.addEventListener('scroll', atualizarNumeroPaginaAtual, true);

renderizar();
