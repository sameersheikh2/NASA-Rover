const API_KEY = "BPNOu98BiffUt0A27uy9F9ZhUy20iIZPruVHeOrB";

const apiUrl =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";

const dateInput = document.getElementById("date");
const loadingContainer = document.getElementById("loading-container");
const mainContainer = document.getElementById("main-container");
const photosContainer = document.getElementById("photos");
const loadingText = document.getElementById("loading-text");

// Space-themed loading quotes
const loadingQuotes = [
  "Oh, a shooting star... make a wish! 🌠",
  "Looking beyond the stars... 🌌",
  "Exploring the Red Planet, one photo at a time... 🚀",
  "Scanning the Martian skies — hold on tight! 🌟",
  "Capturing the universe, pixel by pixel... 🔭",
  "Reaching for the stars, loading your Martian dreams... 🪐",
  "Hold on... the cosmos is coming! ✨",
  "Mars is sending postcards — fetching now! 🛰️",
  "Venturing where no rover has ventured before... 🌑",
  "From dust storms to distant craters — Mars awaits! 🔥",
];

document.addEventListener("DOMContentLoaded", () => fetchPhotos());

document.getElementById("filterPhotos").addEventListener("click", fetchPhotos);

function startLoading() {
  loadingContainer.classList.remove("hidden");
  loadingText.classList.remove("hidden");

  let currentIndex = Math.floor(Math.random() * loadingQuotes.length);
  loadingText.textContent = loadingQuotes[currentIndex];

  quoteInterval = setInterval(function () {
    currentIndex++;
    if (currentIndex >= loadingQuotes.length) currentIndex = 0;
    loadingText.textContent = loadingQuotes[currentIndex];
  }, 1500);
}

function stopLoading() {
  clearInterval(quoteInterval);
  loadingContainer.classList.add("hidden");
  loadingText.classList.add("hidden");
}

async function fetchPhotos() {
  const date = document.getElementById("date").value;
  const sol = document.getElementById("sol").value;
  const camera = document.getElementById("camera").value;

  photosContainer.innerHTML = "";

  let url = `${apiUrl}?api_key=${API_KEY}`;
  if (date) url += `&earth_date=${date}`;
  if (sol) url += `&sol=${sol}`;
  if (camera) url += `&camera=${camera}`;
  if (!date && !sol && !camera) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();

    url += `&earth_date=${year}-${month}-${day}`;
    console.log(url);
  }

  try {
    mainContainer.classList.add("hidden");
    startLoading();
    const response = await fetch(url);
    const data = await response.json();

    if (data.photos.length === 0) {
      photosContainer.innerHTML = "<p>No images found for this query.</p>";
      return;
    }

    data.photos.forEach((photo) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      const span = document.createElement("span");
      img.src = photo.img_src;
      img.alt = "Mars Rover Photo";
      span.innerText = photo.earth_date;
      div.appendChild(img);
      div.appendChild(span);
      photosContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    photosContainer.innerHTML = "<p>Failed to load photos. Try again!</p>";
  } finally {
    stopLoading();
    mainContainer.classList.remove("hidden");
  }
}
