```javascript
// ======================================================
// COLA AQUI — SISTEMA DE SALAS E FÓRUM
// Protótipo local com localStorage
// ======================================================

"use strict";

// ======================================================
// 1. CONFIGURAÇÕES
// ======================================================

const CHAVE_DADOS = "cola_aqui_salas_v1";

const materiasDisponiveis = [
    "Matemática",
    "Português",
    "Física",
    "Química",
    "História",
    "Biologia",
    "Geografia"
];

let perguntas = carregarPerguntas();
let materiaSelecionada = null;


// ======================================================
// 2. ELEMENTOS DO HTML
// ======================================================

const listaPerguntas = document.getElementById("lista-perguntas");
const mensagemVazia = document.getElementById("mensagem-vazia");
const formulario = document.getElementById("form-pergunta");

const campoNome = document.getElementById("nome-aluno");
const campoMateria = document.getElementById("materia-pergunta");
const campoTitulo = document.getElementById("titulo-pergunta");
const campoTexto = document.getElementById("texto-pergunta");

const campoBusca = document.getElementById("buscar-pergunta");
const campoOrdem = document.getElementById("filtro-ordem");

const tituloForum = document.getElementById("titulo-forum");
const botaoTodas = document.getElementById("btn-todas");
const botaoAbrirForm = document.getElementById("btn-abrir-form");
const botaoFecharForm = document.getElementById("btn-fechar-form");


// ======================================================
// 3. INICIALIZAÇÃO
// ======================================================

function iniciarForum() {
    const elementosObrigatorios = [
        listaPerguntas,
        mensagemVazia,
        formulario,
        campoNome,
        campoMateria,
        campoTitulo,
        campoTexto,
        campoBusca,
        campoOrdem,
        tituloForum,
        botaoTodas,
        botaoAbrirForm,
        botaoFecharForm
    ];

    if (elementosObrigatorios.some(function (elemento) {
        return !elemento;
    })) {
        console.error(
            "COLA AQUI: faltam elementos necessários no salas.html."
        );

        return;
    }

    // Salas de cada matéria.
    document.querySelectorAll(".room-card").forEach(
        function (botao) {
            botao.addEventListener("click", function () {
                selecionarSala(botao.dataset.materia);
            });
        }
    );

    // Mostrar todas as matérias.
    botaoTodas.addEventListener("click", function () {
        selecionarSala(null);
    });

    // Formulário de nova pergunta.
    botaoAbrirForm.addEventListener("click", abrirFormulario);
    botaoFecharForm.addEventListener("click", fecharFormulario);
    formulario.addEventListener("submit", publicarPergunta);

    // Pesquisa e ordenação.
    campoBusca.addEventListener("input", renderizarPerguntas);
    campoOrdem.addEventListener("change", renderizarPerguntas);

    // Eventos dos cards e das respostas.
    listaPerguntas.addEventListener("click", tratarCliquePergunta);
    listaPerguntas.addEventListener("submit", publicarResposta);

    atualizarContadores();
    renderizarPerguntas();

    console.log("COLA AQUI: fórum inicializado com sucesso!");
}


// ======================================================
// 4. SEGURANÇA — ESCAPAR TEXTO HTML
// ======================================================

function escaparHTML(valor) {
    const entidades = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(valor).replace(/[&<>"']/g, function (caractere) {
        return entidades[caractere];
    });
}


// ======================================================
// 5. IDENTIFICADOR ÚNICO
// ======================================================

function criarId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString() +
        "-" +
        Math.random().toString(36).slice(2);
}


// ======================================================
// 6. CARREGAR PERGUNTAS
// ======================================================

function carregarPerguntas() {
    try {
        const dados = localStorage.getItem(CHAVE_DADOS);

        if (!dados) {
            return [];
        }

        const resultado = JSON.parse(dados);

        if (!Array.isArray(resultado)) {
            return [];
        }

        return resultado.filter(function (pergunta) {
            return (
                pergunta &&
                typeof pergunta.id === "string" &&
                typeof pergunta.nome === "string" &&
                typeof pergunta.titulo === "string" &&
                typeof pergunta.texto === "string" &&
                materiasDisponiveis.includes(pergunta.materia)
            );
        }).map(function (pergunta) {
            const respostas = Array.isArray(pergunta.respostas)
                ? pergunta.respostas
                : [];

            return {
                id: pergunta.id,
                nome: pergunta.nome,
                materia: pergunta.materia,
                titulo: pergunta.titulo,
                texto: pergunta.texto,
                data: pergunta.data || new Date().toISOString(),

                respostas: respostas.filter(function (resposta) {
                    return (
                        resposta &&
                        typeof resposta.nome === "string" &&
                        typeof resposta.texto === "string"
                    );
                }).map(function (resposta) {
                    return {
                        id: String(resposta.id || criarId()),
                        nome: resposta.nome,
                        texto: resposta.texto,
                        data: resposta.data || new Date().toISOString()
                    };
                })
            };
        });

    } catch (erro) {
        console.error("Erro ao carregar perguntas:", erro);
        return [];
    }
}


// ======================================================
// 7. SALVAR PERGUNTAS
// ======================================================

function salvarPerguntas() {
    try {
        localStorage.setItem(
            CHAVE_DADOS,
            JSON.stringify(perguntas)
        );

        return true;

    } catch (erro) {
        console.error("Erro ao salvar perguntas:", erro);

        alert(
            "Não foi possível salvar os dados neste navegador. " +
            "Verifique se o armazenamento está disponível."
        );

        return false;
    }
}


// ======================================================
// 8. DATA E CONTADORES
// ======================================================

function formatarData(data) {
    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "Data indisponível";
    }

    return dataObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function atualizarContadores() {
    const totalPerguntas = document.getElementById("total-perguntas");
    const totalRespostas = document.getElementById("total-respostas");

    if (totalPerguntas) {
        totalPerguntas.textContent = perguntas.length;
    }

    if (totalRespostas) {
        totalRespostas.textContent = perguntas.reduce(
            function (total, pergunta) {
                return total + pergunta.respostas.length;
            },
            0
        );
    }

    document.querySelectorAll("[data-count]").forEach(
        function (elemento) {
            const materia = elemento.dataset.count;

            const quantidade = perguntas.filter(
                function (pergunta) {
                    return pergunta.materia === materia;
                }
            ).length;

            elemento.textContent =
                quantidade +
                (quantidade === 1 ? " pergunta" : " perguntas");
        }
    );
}


// ======================================================
// 9. SELECIONAR UMA SALA
// ======================================================

function selecionarSala(materia) {
    materiaSelecionada = materiasDisponiveis.includes(materia)
        ? materia
        : null;

    document.querySelectorAll(".room-card").forEach(
        function (botao) {
            botao.classList.toggle(
                "active",
                botao.dataset.materia === materiaSelecionada
            );
        }
    );

    botaoTodas.classList.toggle(
        "active",
        materiaSelecionada === null
    );

    tituloForum.textContent = materiaSelecionada
        ? "🗨️ Dúvidas de " + materiaSelecionada
        : "🗨️ Todas as dúvidas";

    if (materiaSelecionada) {
        campoMateria.value = materiaSelecionada;
    }

    renderizarPerguntas();

    const forum = document.getElementById("forum");

    if (forum) {
        forum.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ======================================================
// 10. ABRIR E FECHAR FORMULÁRIO
// ======================================================

function abrirFormulario() {
    formulario.classList.remove("hidden");

    if (materiaSelecionada) {
        campoMateria.value = materiaSelecionada;
    }

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    campoNome.focus();
}


function fecharFormulario() {
    formulario.classList.add("hidden");
}


// ======================================================
// 11. PUBLICAR UMA PERGUNTA
// ======================================================

function publicarPergunta(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const materia = campoMateria.value;
    const titulo = campoTitulo.value.trim();
    const texto = campoTexto.value.trim();

    if (!nome || !titulo || !texto) {
        alert("Preencha seu nome, o título e sua dúvida.");
        return;
    }

    if (!materiasDisponiveis.includes(materia)) {
        alert("Selecione uma matéria válida.");
        return;
    }

    if (titulo.length < 5) {
        alert("O título precisa ter pelo menos 5 caracteres.");
        return;
    }

    if (texto.length < 10) {
        alert("Explique sua dúvida com pelo menos 10 caracteres.");
        return;
    }

    const novaPergunta = {
        id: criarId(),
        nome: nome,
        materia: materia,
        titulo: titulo,
        texto: texto,
        data: new Date().toISOString(),
        respostas: []
    };

    perguntas.unshift(novaPergunta);

    if (!salvarPerguntas()) {
        perguntas.shift();
        return;
    }

    formulario.reset();
    fecharFormulario();

    materiaSelecionada = materia;

    atualizarContadores();
    selecionarSala(materia);

    alert("Pergunta publicada com sucesso! 🚀");
}


// ======================================================
// 12. RENDERIZAR A LISTA DE PERGUNTAS
// ======================================================

function renderizarPerguntas() {
    if (!listaPerguntas || !mensagemVazia) {
        return;
    }

    const busca = campoBusca.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const ordem = campoOrdem.value;

    let filtradas = perguntas.filter(function (pergunta) {
        const correspondeMateria =
            materiaSelecionada === null ||
            pergunta.materia === materiaSelecionada;

        const conteudo = [
            pergunta.titulo,
            pergunta.texto,
            pergunta.nome,
            pergunta.materia
        ].concat(
            pergunta.respostas.map(function (resposta) {
                return resposta.nome + " " + resposta.texto;
            })
        ).join(" ").toLocaleLowerCase("pt-BR");

        return correspondeMateria && conteudo.includes(busca);
    });

    if (ordem === "respostas") {
        filtradas.sort(function (a, b) {
            return b.respostas.length - a.respostas.length;
        });
    } else {
        filtradas.sort(function (a, b) {
            return new Date(b.data).getTime() -
                new Date(a.data).getTime();
        });
    }

    listaPerguntas.innerHTML = "";

    mensagemVazia.classList.toggle(
        "hidden",
        filtradas.length > 0
    );

    filtradas.forEach(function (pergunta) {
        listaPerguntas.insertAdjacentHTML(
            "beforeend",
            criarHTMLPergunta(pergunta)
        );
    });
}


// ======================================================
// 14. ABRIR E FECHAR FORMULÁRIO DE RESPOSTA
// ======================================================

function tratarCliquePergunta(evento) {
    const alvo = evento.target;

    if (!(alvo instanceof Element)) {
        return;
    }

    const botao = alvo.closest('[data-action="responder"]');

    if (!botao) {
        return;
    }

    const cartao = botao.closest(".question-card");

    if (!cartao) {
        return;
    }

    const formularioResposta = cartao.querySelector(".reply-form");

    if (!formularioResposta) {
        return;
    }

    formularioResposta.classList.toggle("hidden");

    if (!formularioResposta.classList.contains("hidden")) {
        const campoNomeResposta = formularioResposta.querySelector(
            '[name="nome-resposta"]'
        );

        if (campoNomeResposta) {
            campoNomeResposta.focus();
        }
    }
}


// ======================================================
// 15. PUBLICAR UMA RESPOSTA
// ======================================================

function publicarResposta(evento) {
    const formResposta = evento.target;

    if (
        !(formResposta instanceof HTMLFormElement) ||
        !formResposta.classList.contains("reply-form")
    ) {
        return;
    }

    evento.preventDefault();

    const id = formResposta.dataset.id;

    const pergunta = perguntas.find(function (item) {
        return item.id === id;
    });

    if (!pergunta) {
        alert("Não foi possível encontrar essa pergunta.");
        return;
    }

    const campoNomeResposta = formResposta.querySelector(
        '[name="nome-resposta"]'
    );

    const campoTextoResposta = formResposta.querySelector(
        '[name="texto-resposta"]'
    );

    if (!campoNomeResposta || !campoTextoResposta) {
        console.error("Os campos de resposta não foram encontrados.");
        return;
    }

    const nome = campoNomeResposta.value.trim();
    const texto = campoTextoResposta.value.trim();

    if (!nome || !texto) {
        alert("Preencha seu nome e sua resposta.");
        return;
    }

    if (texto.length < 3) {
        alert("Escreva uma resposta um pouco maior.");
        return;
    }

    const novaResposta = {
        id: criarId(),
        nome: nome,
        texto: texto,
        data: new Date().toISOString()
    };

    pergunta.respostas.push(novaResposta);

    if (!salvarPerguntas()) {
        pergunta.respostas.pop();
        return;
    }

    atualizarContadores();
    renderizarPerguntas();

    alert("Resposta publicada! 💚");
}


// ======================================================
// 16. ATUALIZAR TUDO
// ======================================================

function renderizarTudo() {
    atualizarContadores();
    renderizarPerguntas();
}


// ======================================================
// 17. INICIAR QUANDO O HTML ESTIVER PRONTO
// ======================================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarForum);
} else {
    iniciarForum();
}
```