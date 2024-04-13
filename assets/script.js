const weatherAPIKey = '511954d1c4cc056059eabc45e69ef6f6'
const city = 'london'
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;

const weatherSearch = function(){
    fetch(queryURL)
    .then (function (response){
        if (response.ok){
            response.json()
            .then (function (data){
                console.log(data)
            })
        } else {
            alert(`Error:${response.statusText}`);
          }
    })
}

weatherSearch()