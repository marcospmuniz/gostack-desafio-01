const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateUuid(request, response, next) {

  if (!isUuid(request.params.id)) {
    return response.status(400).json({ error: 'Invalid ID!' });
  }

  return next();
}

app.use(express.json());
app.use(cors());
// middleware para as rotas que iniciem com /repositories/:id
app.use('/repositories/:id', validateUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json( repository );
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'ID not found!' });
  }

  const oldRepository = repositories[repositoryIndex];

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: oldRepository.likes
  }

  repositories[repositoryIndex] = newRepository;

  return response.json( newRepository );

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'ID not found!' });
  }

  // exclui o registro com ID informado
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'ID not found!' });
  }

  const repository = repositories[repositoryIndex];
  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.json( repository );
});

module.exports = app;
