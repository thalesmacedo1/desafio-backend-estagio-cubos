import request from 'supertest';
import routes from '../routes';

describe('Fila', () => {
  it('Deve ser capaz de adicionar um usuário a fila', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    const addUser = await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    expect(addUser.body).toEqual(
      expect.arrayContaining([
        {
          id: response.body.id,
          nome: 'Thales Macêdo',
          email: 'thalesmacedo1@live.com',
          genero: 'masculino',
        },
      ]),
    );
  });

  it('Deve ser capaz de recusar adição de um usuário duplicado à fila', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    await request(routes)
      .post('/addToLine')
      .send(response.body.id)
      .expect(400);
  });

  it('Deve ser capaz de buscar um usuário na fila', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    const addUser = await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    const searchForUser = await request(routes)
      .get('/findPosition')
      .query({ email: addUser.body.email });

    expect(searchForUser.body).toMatchObject({
      posicao: 1,
    });
  });

  it('Deve ser capaz de exibir a fila', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    const listQueue = await request(routes)
      .get('/showLine');

    expect(listQueue.body).toEqual(
      expect.arrayContaining([
        {
          nome: 'Thales Macêdo',
          email: 'thalesmacedo1@live.com',
          genero: 'masculino',
          posicao: 1,
        },
      ]),
    );
  });

  it('Deve ser capaz de exibir a fila filtrada por gênero', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    const response2 = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Antônio Reis',
        email: 'antonioreis1@live.com',
        genero: 'masculino',
      });

    const response3 = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Sandra Reis',
        email: 'sandrareis1@live.com',
        genero: 'feminino',
      });

    await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    await request(routes)
      .post('/addToLine')
      .send(response2.body.id);

    await request(routes)
      .post('/addToLine')
      .send(response3.body.id);

    const filterByGender = await request(routes)
      .get('filterLine')
      .query({ genero: 'masculino' });

    expect(filterByGender.body).toEqual(
      expect.arrayContaining([
        {
          id: response.body.id,
          nome: 'Thales Macêdo',
          email: 'thalesmacedo1@live.com',
          genero: 'masculino',
          posicao: 1,
        },
        {
          id: response2.body.id,
          nome: 'Antônio Reis',
          email: 'antonioreis1@live.com',
          genero: 'masculino',
          posicao: 2,
        },
      ]),
    );
  });

  it('Deve ser capaz de retirar da fila o primeiro usuário', async () => {
    const response = await request(routes)
      .post('/createUser')
      .send({
        nome: 'Thales Macêdo',
        email: 'thalesmacedo1@live.com',
        genero: 'masculino',
      });

    await request(routes)
      .post('/addToLine')
      .send(response.body.id);

    const removeFirstUser = await request(routes)
      .delete('/popLine');

    expect(removeFirstUser.body).toEqual(
      expect.arrayContaining([]),
    );
  });
});
