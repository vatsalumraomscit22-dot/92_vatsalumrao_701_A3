import { useState } from "react";
import axios from "axios";

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [message, setMessage] = useState("");

    const getWeather = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(
                `http://localhost:5001/api/weather/${city}`
            );

            setWeather(response.data);
            setMessage("");
        } catch (error) {
            setWeather(null);
            setMessage(
                error.response?.data?.message || "Unable to fetch weather"
            );
        }
    };

    return (
        <div>
            <h1>Weather Utility</h1>

            <form onSubmit={getWeather}>
                <label>Enter City:</label>
                <br />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">Get Weather</button>
            </form>

            <br />

            {message && <p>{message}</p>}

            {weather && (
                <div>
                    <h2>Weather Details</h2>
                    <p>City: {weather.city}</p>
                    <p>Country: {weather.country}</p>
                    <p>Temperature: {weather.temperature} °C</p>
                    <p>Humidity: {weather.humidity} %</p>
                    <p>Wind Speed: {weather.windSpeed} km/h</p>
                </div>
            )}
        </div>
    );
}

export default App;