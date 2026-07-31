// ===============================
// TinyTale Player v3.0 - Finalized
// ===============================

const title = document.getElementById("episodeTitle");
const info = document.getElementById("episodeInfo");
const player = document.getElementById("videoPlayer");
const story = document.getElementById("storyContent");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const partsContainer = document.getElementById("partsContainer");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const loadingScreen = document.getElementById("loadingScreen");
const playerContainer = document.getElementById("playerContainer");

let sources = {};
let currentList = [];
let currentIndex = 0;
let currentTitle = "";

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "episode";
const id = params.get("id") || "1";

// --- Popup Logic ---
function showPopup() { popup.style.display = "flex"; }
function hidePopup() { popup.style.display = "none"; }
closePopup.onclick = hidePopup;
popup.onclick = (e) => { if (e.target === popup) hidePopup(); };

// --- Loading Logic ---
function showLoading() { loadingScreen.style.display = "flex"; playerContainer.style.display = "none"; }
function hideLoading() { loadingScreen.style.display = "none"; playerContainer.style.display = "block"; }

// --- Fetching Data ---
async function loadSources() {
    const response = await fetch("episodes.json");
    const json = await response.json();
    sources = json.sources;
}

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

function loadStory(text) {
    if (!text || text.trim() === "") {
        story.innerHTML = "<h3>Coming Soon...</h3>";
        return;
    }
    story.innerHTML = text.replace(/\n/g, "<br>");
}

// --- Load Trailer ---
async function loadTrailer() {
    const json = await fetchJSON(sources.trailers);
    const trailer = json[id];

    if (!trailer) {
        title.textContent = "Trailer Not Found";
        hideLoading();
        return;
    }

    currentTitle = trailer.title;
    currentList = [{
        title: trailer.title,
        video: trailer.video,
        story: trailer.story
    }];

    createButtons();

    // Button to link to Episode 1
    const ep1Btn = document.createElement("button");
    ep1Btn.className = "partButton";
    ep1Btn.textContent = "Watch Episode 1";
    ep1Btn.style.backgroundColor = "#d4af37";
    ep1Btn.onclick = () => { window.location.href = "index.html?mode=episode&id=1"; };
    partsContainer.appendChild(ep1Btn);

    loadPart(0);
}

// --- Load Episode ---
async function loadEpisode() {
    const key = "episode" + id;
    if (!sources[key]) {
        title.textContent = "Episode Not Found";
        hideLoading();
        return;
    }
    const json = await fetchJSON(sources[key]);
    currentTitle = json.title;
    currentList = json.parts;
    createButtons();
    loadPart(0);
}

// --- Load Current Part ---
function loadPart(index) {
    currentIndex = index;
    const part = currentList[index];
    title.textContent = currentTitle;
    info.textContent = mode === "trailer" ? "Trailer" : part.title;

    if (part.video && part.video.trim() !== "") {
        player.style.display = "block";
        player.src = part.video;
    } else {
        player.style.display = "none";
        player.src = "";
    }

    loadStory(part.story);

    document.querySelectorAll(".partButton").forEach(btn => btn.classList.remove("active"));
    const active = document.getElementById("part-" + index);
    if (active) active.classList.add("active");

    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === currentList.length - 1);
    hideLoading();
}

// --- Create Buttons ---
function createButtons() {
    partsContainer.innerHTML = "";
    currentList.forEach((part, index) => {
        const button = document.createElement("button");
        button.className = "partButton";
        button.id = "part-" + index;
        button.textContent = part.title;
        button.onclick = () => {
            if (!part.video) { showPopup(); return; }
            loadPart(index);
        };
        partsContainer.appendChild(button);
    });
}

// --- Navigation ---
prevBtn.onclick = () => { if (currentIndex > 0) loadPart(currentIndex - 1); };
nextBtn.onclick = () => { if (currentIndex < currentList.length - 1) loadPart(currentIndex + 1); };

// --- Startup ---
async function start() {
    showLoading();
    try {
        await loadSources();
        if (mode === "trailer") { await loadTrailer(); } 
        else { await loadEpisode(); }
    } catch (error) {
        console.error(error);
        title.textContent = "Loading Failed";
        story.innerHTML = "<h3>Unable to load content.</h3>";
        hideLoading();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

start();
