import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const server = express();
const host = "0.0.0.0";
const porta = process.env.PORT || 3000;

const equipes = [];
const jogadores = [];

const AUTH_USER = { username: "admin", password: "senha123" };

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
  secret: "Minh4Ch4v3S3cr3t4",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 }
}));

function requireLogin(req, res, next) {
  if (req.session && req.session.user) next();
  else res.redirect("/login");
}

function genId(prefix = "") {
  return prefix + Math.random().toString(36).substring(2, 9);
}



server.get("/login", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container w-50 mt-5">
  <div class="card shadow p-4">
    <h3 class="text-center mb-3">Login</h3>

    ${req.query.e === "1"
      ? "<p class='text-danger text-center'>Usuário ou senha incorretos</p>"
      : ""}

    <form method="POST">
      <div class="mb-3">
        <label class="form-label">Usuário</label>
        <input name="username" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Senha</label>
        <input name="password" type="password" class="form-control" required>
      </div>

      <button class="btn btn-primary w-100">Entrar</button>
    </form>
  </div>
</div>

</body>
</html>
  `);
});

server.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === AUTH_USER.username && password === AUTH_USER.password) {
    req.session.user = { username };
    res.redirect("/menu");
  } else {
    res.redirect("/login?e=1");
  }
});

server.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});



server.get("/menu", requireLogin, (req, res) => {
  const ultimoAcesso = req.cookies.ultimoAcesso || "Primeira vez aqui";
  const agora = new Date().toLocaleString();

  res.cookie("ultimoAcesso", agora, { maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-dark px-3">
  <a class="navbar-brand" href="#">Sistema LoL</a>
  <span class="text-white">Logado como: ${req.session.user.username}</span>
  <a class="btn btn-outline-light" href="/logout">Sair</a>
</nav>

<div class="container mt-4">
  <h3>Menu do Sistema</h3>
  <p><b>Último acesso:</b> ${ultimoAcesso}</p>

  <div class="list-group">
    <a class="list-group-item list-group-item-action" href="/cadastroEquipe">Cadastrar Equipe</a>
    <a class="list-group-item list-group-item-action" href="/listarEquipes">Listar Equipes</a>
    <a class="list-group-item list-group-item-action" href="/cadastroJogador">Cadastrar Jogador</a>
    <a class="list-group-item list-group-item-action" href="/listarJogadores">Listar Jogadores</a>
  </div>
</div>

</body>
</html>
  `);
});



server.get("/cadastroEquipe", requireLogin, (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-4">
  <div class="card p-4 shadow">

    <h3>Cadastrar Equipe</h3>

    <form method="POST">

      <div class="mb-3">
        <label class="form-label">Nome da equipe</label>
        <input name="nome" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Capitão</label>
        <input name="capitao" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Contato</label>
        <input name="contato" class="form-control" required>
      </div>

      <button class="btn btn-success">Cadastrar</button>
      <a class="btn btn-secondary" href="/menu">Voltar</a>
    </form>
  </div>
</div>

</body>
</html>
  `);
});

server.post("/cadastroEquipe", requireLogin, (req, res) => {
  const { nome, capitao, contato } = req.body;

  if (!nome || !capitao || !contato)
    return res.send("Campos obrigatórios.");

  const existe = equipes.find(e => e.nome.toLowerCase() === nome.toLowerCase());
  if (existe)
    return res.send("Equipe já cadastrada.");

  equipes.push({ id: genId("e_"), nome, capitao, contato });

  res.redirect("/listarEquipes");
});


server.get("/listarEquipes", requireLogin, (req, res) => {

  let lista = equipes.length === 0
    ? "<p class='text-danger'>Nenhuma equipe cadastrada.</p>"
    : equipes.map((e, i) =>
        `<li class="list-group-item">
          <b>${i + 1} — ${e.nome}</b><br>
          Capitão: ${e.capitao}<br>
          Contato: ${e.contato}
        </li>`
      ).join("");

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-4">
  <h3>Equipes Cadastradas</h3>

  <ul class="list-group">
    ${lista}
  </ul>

  <a class="btn btn-secondary mt-3" href="/menu">Voltar</a>
</div>

</body>
</html>
  `);
});



server.get("/cadastroJogador", requireLogin, (req, res) => {

  let options = equipes.length === 0
    ? `<option>Nenhuma equipe cadastrada</option>`
    : equipes.map(e => `<option value="${e.id}">${e.nome}</option>`).join("");

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-4">

  <div class="card p-4 shadow">
    <h3>Novo Jogador</h3>

    <form method="POST">

      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input name="nome" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Nickname</label>
        <input name="nickname" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Função</label>
        <select name="funcao" class="form-select" required>
          <option value="">Selecione...</option>
          <option>top</option>
          <option>jungle</option>
          <option>mid</option>
          <option>atirador</option>
          <option>suporte</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Elo</label>
        <select name="elo" class="form-select" required>
          <option value="">Selecione...</option>
          <option>Ferro</option>
          <option>Bronze</option>
          <option>Prata</option>
          <option>Ouro</option>
          <option>Platina</option>
          <option>Diamante</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Gênero</label>
        <select name="genero" class="form-select" required>
          <option value="">Selecione...</option>
          <option>Masculino</option>
          <option>Feminino</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Equipe</label>
        <select name="equipeId" class="form-select" required>
          <option value="">Selecione...</option>
          ${options}
        </select>
      </div>

      <button class="btn btn-success">Cadastrar</button>
      <a href="/menu" class="btn btn-secondary">Voltar</a>

    </form>
  </div>
</div>

</body>
</html>
  `);
});



server.get("/listarJogadores", requireLogin, (req, res) => {

  let html = "";

  equipes.forEach(eq => {
    const membros = jogadores.filter(j => j.equipeId === eq.id);

    html += `
      <h4 class="mt-4">${eq.nome}</h4>
      <ul class="list-group mb-3">
    `;

    if (membros.length === 0) {
      html += `<li class="list-group-item text-danger">Nenhum jogador</li>`;
    } else {
      membros.forEach(j => {
        html += `
          <li class="list-group-item">
            <b>${j.nickname}</b> (${j.nome}) — ${j.funcao} — ${j.elo}
          </li>
        `;
      });
    }

    html += "</ul>";
  });

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-4">
  <h3>Jogadores</h3>
  ${html}
  <a class="btn btn-secondary mt-3" href="/menu">Voltar</a>
</div>

</body>
</html>
  `);
});



server.listen(porta, host, () => console.log("Servidor rodando"));
