const express = require('express')
const {
    getDataByTicker
} = require('../utils/data')

const router = new express.Router()

router.get('/ticker/:ticker', async (req, res) => {
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

module.exports = router