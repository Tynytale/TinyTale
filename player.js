// =============================================================================
// TinyTale Player v4.0 - Full Source Code
// =============================================================================

// --- DOM Elements ---
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

// --- Runtime Global Variables ---
let sources = {};
let currentList = [];
let currentIndex = 0;
let currentTitle = "";

// --- URL Parameter Handling ---
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "episode"; // 'trailer' or 'episode'
const id = params.get("id") || "1";

// =============================================================================
// UI & Loading Handlers
// =============================================================================

function showPopup() {
    popup.style.display = "flex";
}

function hidePopup() {
    popup.style.display = "none";
}

closePopup.onclick = hidePopup;

popup.onclick = (e) => {
    if (e.target === popup) hidePopup();
};

function showLoading() {
    loadingScreen.style.display = "flex";
    playerContainer.style.display = "none";
}

function hideLoading() {
    loadingScreen.style.display = "none";
    playerContainer.style.display = "block";
}

// =============================================================================
// Data Fetching Logic
// =============================================================================

async function loadSources() {
    try {
        const response = await fetch("episodes.json");
        if (!response.ok) throw new Error("episodes.json failed");
        const json = await response.json();
        sources = json.sources;
    } catch (err) {
        console.error("Error loading sources:", err);
    }
}

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch: " + url);
    return await response.json();
}

// =============================================================================
// Trailer & Episode Logic (Parity Fix)
// =============================================================================

async function loadTrailer() {
    try {
        const json = await fetchJSON(sources.trailers);
        const trailerData = json[id];

        if (!trailerData) {
            title.textContent = "Trailer Not Found";
            hideLoading();
            return;
        }

        currentTitle = trailerData.title;
        // Check if trailer has multiple parts, if not wrap in array
        currentList = trailerData.parts || [{
            title: trailerData.title,
            video: trailerData.video,
            story: trailerData.story
        }];

        createButtons();

        // Specific Logic for Trailer: Add "Watch Episode 1" link
        const ep1Btn = document.createElement("button");
        ep1Btn.className = "partButton";
        ep1Btn.textContent = "Watch Episode 1";
        ep1Btn.style.background = "linear-gradient(135deg, #FFD54A, #FFC107)";
        ep1Btn.style.color = "#13231F";
        ep1Btn.onclick = () => { window.location.href = "index.html?mode=episode&id=1"; };
        partsContainer.appendChild(ep1Btn);

        loadPart(0);
    } catch (e) {
        console.error("Error in loadTrailer:", e);
    }
}

async function loadEpisode() {
    try {
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
    } catch (e) {
        console.error("Error in loadEpisode:", e);
    }
}

// =============================================================================
// Core Player Logic
// =============================================================================

function loadPart(index) {
    currentIndex = index;
    const part = currentList[index];
    
    // Update Title
    title.textContent = currentTitle;
    info.textContent = part.title;

    // Handle Video Visibility
    if (part.video && part.video.trim() !== "") {
        player.style.display = "block";
        player.src = part.video;
    } else {
        player.style.display = "none";
        player.src = "";
    }

    // Load Story
    if (!part.story || part.story.trim() === "") {
        story.innerHTML = "<h3>Coming Soon...</h3>";
    } else {
        story.innerHTML = part.story.replace(/\n/g, "<br>");
    }

    // Handle Button Active State
    document.querySelectorAll(".partButton").forEach(btn => btn.classList.remove("active"));
    const active = document.getElementById("part-" + index);
    if (active) active.classList.add("active");

    // Navigation state
    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === currentList.length - 1);
    
    hideLoading();
}

function createButtons() {
    partsContainer.innerHTML = "";
    currentList.forEach((part, index) => {
        const button = document.createElement("button");
        button.className = "partButton";
        button.id = "part-" + index;
        button.textContent = part.title;
        button.onclick = () => {
            if (!part.video && !part.story) { showPopup(); return; }
            loadPart(index);
        };
        partsContainer.appendChild(button);
    });
}

// =============================================================================
// Navigation & Initialization
// =============================================================================

prevBtn.onclick = () => { if (currentIndex > 0) loadPart(currentIndex - 1); };
nextBtn.onclick = () => { if (currentIndex < currentList.length - 1) loadPart(currentIndex + 1); };

async function start() {
    showLoading();
    try {
        await loadSources();
        if (mode === "trailer") {
            await loadTrailer();
        } else {
            await loadEpisode();
        }
    } catch (error) {
        console.error(error);
        title.textContent = "Loading Failed";
        hideLoading();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

// Start the process
start();
