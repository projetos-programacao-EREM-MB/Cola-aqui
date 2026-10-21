// ======================================================
// COLA AQUI — SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// INICIALIZAÇÃO
// ======================================================


window.addEventListener("load", function () {
    const avisoBruto = localStorage.getItem("aviso_turma");

    if (avisoBruto) {
        let aviso;
        let idAviso;
        let mensagem;

        try {
            aviso = JSON.parse(avisoBruto);
        } catch {
            aviso = null;
        }

        if (aviso && typeof aviso === "object" && aviso.id) {
            idAviso = String(aviso.id);
            mensagem = `📢 ${aviso.titulo}\n\n${aviso.texto}`;
        } else {
            // Compatibilidade com avisos antigos em texto.
            idAviso = avisoBruto;
            mensagem = "📢 AVISO DO PROFESSOR:\n\n" + avisoBruto;
        }

        const ultimoVisto = localStorage.getItem("aviso_turma_visto_id");

        if (idAviso !== ultimoVisto) {
            // Marca como visto antes de exibir.
            localStorage.setItem("aviso_turma_visto_id", idAviso);
            alert(mensagem);
        }
    }

    atualizarPontos();
});


// ======================================================
// SISTEMA DE PONTOS
// ======================================================

let pontos = parseInt(
    localStorage.getItem("pontos_totais") || "0"
);

let perguntasRespondidas = new Set();

let ultimaResposta = "";
let ultimoTempo = 0;


// ======================================================
// FUNÇÕES DE PONTOS
// ======================================================

function obterPontos() {

    return parseInt(
        localStorage.getItem("pontos_totais") || "0"
    );

}


function salvarPontos(valor) {

    pontos = valor;

    localStorage.setItem(
        "pontos_totais",
        pontos
    );

    atualizarPontos();

}


function adicionarPontos(valor) {

    const totalAtual = obterPontos();

    const novoTotal = totalAtual + valor;

    salvarPontos(novoTotal);

    console.log(
        `⭐ +${valor} pontos | Total: ${novoTotal}`
    );

}


function atualizarPontos() {

    const elemento = document.getElementById(
        "meus-pontos"
    );

    if (!elemento) return;

    elemento.innerText = obterPontos();

}


// Atualiza o contador periodicamente
setInterval(atualizarPontos, 1000);


// ======================================================
// PALAVRAS-CHAVE
// ======================================================

const palavrasChave = {

    "metáfora": [
        "metáfora",
        "comparação",
        "sentido figurado",
        "figura de linguagem"
    ],

    "fração": [
        "fração",
        "inverter",
        "multiplicar",
        "numerador",
        "denominador"
    ],

    "bhaskara": [
        "bhaskara",
        "delta",
        "fórmula",
        "formula",
        "equação"
    ],

    "revolução pernambucana": [
        "pernambucana",
        "1817",
        "independência",
        "recife"
    ],

    "default": []

};


// ======================================================
// VERIFICA SE A RESPOSTA TEM RELAÇÃO COM A PERGUNTA
// ======================================================

function temContexto(pergunta, resposta) {

    pergunta = pergunta.toLowerCase();
    resposta = resposta.toLowerCase();

    let chaves = [];

    for (let tema in palavrasChave) {

        if (tema === "default") continue;

        if (pergunta.includes(tema)) {

            chaves = palavrasChave[tema];

            break;
        }
    }

    // Se não encontrou um tema específico,
    // permite a resposta.
    if (chaves.length === 0) {
        return true;
    }

    return chaves.some(function (palavra) {

        return resposta.includes(palavra);

    });

}


// ======================================================
// TELA DO ALUNO — POSTAR DÚVIDA
// ======================================================

function postar() {

    const tituloEl =
        document.getElementById("titulo");

    const descEl =
        document.getElementById("desc");

    const materiaEl =
        document.getElementById("materia");

    const feed =
        document.getElementById("feed");


    // Evita erro caso a função seja executada
    // em uma página que não possui esses elementos.
    if (!tituloEl || !descEl || !materiaEl || !feed) {
        console.warn(
            "⚠️ Elementos da postagem não encontrados."
        );

        return;
    }


    const titulo =
        tituloEl.value.trim();

    const desc =
        descEl.value.trim();

    const materia =
        materiaEl.value;


    // Validação
    if (
        titulo.length < 5 ||
        desc.length < 10
    ) {

        alert(
            "❌ Explica melhor tua dúvida!"
        );

        return;
    }


    const id = Date.now();


    // Cria o card da nova dúvida
    const novaDuvida = document.createElement("div");

    novaDuvida.className = "duvida urgente";

    novaDuvida.dataset.id = id;

    novaDuvida.dataset.pergunta =
        titulo.toLowerCase();


    novaDuvida.innerHTML = `

        <span class="tag mono">
            ${materia} • agora • Você
        </span>

        <br>

        <b>${titulo}</b>

        <p style="
            color:#8B90A0;
            font-size:12px;
            margin-top:6px;
        ">
            ${desc}
        </p>

    `;


    // Coloca a dúvida no começo do feed
    feed.prepend(novaDuvida);


    // Limpa formulário
    tituloEl.value = "";

    descEl.value = "";


    console.log(
        "📚 Nova dúvida publicada:",
        titulo
    );

}


// ======================================================
// TELA DO ALUNO — RESPONDER
// ======================================================

function explicar(
    botao,
    id,
    textoPergunta
) {

    // Verifica se já respondeu
    if (perguntasRespondidas.has(id)) {

        alert(
            "❌ Tu já respondeu essa!"
        );

        return;
    }


    const resposta = prompt(
        `Responda: "${textoPergunta}"\n\n` +
        `Mínimo 20 letras e tem que ter ` +
        `a ver com o assunto:`
    );


    // Cancelou
    if (!resposta) {
        return;
    }


    const respostaLimpa =
        resposta.trim();


    // Verifica tamanho
    if (respostaLimpa.length < 20) {

        alert(
            "❌ Muito curto! Escreve uma explicação maior."
        );

        return;
    }


    // Verifica contexto
    if (
        !temContexto(
            textoPergunta,
            respostaLimpa
        )
    ) {

        alert(
            `❌ A resposta parece não ter relação ` +
            `com "${textoPergunta}"!`
        );

        return;
    }


    // Marca pergunta como respondida
    perguntasRespondidas.add(id);


    // ==================================================
    // GANHA 10 PONTOS
    // ==================================================

    adicionarPontos(10);


    // ==================================================
    // MOSTRA RESPOSTA NO CARD
    // ==================================================

    if (botao) {

        const respostaDiv =
            document.createElement("div");

        respostaDiv.style.cssText = `
            margin-top:10px;
            padding:10px;
            background:#0F1116;
            border:1px dashed #2CFF62;
            border-radius:4px;
        `;


        respostaDiv.innerHTML = `

            <p style="
                font-size:12px;
                margin:0;
            ">

                <b style="color:#2CFF62">
                    Sua resposta:
                </b>

                ${respostaLimpa}

            </p>

        `;


        // Coloca a resposta depois do botão
        botao.parentElement.appendChild(
            respostaDiv
        );


        // Esconde botão
        botao.style.display = "none";

    }


    alert(
        "✅ Boa! +10 pts"
    );

}


// ======================================================
// TELA DO PROFESSOR — ENVIAR AVISO
// ======================================================




// ======================================================
// PROFESSOR — APROVAR RESPOSTA
// ======================================================




// ======================================================
// PROFESSOR — REJEITAR RESPOSTA
// ======================================================

function rejeitarResposta(id) {

    const motivo =
        prompt(
            "Qual o motivo da revisão?\n\n" +
            "Ex: Explicação incompleta, " +
            "erro no conceito..."
        );


    if (!motivo) {
        return;
    }


    const motivoLimpo =
        motivo.trim();


    if (motivoLimpo.length < 3) {

        alert(
            "❌ Escreve um motivo para a revisão."
        );

        return;
    }


    const card =
        document.getElementById(id);


    if (!card) {

        console.warn(
            "⚠️ Card não encontrado:",
            id
        );

        return;
    }


    card.style.borderLeft =
        "3px solid #FF3B30";


    card.innerHTML = `

        <div style="
            padding:20px;
            text-align:center;
            color:#FF3B30;
        "
        class="mono">

            📝 ENVIADO PARA REVISÃO

            <p style="
                color:#F5F5F5;
                font-family:Arial,sans-serif;
                font-size:12px;
                margin-top:8px;
            ">

                Motivo: ${motivoLimpo}

            </p>

        </div>

    `;


    // Salva último motivo
    localStorage.setItem(
        "ultima_revisao",
        motivoLimpo
    );

}


// ======================================================
// DEBUG
// ======================================================

console.log(
    "🚀 COLA AQUI carregado!"
);

console.log(
    "⭐ Pontos atuais:",
    obterPontos()
);
```javascript
// ======================================================
// COLA AQUI — ABRIR AS SALAS DE AJUDA
// ======================================================
```

javascript
function buscarAjuda() {
    const campoBusca = document.getElementById("busca");

    if (!campoBusca) {
        alert("Campo de busca não encontrado.");
        return;
    }

    const duvida = campoBusca.value.trim();

    if (!duvida) {
        alert("Digite sua dúvida primeiro!");
        campoBusca.focus();
        return;
    }

    const destino = new URL("salas.html", window.location.href);

    destino.searchParams.set("duvida", duvida);

    window.location.href = destino.href;
}
``
