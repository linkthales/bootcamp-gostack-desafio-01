const express = require('express');

const port = 3000;
const server = express();
let requests = 0;

server.use(express.json());
server.use((request, response, next) => {
  console.log(
    `${++requests} ${
      requests > 1 ? 'requisições foram feitas' : 'requisição foi feita'
    } no servidor até o momento.`
  );
  return next();
});

const projects = [
  {
    id: 1,
    title: 'Projeto lulu bot',
    tasks: [
      'Criar projeto lulu bot no github',
      'Criar lulu bot',
      'Deploy lulu bot'
    ]
  },
  {
    id: 2,
    title: 'Projeto site lulu',
    tasks: [
      'Criar projeto site lulu no github',
      'Criar landing page do site lulu',
      'Criar área de usuário lulu',
      'Deploy site lulu'
    ]
  }
];

function idExists(request, response, next) {
  const { id } = request.body;

  if (projects.find(project => project.id == id)) {
    if (request.method === 'POST') {
      return response
        .status(400)
        .json({ error: `Projeto com id: ${id} já existe.` });
    }
  } else {
    if (request.method !== 'POST') {
      return response
        .status(400)
        .json({ error: `Projeto com id: ${id} não existe.` });
    }
  }

  return next();
}

server.get('/', (request, response) => {
  response.json({
    message: `${requests} request${
      requests > 1 ? 's' : ''
    } has been made to the server so far.`
  });
});

server.get('/projects', (request, response) => {
  response.json(projects);
});

server.post('/projects', idExists, (request, response) => {
  const { id, title } = request.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  response.json(projects);
});

server.listen(port);
