const searchForm = document.querySelector('form')
const searchTicker = document.querySelector('#search')
const errorMessage = document.querySelector('#error-message')

searchForm.addEventListener('submit', (e) => {
    // Prevent from refreshing the browser once form submited 
    e.preventDefault()
    const ticker = searchTicker.value

    errorMessage.textContent = 'Loading...'

    // client-side request
    fetch('/ticker/' + ticker).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                errorMessage.textContent = data.error
            } else {
                //TODO: generate table view
                errorMessage.textContent = data.name
            }
        })
    })

})