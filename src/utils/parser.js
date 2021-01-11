const got = require('got')
const cheerio = require('cheerio')

/**
 * Parse tinkoff margin equities page and collect data in JSON format
 * @returns {Object} Object of tickers objects
 */
const parse  = async () => {
    try {
        const response = await got('https://www.tinkoff.ru/invest/margin/equities/')
        
        if(!response.body) throw new Error('Parsed body is undefined')

        const $ = cheerio.load(response.body)
        const table = $('table').first().find('tbody').first().find('tr')
        let jsonData = {}

        /**
         * Create array of objects by parsing the DOM table
         * @returns {Object} Array of objects
         * Object format: 
         * ticker: { name, isin, short, longRisk, shortRisk }
         */
        let tableObjArray = [] = Array.prototype.map.call(table, (tr) => {
            return {
                [ $(tr).find('td:nth-of-type(1) a span div div:nth-of-type(2)').text().split(',')[0] ]: {
                    name: $(tr).find('td:nth-of-type(1) a span div div:nth-of-type(1)').text(),
                    isin: $(tr).find('td:nth-of-type(2) a span div div:nth-of-type(1)').text(),
                    short: $(tr).find('td:nth-of-type(3) a span div:nth-of-type(1)').text() === 'Доступен' ? true : false,
                    longRisk: parseFloat( $(tr).find('td:nth-of-type(4) a span div:nth-of-type(1)').text().split('/')[0].trim() ),
                    shortRisk: parseFloat( $(tr).find('td:nth-of-type(4) a span div:nth-of-type(1)').text().split('/')[1].trim() )
                }
            }
        })
        
        // Convert objects array into object (for JSON)
        tableObjArray.forEach(element => {
            Object.assign(jsonData, element)
        })

        return jsonData
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = parse