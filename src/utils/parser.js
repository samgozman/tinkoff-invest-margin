const got = require('got')
const cheerio = require('cheerio')

const url = 'https://www.tinkoff.ru/invest/margin/equities/'

const parse  = async () => {
    try {
        const response = await got(url)
        
        if(!response.body) throw new Error('Parsed body is undefined')

        const $ = cheerio.load(response.body)
        const table = $('table').first().find('tbody').first().find('tr')

        var tableArray = Array.prototype.map.call(table, (tr) => {
            return $(tr).find('td:nth-of-type(1) span div ').text()
        })

        return tableArray
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = parse