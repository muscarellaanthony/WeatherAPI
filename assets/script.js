const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6';
const currentWeather = document.getElementById('currentWeather');
const cityInput = document.getElementById('searchInput');
const weatherElement = document.getElementById('currentWeather');
const forecastElement = document.getElementById('futureWeather')
const searchButton = document.getElementById('searchButton');
const subtitle = document.getElementById('subtitle');
const searchHistoryElement = document.getElementById('searchHistory');
let pastCities = JSON.parse(localStorage.getItem('cities')) || [];

//function handle submissions in the search form
const formSubmitHandler = function (event) {
    //prevent the page from refreshing after form submission
    event.preventDefault();

    //capitalize the city collected form the form input
    const city = capitalizeCity()

    //city value isn't empty, aka if city variable has a value
    if (city) {
        //call weather search function and pass it the city name
        weatherSearch(city);

        // clears search bar
        cityInput.value = '';
    //if city vairable is empty send an alert to the user to complete the form   
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
                pastCitiesArrayHandler(city);
                localStorage.setItem('cities',(JSON.stringify(pastCities)))
                searchHistory()
                //parse the data
                response.json()
                    .then(function (data) {
                        console.log(data)
                        // send the data to the display function
                        displayWeather(data)
                        forecastSearch(city)
                    })
            } else {
                // send error alers if response failed
                alert(`Error: ${response.statusText}`);
            }
        })
}

// adds elements to html and displays weather info
const displayWeather = function (data) {
    // create html elements
    const cityNameEl = document.createElement('h2');
    const cityTempEl = document.createElement('h3');
    const cityWindEl = document.createElement('h3');
    const cityHumidityEl = document.createElement('h3');
    //todays date
    const date = dayjs().format('MM/DD/YYYY');
    //retrieve weather icon
    const icon = weatherIcon(data);

    // give text to each of the new elements
    cityNameEl.textContent = `${data.name} ${date} ${icon}`;
    //convert temp from kelvin to farenheight
    const cityTemp = (data.main.temp - 273.15) * (9 / 5) + 32;
    cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F`;
    cityWindEl.textContent = `Wind: ${data.wind.speed} MPH`;
    cityHumidityEl.textContent = `Humidity: ${data.main.humidity} %`;

    //append elements to html
    weatherElement.appendChild(cityNameEl);
    weatherElement.appendChild(cityTempEl);
    weatherElement.appendChild(cityWindEl);
    weatherElement.appendChild(cityHumidityEl);
}

// fetch forecast data 
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

// adds elements to html that display the 5 day forcast info
const displayForecast = function (data) {
    // loop though the 5 days listed in the api data
    for (let i = 0; i <= 4; i++) {
        // create a div for each card
        const forecastCard = document.createElement('div')
        //add attributes to style with in css
        forecastCard.setAttribute('id', 'card')

        // create elements for each card
        const cityDateEl = document.createElement('h4')
        const iconEl = document.createElement('h5')
        const cityTempEl = document.createElement('h5')
        const cityWindEl = document.createElement('h5')
        const cityHumidityEl = document.createElement('h5')

        // get date for each day
        const date = forecastDate(i)
        // retrieve weather icon for each day
        const icon = forecastIcon(data, i)

        //add text content to each element 
        cityDateEl.textContent = `${date}`;
        iconEl.textContent = icon;
        //convert temp from kelvin to farenheight
        const cityTemp = (data.list[i].main.temp - 273.15) * (9 / 5) + 32;
        cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F`;
        cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        //append all elements to the card
        forecastCard.appendChild(cityDateEl);
        forecastCard.appendChild(iconEl)
        forecastCard.appendChild(cityTempEl);
        forecastCard.appendChild(cityWindEl);
        forecastCard.appendChild(cityHumidityEl);
        //append the card to the html div
        forecastElement.appendChild(forecastCard);
    }
}

//function to retrieve future dates for each forecasted day
const forecastDate = function (i) {
    //initlaize with todays date 
    let today = dayjs();
    //add i amount of days to todays date, add one because i starts at 0. i is given from diplayForecast funtion iterations.
    let forecastDay = today.add(i + 1, 'day').format('MM/DD/YYYY');
    return forecastDay;
}

//function designed to return a weather icon for different types of weather, uses and icon code found in api data
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

//same function as above but used specifically for forecast api
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

// this function clears the divs holding current weather and forecast information
const clearDiv = function () {
    weatherElement.innerHTML = ''
    forecastElement.innerHTML = ''

}

//this function makes the subtitle visible on the page after the user saerches for a city
//specifially the "5 day forecast" header/subtitle
const subtitleDisplay = function(){
    subtitle.style.display = 'block'
    currentWeather.style.border = 'solid black 1px'
}

//this function creates a button for each city stored in the pastCities array
const searchHistory = function(){
    //clear the area before running the function to prevent duplicates
    searchHistoryElement.innerHTML = '';
    //iterate through every item city in the array
    for(const city of pastCities){
        //create button element 
        historyCard = document.createElement('button')
        //give it the city name to print into text
        historyCard.textContent = city
        //give it attributes for styling
        historyCard.setAttribute('id','searchCard')
        //add this attribute to help in clicking search buttons later, set each attribute to the city name
        historyCard.setAttribute('data-content', city)
        //append the button to the html
        searchHistoryElement.appendChild(historyCard)
    }
}

//function to capitalize first letter of each city collected by the form.... extra credit??? :)
const capitalizeCity = function(){
    //set city to form input value
    const city = cityInput.value.trim();
    //set firstLetter to capital version of the first letter in the city name
    const firstLetter = city.charAt(0).toUpperCase();
    //store the remainine letters in a variable
    const remainingLetters = city.slice(1);
    //paste firstLetter (now capitalized) and paste it to the reamaining letters
    const capitalCity = firstLetter + remainingLetters;
    //return new capitalized name
    return capitalCity;
}

//function to handle the past searched buttons 
const searchHistoryHandler = function(event){
    //retrieve data-content attribute after the click event, attribute value should be the city name
    const city = event.target.getAttribute('data-content')
    //if the city variable holds a value (if the data-content was recieved), run the weather search function with the city name
    if (city){
        weatherSearch(city)
    }
}

//function to manage new entries into the city search array
const pastCitiesArrayHandler = function(city){
    //if the city passed into the funtion is found in the array, return and exit the funtion without pushing the value to the array
    if (pastCities.includes(city)){
        return
    //if the city isn't in the array, add it
    } else{
        pastCities.push(city)
    }
}

//call this function immediately to display the users past searches
searchHistory()

//listening for user to click the search button
searchButton.addEventListener('click', formSubmitHandler)
//listening for user to click a button in the search history div
searchHistoryElement.addEventListener('click', searchHistoryHandler)

