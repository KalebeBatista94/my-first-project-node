const { response } = require('express');
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors());//habilitando acesso do front ao back


const users = [];

// INTERCEPTADOR, tem o poder de parar ou alterar dados da requisição//
const checkUsedId = (request, response, next) => {
    const { id } = request.params;

    const index = users.findIndex(user => user.id === id);

    if (index < 0) {
        return response.status(404).json({error: "User not found"});
    }

    request.userIndex = index;
    request.userId = id;

    next();
}

app.get('/users', (request, response) => {
    return response.json(users); //retorna os usuarios
});

app.post('/users', (request, response) => {
    const { name, age } = request.body;

    const user = { id: uuid.v4(), name, age};
    // console.log(uuid.v4());

    users.push(user);//adiciona usuario

    return response.status(201).json(user);//retornando o status(201, que é de usuario criado) e o json
});

app.put('/users/:id', checkUsedId, (request, response) => {
    const { name, age } = request.body;
    const index = request.userIndex;
    const id = request.userId;

    const updatedUser = { id, name, age};

    users[index] = updatedUser //usuario atualizado


    return response.json(updatedUser); //retorna os usuarios
});

app.delete('/users/:id', checkUsedId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1);

    return response.status(204).json(); //retorna os usuarios
});


app.listen(port, () => {
    console.log(`Server started on port ${port} 🚀`);
});