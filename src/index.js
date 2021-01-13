const express = require('express')

const {
    sync,
    createAndUpdate,
    getDataByTicker
} = require('./utils/data')

const app = express()
const port = process.env.PORT || 3000
let lastTimeUpdated

app.get('/ticker/:ticker', async (req, res) => {
    const _ticker = req.params.ticker
    if(typeof(_ticker) != 'string') return res.status(400).send()

    try {
        const tickerData = await getDataByTicker(_ticker)
        if (!tickerData) {
            return res.status(404).send({
                error: 'Тикер не найден в перечне ликвидных бумаг Тинькофф!'
            })
        }
        res.send(tickerData)
    } catch (err) {
        res.status(500).send()
    }
})

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