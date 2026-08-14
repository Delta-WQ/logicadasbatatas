const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Permite receber dados em JSON
app.use(express.json());

// Servir todos os arquivos do site
app.use(express.static(path.join(__dirname, "..")));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Rota do jogo
app.get("/jogo", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "jogo.html"));
});

// Teste do servidor
app.get("/api/status", (req, res) => {
    res.json({
        mensagem: "Backend funcionando corretamente."
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
