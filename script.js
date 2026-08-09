let todosProdutos = [];
let categoriaAtual = "todos";
const fotosAtuais = {};

// Carrega os produtos do JSON assim que a página abre
fetch("produtos.json")
  .then(response => response.json())
  .then(produtos => {
    todosProdutos = produtos;
    renderizarProdutos(todosProdutos);
  })
  .catch(error => {
    console.error("Erro ao carregar produtos:", error);
  });

// Desenha os cards de produto na tela
function renderizarProdutos(produtos) {
  const container = document.getElementById("produtos");
  const semResultados = document.getElementById("sem-resultados");

  container.innerHTML = "";

  if (produtos.length === 0) {
    semResultados.style.display = "block";
    return;
  }

  semResultados.style.display = "none";

  produtos.forEach((produto) => {
    // Usamos o índice dentro da lista completa para manter o carrossel de fotos funcionando certo
    const index = todosProdutos.indexOf(produto);
    const fotos = produto.fotos || [produto.imagem];

    const card = document.createElement("div");
    card.className = "produto";
    card.innerHTML = `
      <div class="foto-container">
        <img
          id="foto-${index}"
          src="${fotos[0]}"
          alt="${produto.nome}"
        >
        ${
          fotos.length > 1
            ? `
              <button class="foto-anterior" onclick="mudarFoto(${index}, -1)">‹</button>
              <button class="foto-proxima" onclick="mudarFoto(${index}, 1)">›</button>
            `
            : ""
        }
      </div>
      <h2>${produto.nome}</h2>
      <p class="preco-antigo">${produto.de}</p>
      <p class="preco-atual">${produto.por}</p>
      <a
        href="${produto.link}"
        target="_blank"
        rel="noopener noreferrer"
        class="botao-comprar"
      >
        COMPRAR AGORA
      </a>
    `;
    container.appendChild(card);
  });
}

// Troca a foto exibida no carrossel do card
function mudarFoto(produtoIndex, direcao) {
  const fotos = todosProdutos[produtoIndex].fotos || [todosProdutos[produtoIndex].imagem];

  if (!fotosAtuais[produtoIndex]) {
    fotosAtuais[produtoIndex] = 0;
  }

  fotosAtuais[produtoIndex] += direcao;

  if (fotosAtuais[produtoIndex] < 0) {
    fotosAtuais[produtoIndex] = fotos.length - 1;
  }
  if (fotosAtuais[produtoIndex] >= fotos.length) {
    fotosAtuais[produtoIndex] = 0;
  }

  document.getElementById(`foto-${produtoIndex}`).src =
    fotos[fotosAtuais[produtoIndex]];
}

// Aplica busca + categoria juntos
function aplicarFiltros() {
  const termoBusca = document.getElementById("busca").value.trim().toLowerCase();

  let resultado = todosProdutos;

  if (categoriaAtual !== "todos") {
    resultado = resultado.filter(p => p.categoria === categoriaAtual);
  }

  if (termoBusca !== "") {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(termoBusca));
  }

  renderizarProdutos(resultado);
}

// Busca: digitando ou clicando na lupa
document.getElementById("busca").addEventListener("input", aplicarFiltros);
document.getElementById("botaoBusca").addEventListener("click", aplicarFiltros);

// Categorias: clique nos botões
document.querySelectorAll(".categoria").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".categoria").forEach(b => b.classList.remove("active"));
    botao.classList.add("active");
    categoriaAtual = botao.dataset.categoria;
    aplicarFiltros();
  });
});

// Menu mobile (abre/fecha a navegação em telas pequenas)
const menuMobile = document.querySelector(".menu-mobile");
const menu = document.querySelector(".menu");

if (menuMobile) {
  menuMobile.addEventListener("click", () => {
    menu.classList.toggle("menu-aberto");
  });
}
