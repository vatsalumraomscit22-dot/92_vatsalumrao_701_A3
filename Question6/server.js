const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Question 6 Weather API is running");
});

app.get("/api/weather/:city", async (req, res) => {
    const city = req.params.city;

    try {
        const locationResponse = await axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            {
                params: {
                    name: city,
                    count: 1,
                    language: "en",
                    format: "json"
                }
            }
        );

        if (!locationResponse.data.results) {
            return res.status(404).json({
                message: "City not found"
            });
        }

        const location = locationResponse.data.results[0];

        const weatherResponse = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
                    timezone: "auto"
                }
            }
        );

        res.json({
            city: location.name,
            country: location.country,
            temperature: weatherResponse.data.current.temperature_2m,
            humidity: weatherResponse.data.current.relative_humidity_2m,
            windSpeed: weatherResponse.data.current.wind_speed_10m
        });
    } catch (error) {
        console.log("Weather API Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch weather data"
        });
    }
});

app.listen(5001, () => {
    console.log("Server running at http://localhost:5001");
});