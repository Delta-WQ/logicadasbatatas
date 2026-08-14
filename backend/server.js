const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const pacotes = {
  1: { moedas: 100, titulo: "100 moedas" },
  2: { moedas: 250, titulo: "250 moedas" },
  3: { moedas: 400, titulo: "400 moedas" },
  4: { moedas: 550, titulo: "550 moedas" },
  5: { moedas: 700, titulo: "700 moedas" },
  10: { moedas: 1500, titulo: "1.500 moedas" },
  20: { moedas: 3500, titulo: "3.500 moedas" },
  50: { moedas: 10000, titulo: "10.000 moedas" },
  100: { moedas: 22000, titulo: "22.000 moedas" }
};

app.get("/", (req, res) => {
  res.json({
    status: "online",
    projeto: "A Logica das Batatas"
  });
});

app.get("/teste", (req, res) => {
  res.json({
    mensagem: "Backend funcionando corretamente."
  });
});

app.post("/criar-pagamento", async (req, res) => {
  try {
    const valor = Number(req.body.valor);
    const pacote = pacotes[valor];

    if (!pacote) {
      return res.status(400).json({
        erro: "Pacote invalido."
      });
    }

    const preference = new Preference(client);

    const resultado = await preference.create({
      body: {
        items: [
          {
            title: `A Logica das Batatas - ${pacote.titulo}`,
            quantity: 1,
            unit_price: valor,
            currency_id: "BRL"
          }
        ],

        back_urls: {
          success: "https://delta787.com.br/jogo.html?pagamento=sucesso",
          failure: "https://delta787.com.br/jogo.html?pagamento=falhou",
          pending: "https://delta787.com.br/jogo.html?pagamento=pendente"
        },

        auto_return: "approved"
      }
    });

    res.json({
      sucesso: true,
      id: resultado.id,
      link: resultado.init_point
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      sucesso: false,
      erro: "Nao foi possivel criar o pagamento."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
