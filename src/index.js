const express = require('express')
const path  = require('path')
const {
    sync,
    createAndUpdate
} = require('./utils/data')
const tickerRouter = require('./routers/ticker')
const webRouter = require('./routers/web')

const app = express()
const port = process.env.PORT || 3000
const public_dir = path.join(__dirname, '../public')
let lastTimeUpdated

// Option to hide file extension from URL
const options = {
    extensions: ['html']
}

// Setup static directory to serve
app.use(express.static(public_dir, options))

// Register routers
app.use(tickerRouter)
app.use(webRouter)

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