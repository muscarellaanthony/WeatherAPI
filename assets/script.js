const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6';
const currentWeather = document.getElementById('currentWeather');
const cityInput = document.getElementById('searchInput');
const weatherElement = document.getElementById('currentWeather');
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
    const cityNameEl = document.createElement('h2')
    const cityTempEl = document.createElement('h3')
    const cityWindEl = document.createElement('h3')
    const cityHumidityEl = document.createElement('h3')

    cityNameEl.textContent = `${data.name} 4/13/2024`;
    const cityTemp = (data.main.temp - 273.15) * (9/5) + 32;
    cityTempEl.textContent = `Temp: ${cityTemp} F`
    cityWindEl.textContent = `Wind: ${data.wind.speed} MPH`
    cityHumidityEl.textContent = `Humidity: ${data.main.humidity} %`

    weatherElement.appendChild(cityNameEl)
    weatherElement.appendChild(cityTempEl)
    weatherElement.appendChild(cityWindEl)
    weatherElement.appendChild(cityHumidityEl)


}
weatherSearch('london')

searchButton.addEventListener('click', formSubmitHandler)