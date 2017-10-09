const app = require('express');
const router = express.Router();

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

module.exports = router;
