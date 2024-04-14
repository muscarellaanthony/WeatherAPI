const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6';
const currentWeather = document.getElementById('currentWeather');
const cityInput = document.getElementById('searchInput');
const weatherElement = document.getElementById('currentWeather');
const forecastElement = document.getElementById('futureWeather')
const searchButton = document.getElementById('searchButton');
const subtitle = document.getElementById('subtitle')
const searchHistoryElement = document.getElementById('searchHistory')
let pastCities = JSON.parse(localStorage.getItem('cities')) || [];

const formSubmitHandler = function (event) {
    event.preventDefault();

    const city = capitalizeCity()

    if (city) {
        weatherSearch(city);


        cityInput.value = '';
    } else {
        alert('Please enter city.');
    }
};



// function to call api and retrieve data
const weatherSearch = function (city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;
    // fetch api
    fetch(queryURL)
        .then(function (response) {
            // check to see the that the city was found
            if (response.ok) {
                clearDiv();
                subtitleDisplay();
                pastCities.push(city);
                localStorage.setItem('cities',(JSON.stringify(pastCities)))
                searchHistory()
                //parse the data
                response.json()
                    .then(function (data) {
                        console.log(data)
                        // send the date to the display function
                        displayWeather(data)
                        forecastSearch(city)
                    })
            } else {
                // send error alers if response failed
                alert(`Error: ${response.statusText}`);
            }
        })
}

const displayWeather = function (data) {
    const cityNameEl = document.createElement('h2');
    const cityTempEl = document.createElement('h3');
    const cityWindEl = document.createElement('h3');
    const cityHumidityEl = document.createElement('h3');
    const date = dayjs().format('MM/DD/YYYY');
    const icon = weatherIcon(data);

    cityNameEl.textContent = `${data.name} ${date} ${icon}`;
    const cityTemp = (data.main.temp - 273.15) * (9 / 5) + 32;
    cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} F`;
    cityWindEl.textContent = `Wind: ${data.wind.speed} MPH`;
    cityHumidityEl.textContent = `Humidity: ${data.main.humidity} %`;

    weatherElement.appendChild(cityNameEl);
    weatherElement.appendChild(cityTempEl);
    weatherElement.appendChild(cityWindEl);
    weatherElement.appendChild(cityHumidityEl);


}

const forecastSearch = function (city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}`;

    fetch(queryURL)
        .then(function (response) {
            // check to see the response returned successfully
            if (response.ok) {
                //parse the data
                response.json()
                    .then(function (data) {
                        console.log(data)
                        // send the data to the display function
                        displayForecast(data)
                    })
            } else {
                // send error alers if response failed
                alert(`Error: ${response.statusText}`);
            }
        })

}

const displayForecast = function (data) {
    for (let i = 1; i <= 5; i++) {
        const forecastCard = document.createElement('div')
        forecastCard.setAttribute('id', 'card')

        const cityDateEl = document.createElement('h4')
        const iconEl = document.createElement('h5')
        const cityTempEl = document.createElement('h5')
        const cityWindEl = document.createElement('h5')
        const cityHumidityEl = document.createElement('h5')

        const date = forecastDate(i)
        const icon = forecastIcon(data, i)

        cityDateEl.textContent = `${date}`;
        iconEl.textContent = icon;
        const cityTemp = (data.list[i].main.temp - 273.15) * (9 / 5) + 32;
        cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} F`;
        cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        forecastCard.appendChild(cityDateEl);
        forecastCard.appendChild(iconEl)
        forecastCard.appendChild(cityTempEl);
        forecastCard.appendChild(cityWindEl);
        forecastCard.appendChild(cityHumidityEl);
        forecastElement.appendChild(forecastCard);
    }
}

const forecastDate = function (i) {
    let today = dayjs();
    let forecastDay = today.add(i, 'day').format('MM/DD/YYYY');
    return forecastDay;
}

const weatherIcon = function (data) {
    if (data.weather[0].icon === '03d' || data.weather[0].icon === '03n' || data.weather[0].icon === '04d' || data.weather[0].icon === '04n') {
        return '☁️'
    } else if (data.weather[0].icon === '01d' || data.weather[0].icon === '02d') {
        return '☀️'
    } else if (data.weather[0].icon === '01n' || data.weather[0].icon === '02n') {
        return '🌑'
    } else if (data.weather[0].icon === '10d' || data.weather[0].icon === '10n' || data.weather[0].icon === '09d' || data.weather[0].icon === '09n') {
        return '🌧️'
    } else if (data.weather[0].icon === '11n' || data.weather[0].icon === '11d') {
        return '⛈️'
    } else if (data.weather[0].icon === '13n' || data.weather[0].icon === '13d') {
        return '❄️'
    } else if (data.weather[0].icon === '50n' || data.weather[0].icon === '50d') {
        return '🌫️'
    } else {
        return '❔'
    }

}

const forecastIcon = function (data, i) {
    if (data.list[i].weather[0].icon === '03d' || data.list[i].weather[0].icon === '03n' || data.list[i].weather[0].icon === '04d' || data.list[i].weather[0].icon === '04n') {
        return '☁️'
    } else if (data.list[i].weather[0].icon === '01d' || data.list[i].weather[0].icon === '02d') {
        return '☀️'
    } else if (data.list[i].weather[0].icon === '01n' || data.list[i].weather[0].icon === '02n') {
        return '🌑'
    } else if (data.list[i].weather[0].icon === '10d' || data.list[i].weather[0].icon === '10n' || data.list[i].weather[0].icon === '09d' || data.list[i].weather[0].icon === '09n') {
        return '🌧️'
    } else if (data.list[i].weather[0].icon === '11n' || data.list[i].weather[0].icon === '11d') {
        return '⛈️'
    } else if (data.list[i].weather[0].icon === '13n' || data.list[i].weather[0].icon === '13d') {
        return '❄️'
    } else if (data.list[i].weather[0].icon === '50n' || data.list[i].weather[0].icon === '50d') {
        return '🌫️'
    } else {
        return '❔'
    }
}

const clearDiv = function () {
    weatherElement.innerHTML = ''
    forecastElement.innerHTML = ''

}

const subtitleDisplay = function(){
    subtitle.style.display = 'block'
    currentWeather.style.border = 'solid black 1px'
}

const searchHistory = function(){
    searchHistoryElement.innerHTML = '';
    for(const city of pastCities){
        historyCard = document.createElement('button')
        historyCard.textContent = city
        historyCard.setAttribute('id','searchCard')
        historyCard.setAttribute('data-content', city)
        searchHistoryElement.appendChild(historyCard)
    }
}

const capitalizeCity = function(){
    const city = cityInput.value.trim();
    const firstLetter = city.charAt(0).toUpperCase();
    const remainingLetters = city.slice(1);
    const capitalCity = firstLetter + remainingLetters;
    return capitalCity;
}

searchHistory()

searchButton.addEventListener('click', formSubmitHandler)

