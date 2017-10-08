import express from 'express';
import graphqlHTTP from 'express-graphql';
import rootSchema from './src/app';
import {graphql as client} from 'graphql'

const app = express();


const query = (q, vars) => {
    return client(rootSchema, q, null, null, vars)
}

// Transform response to JSON API format
const transformUser = (result) => {
    //return result;
    const user = result.data.users[0];

    return {
        data: {
            type: 'user',
            id: user._id,
            attributes: {
                name: user.name
            }
        }
    }
}

// REST request to get a user
app.get('/users/:userId', (req, res) => {
    //const GetUser = "query{users(_id:" + req.params.userId + "){_id, name}}"
    query("query{users(_id:" + req.params.userId + "){_id, name}}")
        .then(result => {
            const transformed = transformUser(result)
            res.send(transformed)
        })
        .catch(err => {
            res.sendStatus(500)
        })
})

// Here is the single GraphQL endpoint:
app.use('/graphql', graphqlHTTP({
    schema: rootSchema,
    graphiql: true,
}));

app.listen(4000);

console.log('Running GraphQL + REST API Gateway at http://localhost:4000/graphql');
