
/* =========================================================
   COLA AQUI — CENTRAL DE AULAS
   ========================================================= */


/* =========================================================
   DADOS DAS MATÉRIAS
   ========================================================= */

const materias = {

    matematica: {
        nome: "Matemática",
        icone: "📐",
        descricao: "Equações, funções, geometria e cálculos.",
        assuntos: [
            "Frações",
            "Equações",
            "Bhaskara",
            "Funções",
            "Geometria"
        ]
    },

    portugues: {
        nome: "Português",
        icone: "📖",
        descricao: "Gramática, interpretação e literatura.",
        assuntos: [
            "Interpretação de texto",
            "Metáfora",
            "Figuras de linguagem",
            "Gramática",
            "Redação"
        ]
    },

    fisica: {
        nome: "Física",
        icone: "⚡",
        descricao: "Movimento, força, energia e eletricidade.",
        assuntos: [
            "Velocidade",
            "Aceleração",
            "Leis de Newton",
            "Energia",
            "Eletricidade"
        ]
    },

    quimica: {
        nome: "Química",
        icone: "🧪",
        descricao: "Átomos, moléculas e reações.",
        assuntos: [
            "Átomos",
            "Tabela periódica",
            "Ligações químicas",
            "Reações químicas",
            "Balanceamento"
        ]
    },

    historia: {
        nome: "História",
        icone: "🏛️",
        descricao: "Brasil, revoluções e civilizações.",
        assuntos: [
            "Brasil Colônia",
            "Independência do Brasil",
            "Revolução Pernambucana",
            "Revolução Francesa",
            "Primeira Guerra Mundial"
        ]
    },

    biologia: {
        nome: "Biologia",
        icone: "🧬",
        descricao: "Células, genética, corpo humano e ecologia.",
        assuntos: [
            "Células",
            "Genética",
            "DNA",
            "Corpo humano",
            "Ecologia"
        ]
    },

    geografia: {
        nome: "Geografia",
        icone: "🌎",
        descricao: "Mapas, clima, população e espaço geográfico.",
        assuntos: [
            "Clima",
            "Relevo",
            "Globalização",
            "População",
            "Geopolítica"
        ]
    }

};


/* =========================================================
   IDS DOS VÍDEOS DO YOUTUBE
   ========================================================= */

const videos = {

    matematica: {
        "Frações": "1TSKqEMQnHw",
        "Equações": "vSvJSKIfOxQ",
        "Bhaskara": "flKxH3hFgW8",
        "Funções": "SPZqQ5qn3P0",
        "Geometria": "0CnUdzmpO8E"
    },

    portugues: {
        "Interpretação de texto": "45thlAoGOGU",
        "Metáfora": "udARDE3oytE",
        "Figuras de linguagem": "n0e75nRstcU",
        "Gramática": "7zOs8zd0KwI",
        "Redação": "L1Mzq42EGr4"
    },

    fisica: {
        "Velocidade": "SmuEHluzJ2c",
        "Aceleração": "EpababY-q0w",
        "Leis de Newton": "wJwDTUL6fz0",
        "Energia": "9vriJYiTmbg",
        "Eletricidade": "A0cXF4ccKFM"
    },

    quimica: {
        "Átomos": "",
        "Tabela periódica": "t9lRu46zdEU",
        "Ligações químicas": "iQMF2jbJ6Uo",
        "Reações químicas": "YbE9nRP9IGs",
        "Balanceamento": "qjjpmI2MTfA"
    },

    historia: {
        "Brasil Colônia": "wS_8ISOoaEo",
        "Independência do Brasil": "pvxzaEBLHI4",
        "Revolução Pernambucana": "XzBKReTAVkE",
        "Revolução Francesa": "ceCcZooYDBo",
        "Primeira Guerra Mundial": "Xi8Vj7aDcvg"
    },

    biologia: {
        "Células": "4FsLnuELY_E",
        "Genética": "tUtj4HIg4Wo",
        "DNA": "7nSXYueAPBc",
        "Corpo humano": "EeZrwIT_rfQ",
        "Ecologia": "RJtA2vSaM2g"
    },

    geografia: {
        "Clima": "Q9MwU4kUOCs",
        "Relevo": "5EMjhIzOqvE",
        "Globalização": "bMVwTdQ7IrQ",
        "População": "sCsfBCsilUk",
        "Geopolítica": "gJPtzz2zqBs"
    }

};


/* =========================================================
   ESTADO ATUAL
   ========================================================= */

let materiaAtual = "matematica";
let assuntoAtual = "";


/* =========================================================
   SELECIONAR MATÉRIA
   ========================================================= */

function selecionarAulaMateria(materia, botaoClicado) {

    if (!materias[materia]) return;

    materiaAtual = materia;

    const dados = materias[materia];

    document
        .querySelectorAll(".aula-materia-card")
        .forEach(card => {
            card.classList.remove("ativa");
        });

    // Aceita o botão passado diretamente ou o evento tradicional.
    const botao = botaoClicado ||
        (typeof event !== "undefined" ? event.currentTarget : null);

    if (botao && botao.classList) {
        botao.classList.add("ativa");
    }

    document.getElementById("titulo-materia").textContent =
        dados.icone + " " + dados.nome;

    document.getElementById("descricao-materia").textContent =
        dados.descricao;

    const assuntos = document.getElementById("assuntos");
    assuntos.innerHTML = "";

    dados.assuntos.forEach(assunto => {

        const botaoAssunto = document.createElement("button");

        botaoAssunto.type = "button";
        botaoAssunto.textContent = assunto;

        botaoAssunto.addEventListener("click", () => {
            abrirAula(assunto);
        });

        assuntos.appendChild(botaoAssunto);

    });

    document.getElementById("player-area").innerHTML = `
        <div class="player-placeholder">
            <span>${dados.icone}</span>
            <h3>Escolha um assunto</h3>
            <p>Selecione um assunto de ${dados.nome}.</p>
        </div>
    `;

    document.getElementById("entendeu-card").style.display = "none";
    document.getElementById("pergunta-final").style.display = "none";

    document.getElementById("conteudo-aulas").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   ABRIR AULA PELO IFRAME DO YOUTUBE
   ========================================================= */

function abrirAula(assunto) {

    assuntoAtual = assunto;

    const player = document.getElementById("player-area");
    const videoId = videos[materiaAtual]?.[assunto];

    // Sem ID cadastrado: mostra aviso de aula em preparação.
    if (!videoId || !videoId.trim()) {

        player.innerHTML = `
            <div class="player-placeholder">
                <span>🎥</span>
                <h3>Aula em preparação</h3>
                <p>
                    Ainda estamos adicionando uma aula
                    para <strong>${assunto}</strong>.
                </p>
            </div>
        `;

        document.getElementById("entendeu-card").style.display = "none";
        document.getElementById("pergunta-final").style.display = "none";

        return;
    }

    const idSeguro = encodeURIComponent(videoId.trim());
    const materia = materias[materiaAtual];

    player.innerHTML = `
        <div class="video-real">

            <div class="youtube-player">
                <iframe
                    src="https://www.youtube.com/embed/${idSeguro}?rel=0"
                    title="Aula de ${assunto} - ${materia.nome}"
                    loading="lazy"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            </div>

            <div class="video-fallback"
                 style="margin-top:12px;text-align:center;">

                <p>
                    Se o vídeo não carregar dentro da página,
                    você pode abri-lo diretamente no YouTube.
                </p>

                <a
                    href="https://www.youtube.com/watch?v=${idSeguro}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-youtube"
                    style="display:inline-block;padding:10px 16px;border-radius:8px;background:#FF5A1F;color:#fff;text-decoration:none;font-weight:700;">
                    ▶ Abrir aula no YouTube
                </a>

            </div>

            <div class="video-info-large">

                <span class="mono">
                    ${materia.icone}
                    ${materia.nome.toUpperCase()}
                </span>

                <h2>${assunto}</h2>

                <p>
                    Assista à explicação com calma.
                    Quando terminar, diga se a aula
                    resolveu sua dúvida.
                </p>

            </div>

        </div>
    `;

    document.getElementById("entendeu-card").style.display = "flex";
    document.getElementById("pergunta-final").style.display = "none";

    player.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   ENTENDI A AULA
   ========================================================= */

function entendeuAula() {

    const card = document.getElementById("entendeu-card");

    card.innerHTML = `
        <div>
            <span class="mono" style="color:#2CFF62;">
                ✓ AULA CONCLUÍDA
            </span>

            <h3>Boa! Você entendeu. 🎉</h3>

            <p>
                A dúvida sobre
                <strong>${assuntoAtual}</strong>
                foi resolvida.
            </p>
        </div>
    `;

}


/* =========================================================
   NÃO ENTENDI A AULA
   ========================================================= */

function naoEntendeu() {

    const pergunta = document.getElementById("pergunta-final");

    pergunta.style.display = "block";

    pergunta.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}