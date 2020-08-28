import request from 'supertest';
import routes from '../routes';

describe('Registro', () => {
  it('Deve efetuar o cadastro de um usuário', async () => {
    const response = await request(routes).post('/createUser').send({
      nome: 'Thales Macêdo',
      email: 'thalesmacedo1@live.com',
      genero: 'masculino',
    });

    expect(response.body).toMatchObject({
      nome: 'Thales Macêdo',
      email: 'thalesmacedo1@live.com',
      genero: 'masculino',
    });
  });
});
