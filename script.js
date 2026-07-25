// ======================================================
// CONFIGURAÇÕES E ESTADO GLOBAL
// ======================================================
// Em DPI padrão (96DPI), uma folha A4 tem ~1122px de altura.
// Descontando margens/paddings da página, o limite útil é de cerca de 960px.
const ALTURA_MAXIMA_A4_PX = 960; 

let questoesNaProva = []; // Array para guardar as questões inseridas na folha

// ======================================================
// INICIALIZAÇÃO E EVENTOS
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Esconde o alerta de erro no início
    ocultarAlerta();

    // Atualiza cabeçalho em tempo real ao digitar nos inputs
    vincularAtualizacaoCabecalho();
});

// ======================================================
// FUNÇÃO PRINCIPAL: ADICIONAR QUESTÃO À PROVA
// ======================================================
function adicionarQuestao(dadosQuestao) {
    ocultarAlerta();

    const paginaA4 = document.querySelector('.pagina-a4') || document.getElementById('pagina-a4');
    const containerQuestoes = document.getElementById('container-questoes') || paginaA4;

    if (!paginaA4 || !containerQuestoes) {
        console.error("Container da página A4 não encontrado!");
        return;
    }

    // 1. Número da nova questão
    const numeroNovaQuestao = questoesNaProva.length + 1;
    dadosQuestao.numero = numeroNovaQuestao;

    // 2. Cria o elemento DOM da questão
    const elementoQuestao = criarElementoQuestaoHTML(dadosQuestao);

    // 3. Insere temporariamente na folha para medir no DOM
    containerQuestoes.appendChild(elementoQuestao);

    // 4. Captura de Alturas
    const alturaTotalOcupada = paginaA4.scrollHeight; // Altura acumulada de tudo (Cabeçalho + Questões)
    const alturaApenasDaQuestao = elementoQuestao.offsetHeight; // Altura individual dessa questão

    // ======================================================
    // LOGICA DE VERIFICAÇÃO DE ESPAÇO
    // ======================================================

    // CASO 1: A questão é maior que uma folha inteira sozinha
    if (alturaApenasDaQuestao > ALTURA_MAXIMA_A4_PX) {
        containerQuestoes.removeChild(elementoQuestao);
        exibirAlerta(`A Questão ${numeroNovaQuestao} é grande demais para caber em uma página A4!`);
        return;
    }

    // CASO 2: A folha encheu (o total acumulado passou do limite A4)
    if (alturaTotalOcupada > ALTURA_MAXIMA_A4_PX) {
        // Remove a questão que estourou a página
        containerQuestoes.removeChild(elementoQuestao);

        // Exibe a mensagem de aviso que a página ficou cheia
        exibirAlerta(`A página A4 está cheia! A Questão ${numeroNovaQuestao} não cabe na folha atual.`);
        return;
    }

    // CASO 3: Coube normalmente! Salva a questão na lista oficial
    questoesNaProva.push(dadosQuestao);
    atualizarContadorPaginas();
}

// ======================================================
// MONTAGEM DO HTML DA QUESTÃO
// ======================================================
function criarElementoQuestaoHTML(dados) {
    const div = document.createElement('div');
    div.classList.add('questao-item');
    div.setAttribute('id', `questao-${dados.numero}`);
    div.style.marginBottom = '20px';

    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 8px;">
            <strong>QUESTÃO ${dados.numero}</strong>
            <span style="font-weight: bold; font-size: 14px;">${dados.descritor ? dados.descritor : ''}</span>
        </div>
        <div class="texto-questao" style="margin-bottom: 8px;">
            ${dados.texto || 'Texto da questão...'}
        </div>
        <div class="alternativas-questao">
            <div><b>A)</b> ${dados.altA || 'A'}</div>
            <div><b>B)</b> ${dados.altB || 'B'}</div>
            <div><b>C)</b> ${dados.altC || 'C'}</div>
            <div><b>D)</b> ${dados.altD || 'D'}</div>
        </div>
    `;

    return div;
}

// ======================================================
// CONTROLE DE AVISOS E ALERTAS
// ======================================================
function exibirAlerta(mensagem) {
    const caixaAlerta = document.getElementById('mensagem-alerta') || document.querySelector('.alerta-a4');
    
    if (caixaAlerta) {
        caixaAlerta.innerHTML = `⚠️ ${mensagem}`;
        caixaAlerta.style.display = 'block';
    } else {
        alert(mensagem);
    }
}

function ocultarAlerta() {
    const caixaAlerta = document.getElementById('mensagem-alerta') || document.querySelector('.alerta-a4');
    if (caixaAlerta) {
        caixaAlerta.style.display = 'none';
    }
}

// ======================================================
// AÇÕES DOS BOTÕES DA TELA (DESFAZER, REFAZER, REINICIAR)
// ======================================================
function desfazerUltimaQuestao() {
    if (questoesNaProva.length === 0) return;

    questoesNaProva.pop();
    const containerQuestoes = document.getElementById('container-questoes');
    if (containerQuestoes && containerQuestoes.lastElementChild) {
        containerQuestoes.removeChild(containerQuestoes.lastElementChild);
    }
    ocultarAlerta();
    atualizarContadorPaginas();
}

function reiniciarProva() {
    questoesNaProva = [];
    const containerQuestoes = document.getElementById('container-questoes');
    if (containerQuestoes) {
        containerQuestoes.innerHTML = '';
    }
    ocultarAlerta();
    atualizarContadorPaginas();
}

function atualizarContadorPaginas() {
    const contador = document.getElementById('total-paginas');
    if (contador) {
        // Se houver lógica de múltiplas páginas, atualize aqui. Por enquanto, mantendo 1.
        contador.textContent = "Total de Páginas: 1"; 
    }
}

// ======================================================
// SINCRONIZAÇÃO DOS INPUTS COM O CABEÇALHO DA PROVA
// ======================================================
function vincularAtualizacaoCabecalho() {
    const mapeamento = [
        { input: 'nome-escola', target: 'preview-escola' },
        { input: 'serie-input', target: 'preview-serie' },
        { input: 'turma-input', target: 'preview-turma' },
        { input: 'professor-input', target: 'preview-professor' },
        { input: 'disciplina-input', target: 'preview-disciplina' },
        { input: 'bimestre-input', target: 'preview-bimestre' }
    ];

    mapeamento.forEach(item => {
        const inputEl = document.getElementById(item.input);
        const targetEl = document.getElementById(item.target);

        if (inputEl && targetEl) {
            inputEl.addEventListener('input', () => {
                targetEl.textContent = inputEl.value;
            });
        }
    });
}
