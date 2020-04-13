const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyId = (req, res, next) => {
  const { id } = req.params

  if (!(isUuid(id))) {
    return res.status(400).json({ erro: 'ID invalid' })
  }

  return next();
}

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return res.json(repository);

});

app.put("/repositories/:id", verifyId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) return res.status(400).json({ erro: 'Repository not found' })

  const repo = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[indexRepo] = repo;

  return res.json(repo)
});

app.delete("/repositories/:id", verifyId, (req, res) => {
  const { id } = req.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) return res.status(400).json({ erro: 'Repository not found' })

  repositories.splice(indexRepo, 1);

  return res.status(204).json({ message: 'Successfully deleted repository' });
});

app.post("/repositories/:id/like", verifyId, (req, res) => {
  const { id } = req.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) return res.status(400).json({ erro: 'Repository not found' })
  

  repositories[indexRepo].likes = ++repositories[indexRepo].likes;
  
  return res.json(repositories[indexRepo]);
});

module.exports = app;
