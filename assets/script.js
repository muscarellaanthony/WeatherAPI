const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6'
const city = 'london'
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;

// function to call api and retrieve data
const weatherSearch = function () {
    // fetch api
    fetch(queryURL)
        .then(function (response) {
            // check to see the respons returned successfully
            if (response.ok) {
                //parse the data
                response.json()
                    .then(function (data) {
                        console.log(data)
                        // send the date to the display function
                        displayData(data)
                    })
            } else {
                // send error alers if response failed
                alert(`Error:${response.statusText}`);
            }
        })
}

const displayData = function (data){
    
}



weatherSearch()