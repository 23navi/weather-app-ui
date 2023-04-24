const request = require("postman-request");
require('dotenv').config()
// console.log(process.env) 


function forecast(lat, long, callback) {
  const URL =
    "http://api.weatherstack.com/current?access_key="+process.env.WEATHER_KEY+"&query=" +
    lat +
    "," +
    long;
  request({ url: URL, json: true }, (error, response) => {
    if (error) {
      callback("Sorry network error", undefined);
      console.log("network error");
    } else if (response.body.error) {
      callback("Unable to find the location", undefined);
      console.log(response.body.error);
    } else {
      const data = response.body;
      const forecastData = {
        currentTemp: data.current.temperature,
        currentStatus: data.current.weather_descriptions[0],
        isDay: data.current.is_day,
        localtime: data.location.localtime,
      };
      console.log(forecastData);

      callback(
        undefined,
        `Current temperature is ${data.current.temperature}\u00B0C but it feels like ${data.current.feelslike}\u00B0C`,
        forecastData
      );
    }
  });
}

module.exports = forecast;
