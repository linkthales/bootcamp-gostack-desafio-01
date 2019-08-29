const express = require('express');

const port = 3000;
const server = express();
server.use(express.json());

server.get('/', (request, response) => {
  response.json({ message: 'Server listening..' });
});

server.listen(port);
