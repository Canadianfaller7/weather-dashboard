
const appID = 'a61b36fe8c520107f169f4a01a144e8b';

let monthDate = dayjs().month() + 1
let dayDate = dayjs().date() 
let yearDate = dayjs().year();

let dateToday = `${monthDate}/${dayDate}/${yearDate}`
console.log(dateToday);


// this is the function to see if our city is a place and will also get it's geo coordinates 
const forecastSearch = async search => {
    try {
        const getGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appID=${appID}`;
        let weatherQuery;
        let fiveDayWeatherQuery;    
        // getting the api info and parsing it for our forecast
        const res = await fetch(getGeo);
        const data = await res.json();
        weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appID=${appID}&units=imperial`
    
        fiveDayWeatherQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&appid=${appID}&units=imperial`;
        
        // if the information is correct 
        if(weatherQuery){
            const res = await fetch(weatherQuery);
            const data = await res.json();
            todayForecast(data, search);
        }
        if(fiveDayWeatherQuery){
            const res = await fetch(fiveDayWeatherQuery);
            const data = await res.json();
            fiveDayForecast(data, search);
        }
    }
    catch(err){
        console.log(err);
    }
}

// getting the information for current day forecast based on the info that got parsed earlier in the forecastSearch function
const todayForecast =  (data, city) => {
    const current = data.list[0];
    const date = dateToday;
    const getIcon = current.weather[0].icon;
    const icon = `https://openweathermap.org/img/wn/${getIcon}.png`;
    const currentTemp = current.main

    // making html elements to add the info for our weather
    const currentHtml = 
                        `<h3 class=cap-letter>${city} (${date}) <img src='${icon}'></h3>
                        <p>Temp: ${Math.floor(currentTemp.temp)}°F</p>
                        <p>Feels Like: ${Math.floor(currentTemp.feels_like)}°F</p>
                        <p>Low: ${Math.floor(currentTemp.temp_min)}°F</p>
                        <p>Max: ${Math.floor(currentTemp.temp_max)}°F</p>
                        <p>Humidity: ${currentTemp.humidity}%</p>
                        <p>Wind: ${current.wind.speed} MPH</p>`;

    $('#todays-info').html('');
    // showing our todays forecast block
    $('.forecast').css("display", "block")
    // appending currentHtml to display on screen
    $('#todays-info').append(currentHtml);
    // adding the city searched to our local storage
    addToSearchHistory(city);
}

// doing the same thing as above, but for 5 days and using a different api call
const fiveDayForecast = (data, city) => {
    const daily = data.daily;

    $('#forecast-container').html('');

    daily.forEach((day, index) => {
        if(index < 8){
            const i = daily[index];
            const iIcon = i.weather[0].icon;
            const icon = `http://openweathermap.org/img/wn/${iIcon}.png`;
            const dayIncrement =  dayDate + index;
            const date = `${monthDate}/${dayIncrement}/${yearDate}`
            const fiveDayWeather = 
                                `<div class='day-forecast'>
                                <h3>${date}</h3>
                                <img src='${icon}'></img>
                                <p>Temp: ${Math.floor(i.temp.day)}°F</p>
                                <p>Low: ${Math.floor(i.temp.min)}°F</p>
                                <p>High: ${Math.floor(i.temp.max)}°F</p>
                                <p>Wind Speed: ${i.wind_speed} MPH</p>
                                <p>Humidity: ${i.humidity}%</p>
                            </div>`;
            $('#forecast-container').append(fiveDayWeather);
        }
    });
}

/*
  Search History Functionality
*/

// checking the history and adding the new searched city
const addToSearchHistory = city => {
    let history = getSearchHistory();
    let newHist = [];

    if(history){
        newHist = history.filter(item =>{
            return item !== city
        })
    }
    // adding new city to the front of the array
    newHist.unshift(city);
    // if the new history gets bigger than 10 remove the last search stored
    if(newHist.length > 7) newHist.pop();

    localStorage.setItem('history', JSON.stringify(newHist));

    historyButton();
}
// getting the history or array from local storage and returning it
const getSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    return history;
}

const searchSubmitHandler = () => {
    const search = $('#search-input').val();
    
    // forecastSearch(search);
    if(search){
        forecastSearch(search);
        $('#search-input').val('')
    }
}

// button to display searched cities and show them as a button to be searched again
const historyButton = () => {
    const history = JSON.parse(localStorage.getItem('history'));

    $('#history-container').html('');

    if(history){
        history.forEach((item) => {
            const html = `<button class='hist-btn my-btn btn m-2 col-10 col-md-5 cap-letter'>${item}</button>`;

            $('#history-container').append(html);
        })
    }

    $('.hist-btn').on('click', function(e){
        forecastSearch($(this).html());
    });
}

historyButton();

$('#search-form').submit(function(e){
    e.preventDefault();
    searchSubmitHandler();
});


