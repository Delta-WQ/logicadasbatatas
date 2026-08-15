const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();

app.use(express.json());

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

app.post("/criar-pagamento", async (req, res) => {
  try {
    const idempotencyKey = crypto.randomUUID();

    const resposta = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "X-Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({
          transaction_amount: 1.00,

          description: "A Lógica das Batatas",

          payment_method_id: "pix",

          payer: {
            email: "ontem787@gmail.com"
          },

          external_reference: "logica-das-batatas"
        })
      }
    );

    const pagamento = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro Mercado Pago:", pagamento);

      return res.status(400).json({
        sucesso: false,
        erro: pagamento
      });
    }

    res.json({
      sucesso: true,
      payment_id: pagamento.id,
      status: pagamento.status,
      valor: pagamento.transaction_amount,
      qr_code: pagamento.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64:
        pagamento.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url:
        pagamento.point_of_interaction?.transaction_data?.ticket_url
    });

  } catch (erro) {
    console.error("Erro ao criar PIX:", erro);

    res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao criar pagamento PIX"
    });
  }
});

app.get("/consultar-pagamento/:id", async (req, res) => {
  try {
    const resposta = await fetch(
      `https://api.mercadopago.com/v1/payments/${req.params.id}`,
      {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    const pagamento = await resposta.json();

    res.json({
      sucesso: resposta.ok,
      id: pagamento.id,
      status: pagamento.status,
      status_detail: pagamento.status_detail
    });

  } catch (erro) {
    console.error("Erro ao consultar pagamento:", erro);

    res.status(500).json({
      sucesso: false,
      erro: "Erro ao consultar pagamento"
    });
  }
});

app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});
