/** Updates the current date and day in the header. */
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const formattedDate = now.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  document.getElementById("currentDay").innerHTML = days[now.getDay()];
  document.getElementById("currentDate").innerHTML = formattedDate;
}
updateDate();

// --- API Configuration / We will use this information in the next session, just make sure to create your account
//  and activate your API key - This is the website : https://openweathermap.org/ ---
const API_KEY = "4927b5847997b083a8de9be165de6025"; // IMPORTANT: Replace with your key!
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


// --- DOM Element References ---
const cityInputElement = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const cityNameElement = document.getElementById("city-name");
const weatherIconElement = document.getElementById("weather-emoji");
const temperatureElement = document.querySelector(".temperature");
const conditionElement = document.querySelector(".condition");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");


/** Displays a message box with dynamic styling. */
function showMessage(message, type = "info") {

  messageText.innerHTML = message;
  const styles =
    {
      success: { bg: "#1a532e", border: "#3cba54", text: "#c8e6c9" },
      error: { bg: "#5c1818", border: "#d93025", text: "#fca7a7" },
      warning: { bg: "#5e4d00", border: "#fbbc05", text: "#ffe082" },
      info: { bg: "#0b3d63", border: "#1a73e8", text: "#b3d4f8" },
    }[type] || styles.info; // Default to info

  messageBox.style.cssText = `
        background-color: ${styles.bg};
        border: 1px solid ${styles.border};
        color: ${styles.text};
        padding: 0.8rem 1.2rem; border-radius: 0.8rem; margin-bottom: 1.5rem;
        text-align: center; width: calc(100% - 20px); font-size: 0.95rem;
        font-weight: 500; transition: all 0.3s ease-in-out;
        margin-left: auto; margin-right: auto;
    `

  messageBox.classList.remove("hidden");
  setTimeout(() => messageBox.classList.add("hidden"), 5000);
}

/** Handles city search input. */
function handleSearch() {
  console.log(123)
  const city = cityInputElement.value.trim();
  if (!city) {
    showMessage("Please enter a city name.", "warning");
    return;
  }
  fetchWeatherFromAPI(city);
}

// --- Event Listeners ---
searchButton.addEventListener("click", handleSearch);
cityInputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});
/** Fetches weater data from OpenWaeterMap API */

async function fetchWeatherFromAPI(city) {
  if(!API_KEY) {
    showMessage(
      "please get your OpenWaeterMaap API Key and replace the placeholder.",
      "error"
    );
    return;
  }
  weatherIconElement.innerHTML = "🤔"// Loading emoji

  try {
    const resp = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    console.log(resp)

    if(!resp.ok) {
      const msg =
      resp.status === 404
      ? `City "${city}" not found.`
      : resp.status === 401
      ? "Invalid API Key."
      : `Error: ${resp.statusText}`;
      showMessage(msg, "error");
      cityNameElement.innerHTML = "Error";
      temperatureElement.innerHTML = "--°C"
      conditionElement.innerHTML = "N/A"
      weatherIconElement.innerHTML = "?"
      return;

    }
    const data = await resp.json();
    console.log(data)
    updatewaetherDisplay(data);
    showMessage(`weather for ${data.name} fetched!`, "success");

  }

  catch(error) {
    console.error("Fetch error", error);
    showMessage("Failled to connect to weater service.", "error");
    cityNameElement.innerHTML = "Error";
      temperatureElement.innerHTML = "--°C";
      conditionElement.innerHTML = "N/A";
      weatherIconElement.innerHTML = "!";

  }
}


/**Updates waetther display with API data using map() and innedHTML */

function updatewaetherDisplay(data) {
  const emojiMap = {
    "01d": "1",
    "01n": "2",
    "02d": "3",
    "02n": "4",
    "03d": "5",
    "03n": "6",
    "04d": "7",
    "04n": "8",
    "09d": "9",
    "09n": "10",
    "10d": "11",
    "10n": "12",
    "11d": "13",
    "11n": "14",
    "13d": "15",
    "13n": "16",
    "50d": "17",
    "50n": "18",

  };
  const weather = data.weather.map((w) => ({
    desc: w.description,
    icon: w.icon,
  }))[0];

  cityNameElement.innerHTML = data.name;
  temperatureElement.innerHTML = `${Math.round(data.main.temp)}°C`;
  conditionElement.innerHTML = weather.desc;
  weatherIconElement.innerHTML = emojimap[weather.icon] || "?";
}

