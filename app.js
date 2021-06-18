const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
require('dotenv').config()

const app = express();

app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const apiKey = process.env.api_Key;
    const url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric";

    http.get(url, function (response) {

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            res.render("weather", { city: query, temperature: temp, weather: weatherDescription, imageUrl: imageUrl });
        });
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started successfully at port ${port}.`);
});