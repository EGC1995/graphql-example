import express from 'express'
import { query } from 's6-api-graphql'

const
    Router = express.Router({ mergeParams: true }),
    Get = `query{quote{id,quote,author,date}}`

Router.get('', (req, res) => {
    query(Get)
        .then(result => {
            const transformed = transform(result)
            res.send(transformed)
        })
        .catch(err => {
            res.sendStatus(500)
        })
})

const transform = (result) => {
    const
        { data } = result,
        { quote } = data

    return {
        data: {
            uid: quote.id,
            quote: quote.quote,
            author: quote.author,
            date: quote.date
        }
    }
}

export default Router