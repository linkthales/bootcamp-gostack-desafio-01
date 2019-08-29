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

function idExistsOnBody(request, response, next) {
  const { id } = request.body;

  if (projects.find(project => project.id == id)) {
    return response
      .status(400)
      .json({ error: `Projeto com id: ${id} já existe.` });
  }

  return next();
}

function idExistsOnParams(request, response, next) {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex === -1) {
    return response
      .status(400)
      .json({ error: `Projeto com id: ${id} não existe.` });
  }

  request.projectIndex = projectIndex;

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

server.post('/projects', idExistsOnBody, (request, response) => {
  const { id, title } = request.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  response.json(projects);
});

server.post('/projects/:id/tasks', idExistsOnParams, (request, response) => {
  const {
    projectIndex,
    body: { title }
  } = request;

  projects[projectIndex].tasks.push(title);

  response.json(projects);
});

server.put('/projects/:id', idExistsOnParams, (request, response) => {
  const {
    projectIndex,
    body: { title }
  } = request;

  projects[projectIndex].title = title;

  response.json(projects);
});

server.delete('/projects/:id', idExistsOnParams, (request, response) => {
  const { projectIndex } = request;

  projects.splice(projectIndex, 1);

  response.json({ message: 'Projeto removido com sucesso.' });
});

server.listen(port);
