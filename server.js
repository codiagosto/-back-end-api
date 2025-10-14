import pkg from "pg";
import dotenv from "dotenv";
import express from "express"; // Requisição do pacote do express

const app = express(); // Instancia o Express
const port = 3000; // Define a porta
app.use(express.json()); // Middleware para interpretar requisições com corpo em JSON

dotenv.config();
const { Pool } = pkg; // Obtém o construtor Pool do pacote pg para gerenciar conexões com o banco de dados PostgreSQL

let pool = null; // Variável para armazenar o pool de conexões com o banco de dados

// Função para conectar ao banco de dados
function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}

app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada

  const db = conectarBD(); // Atribui o retorno da função conectarBD()

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

app.get("/", async (req, res) => { // Cria endpoint na rota da raiz do projeto
  console.log("Rota GET / solicitada");

  const db = conectarBD(); // Atribui o retorno da função conectarBD()

  let dbStatus = "ok";
  try {
    console.log("Conexão com o banco de dados bem sucedida.");
    await db.query("SELECT 1"); // Verifica se a conexão está funcionando
  } catch (e) {
    dbStatus = e.message;
  }

  res.json({
    message: "API para _____", // Substitua pelo conteúdo da sua API
    author: "Iago Ornelas", // Substitua pelo seu nome
    statusBD: dbStatus,
  });
});

app.listen(port, () => { // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta: ${port}`);
});
//server.js
app.get("/questoes/:id", async (req, res) => {
  console.log("Rota GET /questoes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    const consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});
//server.js
app.delete("/questoes/:id", async (req, res) => {
  console.log("Rota DELETE /questoes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    consulta = "DELETE FROM questoes WHERE id = $1"; // Consulta SQL para deletar a questão pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Questão excluida com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});
//server.js
app.post("/questoes", async (req, res) => {
  console.log("Rota POST /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos (enunciado, disciplina, tema, nivel) são obrigatórios.",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO questoes (enunciado,disciplina,tema,nivel) VALUES ($1,$2,$3,$4) "; // Consulta SQL para inserir a questão
    const questao = [data.enunciado, data.disciplina, data.tema, data.nivel]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, questao); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Questão criada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor;",
    });
  }
});
