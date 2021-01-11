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
            return {
                name: $(tr).find('td:nth-of-type(1) a span div div:nth-of-type(1)').text(),
                ticker: $(tr).find('td:nth-of-type(1) a span div div:nth-of-type(2)').text().split(',')[0],
                isin: $(tr).find('td:nth-of-type(2) a span div div:nth-of-type(1)').text(),
                short: $(tr).find('td:nth-of-type(3) a span div:nth-of-type(1)').text() === 'Доступен' ? true : false,
                longRisk: $(tr).find('td:nth-of-type(4) a span div:nth-of-type(1)').text().split('/')[0].trim(),
                shortRisk: $(tr).find('td:nth-of-type(4) a span div:nth-of-type(1)').text().split('/')[1].trim()
            }
        })

        return tableArray
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = parse