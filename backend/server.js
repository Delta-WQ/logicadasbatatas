const express = require("express");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

app.post("/criar-pagamento", async (req, res) => {
  try {
    const pagamento = await preference.create({
      body: {
        items: [
          {
            title: "A Lógica das Batatas",
            quantity: 1,
            unit_price: 1.00,
            currency_id: "BRL"
          }
        ],
        payment_methods: {
          excluded_payment_types: [],
          installments: 12
        },
        back_urls: {
          success: "https://logicadasbatatas.onrender.com/jogo.html",
          failure: "https://logicadasbatatas.onrender.com/jogo.html",
          pending: "https://logicadasbatatas.onrender.com/jogo.html"
        },
        auto_return: "approved"
      }
    });

    res.json({
      sucesso: true,
      init_point: pagamento.init_point
    });

  } catch (erro) {
    console.error("Erro ao criar pagamento:", erro);

    res.status(500).json({
      sucesso: false,
      erro: "Não foi possível criar o pagamento."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
