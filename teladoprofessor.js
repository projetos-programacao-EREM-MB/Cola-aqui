function aprovarResposta(id, nome, ptsTexto) {
    const card = document.getElementById(id);
    if (!card || card.dataset.validado === "sim") return;

    const pontosGanhos = parseInt(ptsTexto, 10) || 15;
    const ranking = JSON.parse(localStorage.getItem("ranking") || "{}");

    ranking[nome] = (Number(ranking[nome]) || 0) + pontosGanhos;

    localStorage.setItem("ranking", JSON.stringify(ranking));
    localStorage.setItem(
        "ultimo_aprovado",
        `${nome} ganhou +${pontosGanhos} pontos`
    );

    card.dataset.validado = "sim";
    card.innerHTML = `
        <div style="padding:20px;text-align:center;color:#2CFF62;font-family:monospace">
            ✅ ${nome} recebeu +${pontosGanhos} PTS!
        </div>
    `;

    const pendentes = document.getElementById("count-pendentes");
    if (pendentes) {
        pendentes.innerText = Math.max(
            0,
            (parseInt(pendentes.innerText, 10) || 0) - 1
        );
    }

    const validadas = document.getElementById("count-validadas");
    if (validadas) {
        validadas.innerText =
            (parseInt(validadas.innerText, 10) || 0) + 1;
    }

    alert(`✅ ${nome} ganhou ${pontosGanhos} pontos!`);
}

function rejeitarResposta(id) {
    const card = document.getElementById(id);
    if (!card) return;

    const motivo = prompt("Motivo da revisão?");
    if (!motivo || !motivo.trim()) return;

    card.textContent = "📝 Enviado para revisão: " + motivo.trim();
    card.style.color = "#FF3B30";
}

function enviarAviso() {
    const tituloEl = document.getElementById("aviso-titulo");
    const textoEl = document.getElementById("aviso-texto");

    if (!tituloEl || !textoEl) {
        alert("Não encontrei os campos do aviso.");
        return;
    }

    const titulo = tituloEl.value.trim();
    const texto = textoEl.value.trim();

    if (titulo.length < 3 || texto.length < 5) {
        alert("Preencha o título e o texto do aviso!");
        return;
    }

    const aviso = {
        id: String(Date.now()),
        titulo: titulo,
        texto: texto,
        criadoEm: new Date().toISOString()
    };

    localStorage.setItem("aviso_turma", JSON.stringify(aviso));
    localStorage.setItem("ultimo_aprovado", "AVISO: " + titulo);

    tituloEl.value = "";
    textoEl.value = "";

    alert("✅ Aviso enviado para a turma!");
}

function pegarIdYoutube(url) {
    let id = "";

    if (url.includes("v=")) {
        id = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("embed/")) {
        id = url.split("embed/")[1].split("?")[0];
    } else {
        id = url;
    }

    return id.trim();
}

function adicionarVideo() {
    const tituloEl = document.getElementById("tituloVideo");
    const materiaEl = document.getElementById("materiaVideo");
    const linkEl = document.getElementById("linkVideo");

    if (!tituloEl || !materiaEl || !linkEl) {
        alert("Não encontrei os campos do formulário de vídeo.");
        return;
    }

    const titulo = tituloEl.value.trim();
    const materia = materiaEl.value;
    const link = linkEl.value.trim();

    if (!titulo || !link) {
        alert("Preencha o título e o link!");
        return;
    }

    const id = pegarIdYoutube(link);

    if (!id) {
        alert("Confira o link do vídeo.");
        return;
    }

    const videos = JSON.parse(
        localStorage.getItem("videos_professor") || "[]"
    );

    videos.unshift({
        titulo: titulo,
        materia: materia,
        id: id,
        prof: "@prof.voce"
    });

    localStorage.setItem("videos_professor", JSON.stringify(videos));

    alert("✅ Vídeo publicado!");

    tituloEl.value = "";
    linkEl.value = "";
}