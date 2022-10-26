
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
        window.alert('Could not find a city with that name! Please try again')
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

