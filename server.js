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
app.get("/filmes", async (req, res) => {
  console.log("Rota GET /filmes solicitada");

  const db = conectarBD();

  try {
    const resultado = await db.query("SELECT * FROM filmes");
    const dados = resultado.rows;
    res.json(dados);
  } catch (e) {
    console.error("Erro ao buscar filmes:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar os filmes",
    });
  }
});


app.get("/", async (req, res) => {
  // Rota raiz do servidor
  // Rota GET /
  // Esta rota é chamada quando o usuário acessa a raiz do servidor
  // Ela retorna uma mensagem de boas-vindas e o status da conexão com o banco de dados
  // Cria a rota da raiz do projeto

  console.log("Rota GET / solicitada"); // Log no terminal para indicar que a rota foi acessada


  const db = conectarBD();

  let dbStatus = "ok";

  // Tenta executar uma consulta simples para verificar a conexão com o banco de dados
  // Se a consulta falhar, captura o erro e define o status do banco de dados como a mensagem de erro
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

  // Responde com um JSON contendo uma mensagem, o nome do autor e o status da conexão com o banco de dados
  res.json({
    mensagem: "API para Questões de Prova e filmes", // Substitua pelo conteúdo da sua API
    autor: "iago", // Substitua pelo seu nome
    dbStatus: dbStatus,
  });
});


app.listen(port, () => { // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta: ${port}`);
});
//server.js
app.get("/filmes/:id", async (req, res) => {
  console.log("Rota GET /filmes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da filme a partir dos parâmetros da URL
    const db = conectarBD();
    const consulta = "SELECT * FROM filmes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a filmes foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "filme não encontrada" }); // Retorna erro 404 se a filme não for encontrada
    }

    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar filmes:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});
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
app.delete("/filmes/:id", async (req, res) => {
  console.log("Rota DELETE /filmes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da filme a partir dos parâmetros da URL
    const db = conectarBD();
    let consulta = "SELECT * FROM filmes WHERE id = $1"; // Consulta SQL para selecionar a filmes pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a filmes foi encontrada
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "filme não encontrada" }); // Retorna erro 404 se a filmes não for encontrada
    }

    consulta = "DELETE FROM questoes WHERE id = $1"; // Consulta SQL para deletar a filmes pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "filmes excluida com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir filmes:", e); // Log do erro no servidor
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
app.post("/filmes", async (req, res) => {
  console.log("Rota POST /filmes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.titulo || !data.genero || !data.duracao || !data.ano_lancamento || !data.classificacao || !data.criado_em) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos (titulo,genero,ano_lancamento,classificacao e criado em) são obrigatórios.",
      });
    }

    const db = conectarBD();

    const consulta =
      "INSERT INTO filmes (titulo,genero,duracao,ano_lancamento,classificacao,criado_em) VALUES ($1,$2,$3,$4,$5,$6) "; // Consulta SQL para inserir a questão
    const filme = [data.titulo, data.genero, data.duracao, data.ano_lancamento,data.classificacao,data.criado_em]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, filme); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "filme criada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir filme:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor;",
    });
  }
});
//server.js
app.put("/questoes/:id", async (req, res) => {
  console.log("Rota PUT /questoes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let questao = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (questao.length === 0) {
      return res.status(404).json({ message: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.enunciado = data.enunciado || questao[0].enunciado;
    data.disciplina = data.disciplina || questao[0].disciplina;
    data.tema = data.tema || questao[0].tema;
    data.nivel = data.nivel || questao[0].nivel;

    // Atualiza a questão
    consulta ="UPDATE questoes SET enunciado = $1, disciplina = $2, tema = $3, nivel = $4 WHERE id = $5";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.enunciado,
      data.disciplina,
      data.tema,
      data.nivel,
      id,
    ]);

    res.status(200).json({ message: "Questão atualizada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar questão:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});
app.put("/filmes/:id", async (req, res) => {
  console.log("Rota PUT /filmes solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da filme a partir dos parâmetros da URL
    const db = conectarBD();
    let consulta = "SELECT * FROM filmes WHERE id = $1"; // Consulta SQL para selecionar a filme pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let filme = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se a questão foi encontrada
    if (filme.length === 0) {
      return res.status(404).json({ message: "filmes não encontrada" }); // Retorna erro 404 se a questão não for encontrada
    }

    const data = req.body; // Obtém os dados do corpo da requisição

    // Usa o valor enviado ou mantém o valor atual do banco
    data.titulo = data.titulo || filme[0].titulo;
    data.genero = data.genero || filme[0].genero;
    data.duracao = data.duracao || filme[0].duracao;
    data.ano_lancamento = data.ano_lancamento || filme[0].ano_lancamento;
    data.classificacao = data.classificacao || filme[0].classificacao;
    data.criado_em = data.criado_em || filme[0].criado_em;

    

    // Atualiza a filme
    consulta ="UPDATE filmes SET titulo = $1, genero = $2, duracao = $3, ano_lancamento = $4 ,classificacao = $5,criado_em =$6  WHERE id = $7";
    // Executa a consulta SQL com os valores fornecidos
    resultado = await db.query(consulta, [
      data.titulo,
      data.genero,
      data.duracao,
      data.ano_lancamento,
      data.classificacao,
      data.criado_em,
      id,
    ]);

    res.status(200).json({ message: "filme atualizada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao atualizar filme:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});