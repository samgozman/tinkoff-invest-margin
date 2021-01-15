const searchForm = document.querySelector('form')
const tickersHighlight = document.querySelector('#tickers-highlight')
const searchTicker = document.querySelector('#search')
const errorMessage = document.querySelector('#error-message')

searchForm.addEventListener('submit', (e) => {
    // Prevent from refreshing the browser once form submited 
    e.preventDefault()
    const ticker = encodeURI(searchTicker.value)

    // client-side request
    fetch('/ticker/' + ticker).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                return errorMessage.textContent = data.error
            }
            errorMessage.textContent = ''
            let tbody = document.querySelector('tbody')
            // Clear table body before inserting new rows
            // Generate table view
            tbody.innerHTML = ''
            for (let element of data) {
                let row = tbody.insertRow()
                for (key in element) {
                    let cell = row.insertCell()
                    let text = document.createTextNode(element[key])
                    cell.appendChild(text)
                }
            }

        })
    })

})

// Insert example
tickersHighlight.addEventListener('click', () => {
     searchTicker.value = tickersHighlight.innerHTML
})