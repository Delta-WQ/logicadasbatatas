const express = require("express");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-7760968762453302-081500-b2617e2e62d7efa719f74c0f3c7c9e7b-3617094508"
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
        back_urls: {
          success: "https://logicadasbatatas.onrender.com/jogo.html",
          failure: "https://logicadasbatatas.onrender.com/jogo.html",
          pending: "https://logicadasbatatas.onrender.com/jogo.html"
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [],
          installments: 1
        }
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

app.get("/jogo.html", (req, res) => {
  res.sendFile(path.join(__dirname, "jogo.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
