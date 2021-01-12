const express = require('express')

const {
    sync,
    createAndUpdate
} = require('./utils/data')

const app = express()
const port = process.env.PORT || 3000
let lastTimeUpdated

// app.get('/test', (req, res) => {

// })

app.listen(port, () => {
    console.log('tinkoff-invest-margin is up on port: ' + port)

    //TODO: Proper date extraction from the schedule promise
    try {
        (async () => {
            // Create or update existing data file
            lastTimeUpdated = await createAndUpdate().then((date) => {
                return date
            }).then(async () => {
                // Add sync task to auto update 
                lastTimeUpdated = await sync().then((date) => date)
            })
        })()

    } catch (err) {
        // Do something then error occurred
        console.log(err)
    }

})