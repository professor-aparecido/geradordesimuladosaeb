// ======================================================
// CONFIGURAÇÕES DE DIMENSÃO (A4 em Pixels)
// ======================================================
// Em 96 DPI, a folha A4 tem ~1122px. Com margens, o limite útil é cerca de 960px.
const ALTURA_MAXIMA_A4_PX = 960; 

let questoesNaProva = [];

document.addEventListener('DOMContentLoaded', () => {
    ocultarAlerta();
    vincularCamposFormulario();
});

// ======================================================
// FUNÇÃO PRINCIPAL: ADICIONAR QUESTÃO
// ======================================================
function adicionarQuestao(dadosQuestao) {
    ocultarAlerta();

    // 1. Localiza a folha A4 atual ou o container principal
    const containerProvas = document.getElementById('conteudoProvasContainer');
    if (!containerProvas) return;

    // Pega a página A4 visível (ou usa o próprio container caso as páginas sejam geradas dentro dele)
    let paginaA4 = containerProvas.querySelector('.folha-a4') || containerProvas;

    // 2. Define o número da nova questão
    const numeroQuestao = questoesNaProva.length + 1;
    dadosQuestao.numero = numeroQuestao;

    // 3. Cria o elemento HTML da questão
    const elQuestao = criarElementoQuestao(dadosQuestao);

    // 4. Inserção TEMPORÁRIA para o navegador calcular a altura no DOM
    paginaA4.appendChild(elQuestao);

    // 5. Medição exata de alturas
    const alturaTotalAcumulada = paginaA4.scrollHeight; // Altura acumulada (Cabeçalho + Questões)
    const alturaIndividualQuestao = elQuestao.offsetHeight; // Altura só desta questão

    // ======================================================
    // LOGICA DE CHECAGEM DE ESPAÇO
    // ======================================================

    // A) Questão sozinha é maior que uma página A4 em branco
    if (alturaIndividualQuestao > ALTURA_MAXIMA_A4_PX) {
        paginaA4.removeChild(elQuestao);
        exibirAlerta(`A Questão ${numeroQuestao} é grande demais para caber em uma página A4!`);
        return;
    }

    // B) Folha A4 encheu com o acúmulo das questões
    if (alturaTotalAcumulada > ALTURA_MAXIMA_A4_PX) {
        paginaA4.removeChild(elQuestao); // Remove a questão da página cheia
        
        exibirAlerta(`A página atual está cheia! A Questão ${numeroQuestao} não cabe na folha A4.`);
        return;
    }

    // C) Coube com sucesso! Registra no sistema
    questoesNaProva.push(dadosQuestao);
    atualizarInfoPaginas();
}

// ======================================================
// MONTAGEM DO ELEMENTO DA QUESTÃO
// ======================================================
function criarElementoQuestao(dados) {
    const div = document.createElement('div');
    div.className = 'questao-item';
    div.id = `questao-${dados.numero}`;
    div.style.marginBottom = '15px';

    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #000; padding-bottom: 2px; margin-bottom: 6px;">
            <strong>QUESTÃO ${dados.numero}</strong>
            <span style="font-weight: bold;">${dados.descritor || ''}</span>
        </div>
        <div class="enunciado" style="margin-bottom: 6px;">
            ${dados.texto || 'Texto da questão...'}
        </div>
        <div class="alternativas">
            <div><b>A)</b> ${dados.altA || 'A'}</div>
            <div><b>B)</b> ${dados.altB || 'B'}</div>
            <div><b>C)</b> ${dados.altC || 'C'}</div>
            <div><b>D)</b> ${dados.altD || 'D'}</div>
        </div>
    `;

    return div;
}

// ======================================================
// CONTROLE DO BANNER DE ALERTA DINÂMICO (#containerAlertaExt)
// ======================================================
function exibirAlerta(mensagem) {
    const bannerAlerta = document.getElementById('containerAlertaExt');
    if (bannerAlerta) {
        bannerAlerta.innerHTML = `
            <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; border: 1px solid #f5c6cb; text-align: center; margin-bottom: 10px; font-weight: bold;">
                ⚠️ ${mensagem}
            </div>
        `;
        bannerAlerta.style.display = 'block';
    }
}

function ocultarAlerta() {
    const bannerAlerta = document.getElementById('containerAlertaExt');
    if (bannerAlerta) {
        bannerAlerta.innerHTML = '';
        bannerAlerta.style.display = 'none';
    }
}

// ======================================================
// AUXILIARES
// ======================================================
function atualizarInfoPaginas() {
    const spanInfo = document.getElementById('infoPaginas');
    if (spanInfo) {
        spanInfo.textContent = "Total de Páginas: 1";
    }
}

function desfazerUltima() {
    if (questoesNaProva.length === 0) return;
    
    questoesNaProva.pop();
    const containerProvas = document.getElementById('conteudoProvasContainer');
    const ultimaQuestao = containerProvas.querySelector('.questao-item:last-child');
    if (ultimaQuestao) {
        ultimaQuestao.remove();
    }
    ocultarAlerta();
}

function imprimirProva() {
    window.print();
}

function vincularCamposFormulario() {
    // Sincroniza campos se necessário
}
