const fs = require('fs')
const cron = require('node-cron')
const shortsqueeze = require('shortsqueeze')
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
 * Get full stock data from JSON file by ticker name. (max 10 tickers per request)
 * Append live shortsqueeze data to the result.
 *
 * @param {String} Ticker string
 * @returns {Object} Array of ticker data objects
 */
const getDataByTicker = async (tickersArr) => {
    dataArr = JSON.parse(fs.readFileSync(dataPath))
    result = []

    // Set limit of tickers per request
    tickersArr = tickersArr.slice(0, 10)

    for (const element of tickersArr) {
        let tickerData = dataArr.filter(x => x.ticker.toLowerCase() === element.toLowerCase())[0]
        const shortsData = await shortsqueeze(tickerData.ticker),
            shortPercentOfFloat = shortsData.shortPercentOfFloat,
            shortInterestRatioDaysToCover = shortsData.shortInterestRatioDaysToCover
        // Append shorts data from ShortSqueeze.com
        tickerData.shortPercentOfFloat = shortPercentOfFloat || 'Нет данных'
        tickerData.shortInterestRatioDaysToCover = shortInterestRatioDaysToCover || 'Нет данных'
        result.push(tickerData)
    }

    return result
}

module.exports = {
    sync,
    createAndUpdate,
    getDataByTicker
}