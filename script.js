fetch("produtos.json")
  .then(response => response.json())
  .then(produtos => {
    const container = document.getElementById("produtos");

    produtos.forEach((produto, index) => {
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
  })
  .catch(error => {
    console.error("Erro ao carregar produtos:", error);
  });


const fotosAtuais = {};

function mudarFoto(produtoIndex, direcao) {
  fetch("produtos.json")
    .then(response => response.json())
    .then(produtos => {
      const fotos = produtos[produtoIndex].fotos || [produtos[produtoIndex].imagem];

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
    });
}
