const path = require("path");
const express = require("express");
const { forwardGeocode, reverseGeocode } = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");

// Setup handlebars engine and views location

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.send("hello");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.get("/help", (req, res) => {
  res.send("about");
});

app.get("/cord", (req, res) => {
  if (!req.query.lon || !req.query.lat) {
    return res.send({
      error: "You must provide lat and lon!",
    });
  }

  reverseGeocode({ lat: req.query.lat, lon: req.query.lon }, (error, name) => {
    if (!error) {
      forecast(
        req.query.lat,
        req.query.lon,
        (error, forecastText, forcastData) => {
          if (error) {
            return res.send({ error });
          }

          return res.send({
            forecast: forecastText,
            forcastData,
            name,
          });
        }
      );
    } else {
      return res.send(error);
    }
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  forwardGeocode(req.query.address, (error, { name, lat, long } = {}) => {
    if (error) {
      return res.send({ error });
    }
    console.log("name:" + name);
    forecast(lat, long, (error, forecastText, forcastData) => {
      console.log("this is runninggggggg");
      if (error) {
        return res.send({ error });
      }
      console.log("ForcastData: " + forcastData);

      res.send({
        forecast: forecastText,
        name,
        forcastData,
        address: req.query.address,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.send("helppp");
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
