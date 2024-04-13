const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6';
const currentWeather = document.getElementById('currentWeather');
const cityInput = document.getElementById('searchInput');
const weatherElement = document.getElementById('weatherDisplay');
const searchButton = document.getElementById('searchButton');

const formSubmitHandler = function (event) {
    event.preventDefault();
  
    const city = cityInput.value.trim();
  
    if (city) {
      weatherSearch(city);
  
      weatherElement.textContent = '';
      cityInput.value = '';
    } else {
      alert('Please enter city.');
    }
  };



// function to call api and retrieve data
const weatherSearch = function (city) {
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;
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
                        displayWeather(data)
                    })
            } else {
                // send error alers if response failed
                alert(`Error: ${response.statusText}`);
            }
        })
}

const displayWeather = function (data){

}

searchButton.addEventListener('click', formSubmitHandler)