const fs = require('fs')
const cron = require('node-cron')
const parse = require('./parser')

const dataPath = 'src/margin-stocks.json'

/**
 * Store data into the json file.
 *
 * @param {Object} Object of tickers objects
 * @returns {Date} Last time updated date object
 */
const store = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data))
}

/**
 * Create stocks data file or update if it's already exists.
 *
 * @async
 * @returns {Date} Last time updated date object
 */
const createAndUpdate = async () => {
    return await parse().then((table) => {
        store(table)
        return new Date()
    }).catch((err) => {
        throw new Error(err.message)
    })
}

/**
 * Sync function start a scheduled task to keep parsed data up to date.
 * 
 * * '* * * * * *' run task every second
 * * '45 9 * * *' run task every 09:45 AM
 */
const sync = async () => {
    return cron.schedule('45 9 * * *', async () => {
        return await createAndUpdate().then((data) => data)
    }, {
        timezone: 'Europe/Moscow'
    })
}

/**
 * Get full stock data from JSON file by ticker name.
 *
 * @param {String} Ticker string
 * @returns {Object} Array of ticker data objects
 */
const getDataByTicker = (tickersArr) => {
    dataArr = JSON.parse(fs.readFileSync(dataPath))
    result = []
    tickersArr.forEach(element => {
        result.push(dataArr.filter(x => x.ticker.toLowerCase() === element.toLowerCase())[0])
    })
    return result
}

module.exports = {
    sync,
    createAndUpdate,
    getDataByTicker
}