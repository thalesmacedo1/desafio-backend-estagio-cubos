# Queue Manager API

## Introdução
Essa API serve para gerenciar uma fila de pessoas. Os dados são categorizados em dois grupos: banco de usuários e fila.

## Uso
Clone o repositório:\
`git clone https://github.com/thalesmacedo1/desafio-backend-estagio-cubos.git`\
`cd desafio-backend-estagio-cubos`

### Iniciar API
Para rodar a API use:\
`yarn dev`
### Testes Unitários
Para rodar os testes use:\
`yarn test`

## Rotas
Obs.: Localmente o servidor está alocado em:
`http://localhost:3333/`

<b>Cadastrar usuário</b>\
Endpoint: /createUser\
Método: [POST]

Body:
```javascript
{
    "nome": "Thales Macêdo",
    "email": "thalesmacedo1@live.com",
    "genero": "masculino"
}
```

<b>Adicionar à Fila</b>\
Endpoint: /addToLine\
Método: [POST]


Body:
```javascript
{
    "id": "e82a12b3-04f1-4027-9a09-63cebd7bd78e"
}
```

<b>Buscar usuário na fila</b>\
Endpoint: /findPosition\
Método: [GET]

Query Params:
  - email

<b>Ver fila</b>\
Endpoint: /showLine\
Método: [GET]


<b>Filtrar fila</b>\
Endpoint: /filterLine\
Método: [GET]

Query Params:
  - genero

<b>Tirar da fila</b>\
Endpoint: /popLine\
Método: [DELETE]

## Exemplos das diferentes requisições 

https://documenter.getpostman.com/view/8896044/TVCb5W7d