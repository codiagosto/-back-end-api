import pkg from "pg";
import dotenv from "dotenv";
import express from "express";      // Requisição do pacote do express

const app = express();              // Instancia o Express
const port = 3000;                  // Define a porta

dotenv.config();         // Carrega e processa o arquivo .env
const { Pool } = pkg;   // Utiliza a Classe Pool do Postgres
app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada
  const { Pool } = pkg; // Obtém o construtor Pool do pacote pg para gerenciar conexões com o banco de dados PostgreSQL

  const db = new Pool({
    // Cria uma nova instância do Pool para gerenciar conexões com o banco de dados
    connectionString: process.env.URL_BD, // Usa a variável de ambiente do arquivo .env para a string de conexão
  });

  try {
    const resultado = await db.query("SELECT * FROM questoes"); // Executa a consulta SQL
    const dados = resultado.rows; // Obtém as linhas retornadas
    res.json(dados); // Retorna como JSON
  } catch (e) {
    console.error("Erro ao buscar questões:", e); // Log do erro
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as questões",
    });
  }
});
app.get("/", async (req, res) => {        // Cria endpoint na rota da raiz do projeto
  
  
  console.log("Rota GET / solicitada");
  const db = new Pool({
    connectionString: process.env.URL_BD,
  });

  let dbStatus = "ok";
  try {
    console.log("Conexão com o banco de dados bem sucedida.");
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }
  res.json({
    message: "API para _____",      // Substitua pelo conteúdo da sua API
    author: "iago ornelas",    // Substitua pelo seu nome
    statusBD: dbStatus
  });
});

app.listen(port, () => {            // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta:  ${port}`);
});