const express = require('express');
const app = express();
const path = require('path');

// servir todos os arquivos da pasta backend
app.use(express.static(__dirname));

// rota principal: abre index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
