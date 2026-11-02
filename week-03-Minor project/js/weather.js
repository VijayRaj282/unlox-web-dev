const GEOCODING_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
    "https://api.open-meteo.com/v1/forecast";

// Weather codes returned by Open-Meteo
const weatherDescriptions = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Heavy drizzle", "🌧️"],
    61: ["Slight rain", "🌦️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    71: ["Slight snow", "🌨️"],
    73: ["Moderate snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Heavy rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

// Initialize the Weather App
export function initWeatherApp() {
    const form = document.querySelector("#weather-form");
    const cityInput = document.querySelector("#city-input");
    const message = document.querySelector("#weather-message");
    const result = document.querySelector("#weather-result");
    const button = form.querySelector("button");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const city = cityInput.value.trim();

        if (!city) {
            showMessage(
                message,
                "Please enter a city name.",
                "error"
            );
            return;
        }

        button.disabled = true;
        button.textContent = "Searching...";

        result.hidden = true;

        showMessage(
            message,
            "Fetching the latest weather..."
        );

        try {
            // Step 1: Find the city's latitude and longitude
            const locationResponse = await fetch(
                `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );

            if (!locationResponse.ok) {
                throw new Error(
                    "Unable to search for this city."
                );
            }

            const locationData = await locationResponse.json();

            const location = locationData.results?.[0];

            if (!location) {
                throw new Error(
                    "City not found. Please check the spelling."
                );
            }

            // Step 2: Fetch weather using the coordinates
            const parameters = new URLSearchParams({
                latitude: location.latitude,
                longitude: location.longitude,
                current:
                    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
                timezone: "auto"
            });

            const weatherResponse = await fetch(
                `${WEATHER_URL}?${parameters}`
            );

            if (!weatherResponse.ok) {
                throw new Error(
                    "Unable to fetch weather data. Try again."
                );
            }

            const weatherData = await weatherResponse.json();

            // Step 3: Display the weather
            displayWeather(
                location,
                weatherData.current,
                result
            );

            showMessage(
                message,
                "Weather data loaded successfully.",
                "success"
            );

            result.hidden = false;

        } catch (error) {
            showMessage(
                message,
                error.message ||
                    "Something went wrong. Please try again.",
                "error"
            );

        } finally {
            button.disabled = false;
            button.textContent = "Find Weather ↗";
        }
    });
}

// Display weather information dynamically
function displayWeather(location, current, container) {
    const [description, icon] =
        weatherDescriptions[current.weather_code] ??
        ["Conditions unavailable", "🌍"];

    const region = [
        location.admin1,
        location.country
    ].filter(Boolean).join(", ");

    container.innerHTML = `
        <div class="weather-main">
            <p class="weather-location">
                ${escapeHTML(location.name)},
                ${escapeHTML(region)}
            </p>

            <div class="temperature">
                ${Math.round(current.temperature_2m)}°C
            </div>

            <p class="weather-description">
                <span class="weather-icon">${icon}</span>
                ${description}
            </p>

            <p class="weather-location">
                Feels like
                ${Math.round(current.apparent_temperature)}°C
            </p>
        </div>

        <div class="weather-stats">

            <div class="stat">
                <span class="stat-label">Humidity</span>
                <span class="stat-value">
                    ${current.relative_humidity_2m}%
                </span>
            </div>

            <div class="stat">
                <span class="stat-label">Wind Speed</span>
                <span class="stat-value">
                    ${current.wind_speed_10m} km/h
                </span>
            </div>

            <div class="stat">
                <span class="stat-label">Precipitation</span>
                <span class="stat-value">
                    ${current.precipitation} mm
                </span>
            </div>

            <div class="stat">
                <span class="stat-label">Time of Day</span>
                <span class="stat-value">
                    ${current.is_day ? "Day ☀️" : "Night 🌙"}
                </span>
            </div>

        </div>
    `;
}

// Display messages and errors
function showMessage(element, text, type = "") {
    element.textContent = text;
    element.className = `message ${type}`.trim();
}

// Prevent HTML injection through the city name
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}