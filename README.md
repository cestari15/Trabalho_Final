🏆 Sistema de Cadastro para Campeonato Amador de League of Legends
Projeto acadêmico — Desenvolvimento Web com Node.js + Express

Este projeto consiste em uma aplicação web simples voltada para gestão de equipes e jogadores de um campeonato amador de League of Legends (LoL).
O sistema permite:

Cadastro de equipes

Cadastro de jogadores vinculados a uma equipe

Autenticação com login e logout

Controle de sessão (30 minutos)

Registro de último acesso usando cookies

Exibição de listas de equipes e jogadores com layout em Bootstrap

🚀 Funcionalidades
🔐 Autenticação

Login com usuário e senha padrão definidos no servidor

Sessão ativa por 30 minutos (express-session)

Logout destrói a sessão imediatamente

🍪 Cookies

O sistema registra e exibe o último acesso do usuário à área logada

O cookie permanece salvo por 7 dias

🛡 Acesso Restrito

Todas as rotas (exceto login) são protegidas usando middleware personalizado.

🏅 Cadastro de Equipes

Cada equipe possui:

Nome

Capitão

Contato/WhatsApp

Com validação: não permite equipes duplicadas.

🎮 Cadastro de Jogadores

Cada jogador cadastrado possui:

Nome

Nickname

Função (top, jungle, mid, atirador, suporte)

Elo

Gênero

Time vinculado (selecionado a partir de lista gerada pelo servidor)

Regras:

Cada equipe pode ter até 5 jogadores

Todos os campos são obrigatórios

🛠 Tecnologias Utilizadas

Node.js

Express

Express-session

Cookie-parser

Bootstrap 5

HTML renderizado no servidor

JavaScript puro

📂 Estrutura do Projeto
/ (raiz)
 ├── server.js
 ├── package.json
 ├── package-lock.json
 └── README.md

📦 Instalação e Execução
1️⃣ Instalar dependências:
npm install

2️⃣ Iniciar o servidor:
node server.js

3️⃣ Acessar no navegador:
http://localhost:3000/login

🔑 Login Padrão
Campo	Valor
Usuário	admin
Senha	senha123
⚠ IMPORTANTE — SOBRE O DESENVOLVIMENTO

Este projeto foi desenvolvido manualmente, linha por linha, com fins educacionais.
Não foi utilizado nenhum recurso de Inteligência Artificial, gerador de código ou automatização externa.
Todo o código foi escrito diretamente pelo aluno como parte do processo de aprendizado em Node.js e Express.

👤 Contato do Desenvolvedor

Rafael Bispo Cestari Jacobs
Curso: Análise e Desenvolvimento de Sistemas (ADS)
RA / Matrícula: 10442518438
E-mail para contato: cestari1502@gmail.com
