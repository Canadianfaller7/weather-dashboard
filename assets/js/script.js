
const appID = 'a61b36fe8c520107f169f4a01a144e8b';

// this is the function to see if our city is a place and will also get it's geo coordinents 
const forecastSearch = async search => {
    const getGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appID=${appID}`;
    let weatherQuery;
    // getting the api info and parsing it
    await fetch(getGeo)
    .then(res => res.json())
    .then(result => {
        weatherQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${result[0].lat}&lon=${result[0].lon}&appID=${appID}&units=imperial`;
    })
    .catch(err => {
        alert('Could not find a city with that name! Please try again')
    })
    // if the information is correct 
    if(weatherQuery){
        await fetch(weatherQuery)
        .then(res => res.json())
        .then(result => {
            // pass the results and search param into our functions
            todayForecast(result, search);
            fiveDayForecast(result, search);
        })
        .catch(err => console.log(err));
    }
}

// getting the information for current day forcast based on the info that got parsed earlier in the forecastSearch function
const todayForecast = async (data, city) => {
    const current = data.current;
    const date = new Date(current.dt * 1000).toLocaleDateString('en-US');
    const getIcon = current.weather[0].icon;
    const icon = `https://openweathermap.org/img/wn/${getIcon}.png`;

    // making html elements to add the info for our weather
    const currentHtml = `<h1 class=cap-letter>${city} (${date}) <img src='${icon}'></h1>
                        <p>Temp: ${Math.floor(current.temp)}°F</p>
                        <p>Humidity: ${current.humidity}%</p>
                        <p>Wind Speed: ${current.wind_speed} MPH</p>`;

    $('#today-content').html('');
    // showing our todays forecast block
    $('#todays-forecast').css("display", "block")
    // appending currentHtml to display on screen
    $('#today-content').append(currentHtml);
    // adding the city searched to our local storage
    addToSearchHistory(city);
}

// doing the same thing as above, but for 5 days
const fiveDayForecast = (data, city) => {
    const daily = data.daily;

    $('#forecast-container').html('');

    daily.forEach((day, index) => {
        if(index < 5){

            const i = daily[index];
            const iIcon = i.weather[0].icon;
            const icon = `http://openweathermap.org/img/wn/${iIcon}.png`;
            const date = new Date(i.dt * 1000).toLocaleDateString('en-US');
            const fiveDayWeather = `<div class='day-forecast'>
                                <h3>${date}</h3>
                                <img src='${icon}'></img>
                                <p>Temperature: ${Math.floor(i.temp.day)}°F</p>
                                <p>Wind Speed: ${i.wind_speed} MPH</p>
                                <p>Humidity: ${i.humidity}%</p>
                            </div>`;
            $('#forecast-container').append(fiveDayWeather);
        }
    });
}

