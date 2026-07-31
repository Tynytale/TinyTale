// ===============================
// TinyTale Player v3.0
// PART 1
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

// ----------------------------
// Runtime Data
// ----------------------------

let sources = {};
let currentList = [];
let currentIndex = 0;
let currentTitle = "";

// ----------------------------
// Read URL
// ----------------------------

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode") || "episode";
const id = params.get("id") || "1";

// ----------------------------
// Popup
// ----------------------------

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

// ----------------------------
// Loading
// ----------------------------

function showLoading() {
    loadingScreen.style.display = "flex";
    playerContainer.style.display = "none";
}

function hideLoading() {
    loadingScreen.style.display = "none";
    playerContainer.style.display = "block";
}

// ----------------------------
// Load Sources
// ----------------------------

async function loadSources() {

    const response = await fetch("episodes.json");

    const json = await response.json();

    sources = json.sources;

}

// ----------------------------
// Fetch JSON
// ----------------------------

async function fetchJSON(url) {

    const response = await fetch(url);

    return await response.json();

}

// ----------------------------
// Story
// ----------------------------

function loadStory(text) {

    if (!text || text.trim() === "") {

        story.innerHTML = "<h3>Coming Soon...</h3>";

        return;

    }

    story.innerHTML = text.replace(/\n/g, "<br>");

}
// ===============================
// PART 2
// Trailer / Episode Loader
// ===============================

// ----------------------------
// Load Trailer
// ----------------------------

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

    loadPart(0);

}

// ----------------------------
// Load Episode
// ----------------------------

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

// ----------------------------
// Load Current Part
// ----------------------------

function loadPart(index) {

    currentIndex = index;

    const part = currentList[index];

    title.textContent = currentTitle;

    info.textContent =

        mode === "trailer"

        ? "Trailer"

        : part.title;

    // --- FIX: Video eka hide/show logic ---
    if (part.video && part.video.trim() !== "") {
        player.style.display = "block";
        player.src = part.video;
    } else {
        player.style.display = "none";
        player.src = "";
    }
    // -------------------------------------

    loadStory(part.story);

    document.querySelectorAll(".partButton").forEach(btn => {

        btn.classList.remove("active");

    });

    const active = document.getElementById("part-" + index);

    if (active) {

        active.classList.add("active");

    }

    prevBtn.disabled = (index === 0);

    nextBtn.disabled = (index === currentList.length - 1);

    hideLoading();

}

// ----------------------------
// Buttons
// ----------------------------

function createButtons() {

    partsContainer.innerHTML = "";

    currentList.forEach((part, index) => {

        const button = document.createElement("button");

        button.className = "partButton";

        button.id = "part-" + index;

        button.textContent = part.title;

        button.onclick = () => {

            if (!part.video) {

                showPopup();

                return;

            }

            loadPart(index);

        };

        partsContainer.appendChild(button);

    });

}
// ===============================
// PART 3
// Navigation + Start
// ===============================

// ----------------------------
// Previous
// ----------------------------

prevBtn.onclick = () => {

    if (currentIndex > 0) {

        loadPart(currentIndex - 1);

    }

};

// ----------------------------
// Next
// ----------------------------

nextBtn.onclick = () => {

    if (currentIndex < currentList.length - 1) {

        const next = currentList[currentIndex + 1];

        if (!next.video) {

            showPopup();

            return;

        }

        loadPart(currentIndex + 1);

    }

};

// ----------------------------
// Start
// ----------------------------

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

        info.textContent = "";

        player.src = "";

        story.innerHTML = "<h3>Unable to load content.</h3>";

        partsContainer.innerHTML = "";

        hideLoading();

    }

}

// ----------------------------
// Keyboard Navigation
// ----------------------------

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft") {

        prevBtn.click();

    }

    if (e.key === "ArrowRight") {

        nextBtn.click();

    }

});

// ----------------------------
// Disable Right Click
// ----------------------------

document.addEventListener("contextmenu", (e) => {

    e.preventDefault();

});

// ----------------------------
// Start Player
// ----------------------------

start();
