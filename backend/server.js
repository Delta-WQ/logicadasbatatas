const express = require("express");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(express.json());

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
            id: "logica-das-batatas",
            title: "A Lógica das Batatas",
            description: "Compra do jogo A Lógica das Batatas",
            quantity: 1,
            unit_price: 1.00,
            currency_id: "BRL"
          }
        ],

        payment_methods: {
          excluded_payment_types: [
            {
              id: "ticket"
            },
            {
              id: "credit_card"
            },
            {
              id: "debit_card"
            }
          ]
        },

        back_urls: {
          success: "https://logicadasbatatas.onrender.com/jogo.html?pagamento=sucesso",
          failure: "https://logicadasbatatas.onrender.com/jogo.html?pagamento=falhou",
          pending: "https://logicadasbatatas.onrender.com/jogo.html?pagamento=pendente"
        },

        auto_return: "approved"
      }
    });

    res.json({
      sucesso: true,
      checkout_url: pagamento.init_point
    });

  } catch (erro) {
    console.error("Erro ao criar pagamento:", erro);

    res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar pagamento"
    });
  }
});

app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});
