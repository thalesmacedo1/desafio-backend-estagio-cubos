import express from 'express';

import routes from './routes';

const server = express();

server.use(express.json());
server.use(routes);

const port = process.env.PORT || 3333;
server.listen(port);
