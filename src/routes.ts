import express, { Request, Response, NextFunction } from 'express';
// import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const routes = express.Router();

// const db = fs.readFileSync('db.json');
// const data = JSON.parse(db.toString());

// git remote add origin https://github.com/thalesmacedo1/desafio-backend-estagio-cubos.git
// git branch -M master
// git push -u origin master

interface Users {
  id: String;
  nome: String;
  email: String;
  genero: String;
}

interface UserRegister {
  users: Array<Users>;
  queue: Array<Users>;
}

const data: UserRegister = {
  users: [],
  queue: [],
};

function avoidDuplicated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { id } = request.body;

  const isInQueue = Boolean(data.queue.find((user) => user.id === id));
  if (isInQueue) {
    return response.status(400).json({ error: 'Usuário já está na fila' });
  }
  return next();
}

routes.post('/createUser', (request, response) => {
  const { nome, email, genero } = request.body;

  if (!nome || !email || !genero) {
    return response
      .status(400)
      .json({ error: 'Ops... O usuário deve ter um nome, email e gênero' });
  }

  const newUser = {
    id: uuidv4(),
    nome,
    email,
    genero,
  };

  data.users.push(newUser);

  return response.json(newUser);
});

routes.post('/addToLine', avoidDuplicated, (request, response) => {
  const { id } = request.body;

  const registeredUser = data.users.findIndex((user: any) => user.id === id);
  if (registeredUser === -1) {
    return response.status(400).json({ error: 'Usuário não encontrado' });
  }
  const newQueueUser = data.users[registeredUser];
  data.queue.push(newQueueUser);
  const userIndex = data.queue.findIndex((user: any) => user.id === id);

  return response.json({ posicao: userIndex + 1 });
});

routes.get('/findPosition', (request, response) => {
  const { email } = request.query;

  const userIndex = data.queue.findIndex((user: any) => user.email === email);
  if (userIndex === -1) {
    return response.status(400).json({ error: 'Usuário não encontrado' });
  }

  return response.json({ posicao: userIndex + 1 });
});

routes.get('/showLine', (request, response) => {
  const formatedQueue = data.queue.map(({ nome, genero, email }, index) => ({
    nome,
    genero,
    email,
    posicao: index + 1,
  }));

  response.json(formatedQueue);
});

routes.get('/filterLine', (request, response) => {
  const { genero: gender } = request.query;

  const queueByGender = data.queue
    .map(({ nome, genero, email }, index) => ({
      nome,
      genero,
      email,
      posicao: index,
    }))
    .filter((user) => user.genero === gender);

  return response.json(queueByGender);
});

routes.delete('/popLine', (request, response) => {
  if (data.queue.length === 0) {
    return response.status(400).json({ error: 'Ops... A fila está vazia' });
  }

  const first = data.queue.shift();
  return response.json(first);
});

export default routes;
