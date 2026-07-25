// ======================================================
// CONFIGURAÇÕES DE DIMENSÃO (A4)
// ======================================================
// Em 96 DPI, uma folha A4 tem ~1123px de altura.
// Descontando margens internas (padding), o espaço útil é de cerca de 950px a 1000px.
const ALTURA_MAXIMA_A4_PX = 980; 

// ======================================================
// FUNÇÃO PRINCIPAL PARA ADICIONAR QUESTÃO
// ======================================================
function adicionarQuestaoAoSimulado(dadosQuestao) {
    // 1. Oculta avisos anteriores
    esconderMensagemAlerta();

    // 2. Obtém a página A4 atual onde as questões estão sendo inseridas
    const paginaAtual = document.querySelector('.pagina-a4-atual'); 
    if (!paginaAtual) return;

    // 3. Cria o elemento HTML da nova questão
    const novaQuestaoEl = criarElementoHTMLQuestao(dadosQuestao);

    // 4. Inserção temporária no DOM (fundamental para o navegador calcular a altura real)
    paginaAtual.appendChild(novaQuestaoEl);

    // 5. Captura de Medidas
    const alturaTotalPagina = paginaAtual.scrollHeight; // Altura acumulada (Cabeçalho + Questões)
    const alturaQuestao = novaQuestaoEl.offsetHeight;   // Altura apenas desta questão

    // ======================================================
    // VERIFICAÇÕES DE ESTOURO / LIMITE
    // ======================================================

    // CENÁRIO 1: A questão sozinha é gigantesca (maior que o espaço total da folha A4)
    if (alturaQuestao > ALTURA_MAXIMA_A4_PX) {
        paginaAtual.removeChild(novaQuestaoEl); // Remove a questão
        exibirMensagemAlerta(`A Questão ${dadosQuestao.numero} é grande demais para caber em uma página A4!`);
        return;
    }

    // CENÁRIO 2: A folha encheu porque acumularam muitas questões
    if (alturaTotalPagina > ALTURA_MAXIMA_A4_PX) {
        // Remove a questão que "vazou" da página atual
        paginaAtual.removeChild(novaQuestaoEl);

        // Notifica o usuário ou cria uma nova página automaticamente
        exibirMensagemAlerta(`A página atual está cheia! A Questão ${dadosQuestao.numero} não cabe aqui.`);
        
        /* 
        // DICA: Se o seu sistema tiver suporte a múltiplas páginas, 
        // você pode descomentar as linhas abaixo para criar uma nova folha automaticamente:
        
        const novaPagina = criarNovaPaginaA4();
        novaPagina.appendChild(novaQuestaoEl);
        atualizarContadorDePaginas();
        */
    }
}

// ======================================================
// FUNÇÕES AUXILIARES DE INTERFACE (AJUSTE PARA O SEU HTML)
// ======================================================

function exibirMensagemAlerta(texto) {
    const caixaAlerta = document.getElementById('caixa-alerta-erro');
    if (caixaAlerta) {
        caixaAlerta.textContent = `⚠️ ${texto}`;
        caixaAlerta.style.display = 'block';
    }
}

function esconderMensagemAlerta() {
    const caixaAlerta = document.getElementById('caixa-alerta-erro');
    if (caixaAlerta) {
        caixaAlerta.style.display = 'none';
    }
}

function criarElementoHTMLQuestao(dados) {
    const div = document.createElement('div');
    div.classList.add('questao-item');
    div.innerHTML = `
        <div class="questao-header">
            <strong>QUESTÃO ${dados.numero}</strong>
            <span class="descriptor">${dados.descritor || ''}</span>
        </div>
        <p class="questao-texto">${dados.texto}</p>
        <ul class="questao-alternativas">
            <li><b>A)</b> ${dados.altA}</li>
            <li><b>B)</b> ${dados.altB}</li>
            <li><b>C)</b> ${dados.altC}</li>
            <li><b>D)</b> ${dados.altD}</li>
        </ul>
    `;
    return div;
}
