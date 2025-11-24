let cardContainer = document.querySelector(".card-container");
let dados = [];

// Seletores para os elementos de busca
let campoBusca = document.querySelector("#campoBusca");
let botaoBusca = document.querySelector("#botao-busca");

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa o container antes de renderizar
    let delay = 0;
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.style.animationDelay = `${delay}s`; // Adiciona delay para animação escalonada
        article.innerHTML = `
        <img src="${dado.imagem}" alt="Logo da linguagem ${dado.nome}" class="card-image">
        <h2>${dado.nome}</h2>
        <p><strong>Tipo:</strong> ${dado.tipo}</p>
        <p>${dado.descrição}</p>
        <p><strong>Ano de criação:</strong> ${dado.ano}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
        delay += 0.1; // Incrementa o delay para o próximo card
    }
}

function buscar() {
    const termoBusca = campoBusca.value.toLowerCase();

    // Se o campo de busca estiver vazio, limpa os resultados
    if (termoBusca.trim() === "") {
        renderizarCards([]);
        return;
    }

    // Filtra os dados com base no nome ou descrição
    const dadosFiltrados = dados.filter(dado => {
        return dado.nome.toLowerCase().includes(termoBusca) ||
               dado.descrição.toLowerCase().includes(termoBusca);
    });

    // Renderiza os cards com os dados filtrados
    renderizarCards(dadosFiltrados);
}

function animarPlaceholder() {
    const textos = [
        "Digite um comando...",
        "Procurando na base de dados...",
        "Qual tecnologia você busca?",
        "Ex: python, javascript, c++"
    ];
    let i = 0;
    let j = 0;
    let textoAtual = "";
    let isApagando = false;

    function type() {
        textoAtual = textos[i];
        if (isApagando) {
            campoBusca.placeholder = textoAtual.substring(0, j--);
            if (j < 0) { isApagando = false; i = (i + 1) % textos.length; }
        } else {
            campoBusca.placeholder = textoAtual.substring(0, j++);
            if (j > textoAtual.length) { isApagando = true; }
        }
        setTimeout(type, isApagando ? 50 : 120);
    }
    type();
}

async function iniciarBusca() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();

    // Adiciona o evento de 'click' para o botão de busca
    botaoBusca.addEventListener("click", buscar);

    // Adiciona o evento de 'keyup' para buscar com a tecla "Enter"
    campoBusca.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            buscar();
        }
    });

    animarPlaceholder(); // Inicia a animação do placeholder
}

iniciarBusca();