const express = require("express");
const app = express();
app.use(express.json());

// rota para criar pagamento PIX
app.post("/criar-pagamento", (req, res) => {
  res.json({
    sucesso: true,
    payment_id: "12345",
    qr_code: "00020126580014BR.GOV.BCB.PIX..."
  });
});

// rota para consultar pagamento
app.get("/consultar-pagamento/:id", (req, res) => {
  res.json({
    status: "approved"
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
