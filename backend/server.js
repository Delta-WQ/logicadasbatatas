const express = require("express");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Jogo
app.get("/jogo", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "jogo.html"));
});

// Status
app.get("/api/status", (req, res) => {
    res.json({
        mensagem: "Backend funcionando corretamente."
    });
});

// Pacotes de moedas
const pacotes = {
    "1": { valor: 1, moedas: 100 },
    "2": { valor: 2, moedas: 250 },
    "3": { valor: 3, moedas: 400 },
    "4": { valor: 4, moedas: 550 },
    "5": { valor: 5, moedas: 700 },
    "10": { valor: 10, moedas: 1500 },
    "20": { valor: 20, moedas: 3500 },
    "50": { valor: 50, moedas: 10000 },
    "100": { valor: 100, moedas: 22000 }
};

// Criar pagamento
app.post("/api/criar-pagamento", async (req, res) => {
    try {
        const valor = String(req.body.valor);

        const pacote = pacotes[valor];

        if (!pacote) {
            return res.status(400).json({
                erro: "Pacote de moedas inválido."
            });
        }

        const preference = new Preference(client);

        const resultado = await preference.create({
            body: {
                items: [
                    {
                        title: `Pacote de ${pacote.moedas} moedas - A Lógica das Batatas`,
                        quantity: 1,
                        unit_price: pacote.valor,
                        currency_id: "BRL"
                    }
                ],
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
            id: resultado.id,
            link: resultado.init_point
        });

    } catch (erro) {
        console.error("Erro Mercado Pago:", erro);

        res.status(500).json({
            sucesso: false,
            erro: "Não foi possível criar o pagamento."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
