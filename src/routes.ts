import {
  Request, Response, NextFunction, Router,
} from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const routes = Router();

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

function avoidDuplicated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { id } = request.body;

  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const isInQueue = Boolean(data.queue.find((user) => user.id === id));
  if (isInQueue) {
    return response.status(400).json({ error: 'Usuário já está na fila' });
  }
  return next();
}

routes.post('/createUser', (request: Request, response: Response) => {
  const { nome, email, genero } = request.body;

  if (!nome || !email || !genero) {
    return response
      .status(400)
      .json({ error: 'Ops... O usuário deve ter um nome, email e gênero' });
  }

  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const newUser = {
    id: uuidv4(),
    nome,
    email,
    genero,
  };

  data.users.push(newUser);

  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json(newUser));
});

routes.post('/addToLine', avoidDuplicated, (request: Request, response: Response) => {
  const { id } = request.body;

  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const registeredUser = data.users.findIndex((user: any) => user.id === id);
  if (registeredUser === -1) {
    return response.status(400).json({ error: 'Usuário não encontrado' });
  }
  const newQueueUser = data.users[registeredUser];
  data.queue.push(newQueueUser);
  const userIndex = data.queue.findIndex((user: any) => user.id === id);

  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json({ posicao: userIndex + 1 }));
});

routes.get('/findPosition', (request: Request, response: Response) => {
  const { email } = request.query;

  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const userIndex = data.queue.findIndex((user: any) => user.email === email);
  if (userIndex === -1) {
    return response.status(400).json({ error: 'Usuário não encontrado' });
  }

  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json({ posicao: userIndex + 1 }));
});

routes.get('/showLine', (request: Request, response: Response) => {
  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const formatedQueue = data.queue.map(({ nome, genero, email }, index) => ({
    nome,
    genero,
    email,
    posicao: index + 1,
  }));

  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json(formatedQueue));
});

routes.get('/filterLine', (request: Request, response: Response) => {
  const { genero: gender } = request.query;

  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());

  const queueByGender = data.queue
    .map(({ nome, genero, email }, index) => ({
      nome,
      genero,
      email,
      posicao: index,
    }))
    .filter((user) => user.genero === gender);

  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json(queueByGender));
});

routes.delete('/popLine', (request: Request, response: Response) => {
  const db = fs.readFileSync('db.json');
  const data: UserRegister = JSON.parse(db.toString());
  if (data.queue.length === 0) {
    return response.status(400).json({ error: 'Ops... A fila está vazia' });
  }

  const first = data.queue.shift();
  const temp = JSON.stringify(data, null, 2);
  fs.writeFile('db.json', temp, () => response.json(first));
});

export default routes;
