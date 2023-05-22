require("dotenv").config();
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const auth = require("./middleware/auth");

const app = express();

// Conexão com Banco de Dados
require("./config/database").connect();

// Aplicação das dependências para melhorias de desempenho, segurança, etc.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.disable('x-powered-by')

app.use(cors({
    origin: '*'
}));

app.use(helmet());

app.use(compression())

// Utilização das rotas do sistema
app.use('/api', require("./routes/routes"))

// Rota para teste da autenticação
app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome")
})

// Iniciar servidor express
const { API_PORT } = process.env
const port = API_PORT || 3000

app.listen(port, () => {
    console.log('Listening to port ' + API_PORT)
})

module.exports = app