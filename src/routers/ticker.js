const express = require('express')
const {
    getDataByTicker
} = require('../utils/data')

const router = new express.Router()

router.get('/ticker/:ticker', async (req, res) => {
    // Split tickers by spacebar and delete empty items
    const tickersArr = decodeURI(req.params.ticker).split(' ').filter(item => item)
    try {
        const tickerData = await getDataByTicker(tickersArr)
        if (!tickerData || tickerData.length === 0) {
            return res.status(404).send({
                error: 'Тикер не найден в перечне ликвидных бумаг Тинькофф!'
            })
        }
        res.send(tickerData)
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router