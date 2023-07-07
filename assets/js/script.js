
const appID = 'a61b36fe8c520107f169f4a01a144e8b';

/*let monthDate = dayjs().month() + 1
let dayDate = dayjs().date() 
let yearDate = dayjs().year();

let dateToday = `${monthDate}/${dayDate}/${yearDate}`
console.log(dateToday);
*/

// this is the function to see if our city is a place and will also get it's geo coordinates 
const forecastSearch = async search => {
    try {
        const getGeo = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${appID}&units=imperial`;
        
        let weatherQuery;
        let fiveDayWeatherQuery;    
        // getting the api info and parsing it for our forecast
        const res = await fetch(getGeo);
        const searchData = await res.json();

        const lat = searchData.coord.lat;
        const lon = searchData.coord.lon;
        console.log(`seachData ->`, searchData);

        weatherQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appID=${appID}&units=imperial`
        
        fiveDayWeatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appID}&units=imperial`;
        
        // if the information is correct 
        if(weatherQuery){
            const res = await fetch(weatherQuery);
            const data = await res.json();
            todayForecast(data, search);
        }
        if(fiveDayWeatherQuery){
            const res = await fetch(fiveDayWeatherQuery);
            const data = await res.json();
            fiveDayForecast(data);
        }
    }
    catch(err){
        console.log(err);
    }
}

// getting the information for current day forecast based on the info that got parsed earlier in the forecastSearch function
const todayForecast = (todayData, city) => {
    try {
        const current = todayData;
        console.log("todayData", todayData);
        const date = new Date(current.dt * 1000);
        const currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const getIcon = current.weather[0].icon;
        const icon = `https://openweathermap.org/img/wn/${getIcon}.png`;
        const currentTemp = current.main
        
        // making html elements to add the info for our weather
        const currentHtml = 
                            `<h3 class=cap-letter>${city} (${currentDate}) <img src='${icon}'></h3>
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
    catch (err) {
        console.log(err("Unable to get current weather information at this moment."))
    };
}

// doing the same thing as above, but for 5 days and using a different api call
const fiveDayForecast = (data) => {
    try {  
        const daily = data.list.filter(reading => reading.dt_txt.includes("15:00:00"));
        console.log(`fiveDayForecastData ->`, data);
    
        $('#forecast-container').html('');
    
        daily.forEach(index => {
            if (index) {
                const i = index;
                console.log("i ->", i);
                const iIcon = i.weather[0].icon;
                const icon = `http://openweathermap.org/img/wn/${iIcon}.png`;
                const date = new Date(i.dt * 1000);
                const fiveDayDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                const fiveDayWeather = 
                                    `<div class='day-forecast'>
                                    <h3>${fiveDayDate}</h3>
                                    <img src='${icon}'></img>
                                    <p>Temp: ${Math.floor(i.main.temp)}°F</p>
                                    <p>Low: ${Math.floor(i.main.temp_min)}°F</p>
                                    <p>High: ${Math.floor(i.main.temp_max)}°F</p>
                                    <p>Wind Speed: ${i.wind_speed} MPH</p>
                                    <p>Humidity: ${i.main.humidity}%</p>
                                </div>`;
                $('#forecast-container').append(fiveDayWeather);
            }
        });
    } catch (err) {
        console.log(`Unable to get forecast information at this moment due to ${err.stack}`)
    }
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


