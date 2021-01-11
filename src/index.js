const express = require('express')

const parse = require('./utils/parser')

const app = express()
const port = process.env.PORT || 3000

app.get('/test', (req, res) => {
    parse().then( (table) => {
        res.send(table)
    }).catch( (err) => {
        console.log(err)
        res.status(500).send(err.message)
    })
    // res.send('Testing connection')
})



app.listen(port, () => {
    console.log('tinkoff-invest-margin is up on port: ' + port)
})