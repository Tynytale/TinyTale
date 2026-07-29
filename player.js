// ===================================================
// TinyTale Player v3.0
// PART 1
// ===================================================

// -----------------------------
// Elements
// -----------------------------

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

// -----------------------------
// URL Parameters
// -----------------------------

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode") || "episode";

const id = params.get("id");

// -----------------------------
// Data
// -----------------------------

let sourceLinks = {};

let currentData = [];

let currentIndex = 0;

// -----------------------------
// Popup
// -----------------------------

function showPopup() {

    popup.style.display = "flex";

}

function hidePopup() {

    popup.style.display = "none";

}

closePopup.onclick = hidePopup;

popup.onclick = (e) => {

    if (e.target === popup) {

        hidePopup();

    }

};

// -----------------------------
// Loading
// -----------------------------

function showLoading() {

    loadingScreen.style.display = "flex";

    playerContainer.style.display = "none";

}

function hideLoading() {

    loadingScreen.style.display = "none";

    playerContainer.style.display = "block";

}

// -----------------------------
// Read episodes.json
// -----------------------------

async function loadSources() {

    const response = await fetch("episodes.json");

    const json = await response.json();

    sourceLinks = json.sources;

}

// -----------------------------
// Fetch JSON
// -----------------------------

async function fetchJSON(url) {

    const response = await fetch(url);

    return await response.json();

}

// -----------------------------
// Trailer Loader
// -----------------------------

async function loadTrailer() {

    const trailerJSON = await fetchJSON(sourceLinks.trailers);

    const trailer = trailerJSON[id];

    if (!trailer) {

        title.textContent = "Trailer Not Found";

        hideLoading();

        return;

    }

    currentData = [trailer];

    currentIndex = 0;

    renderCurrent();

}

// -----------------------------
// Episode Loader
// -----------------------------

async function loadEpisode() {

    const key = "episode" + id;

    if (!sourceLinks[key]) {

        title.textContent = "Episode Not Found";

        hideLoading();

        return;

    }

    const episodeJSON = await fetchJSON(sourceLinks[key]);

    title.textContent = episodeJSON.title;

    currentData = episodeJSON.parts;

    currentIndex = 0;

    createPartButtons();

    renderCurrent();

}// ===================================================
// TinyTale Player v3.0
// PART 2
// ===================================================

// -----------------------------
// Render Current Item
// -----------------------------

function renderCurrent() {

    if (!currentData.length) {

        title.textContent = "No Content";

        info.textContent = "";

        story.innerHTML = "<h3>No story available.</h3>";

        player.src = "";

        hideLoading();

        return;

    }

    const item = currentData[currentIndex];

    if (mode === "trailer") {

        title.textContent = item.title;

        info.textContent = "Trailer";

    } else {

        info.textContent = item.title;

    }

    // -------------------------
    // Video
    // -------------------------

    if (item.video && item.video.trim() !== "") {

        player.src = item.video;

    } else {

        player.src = "";

    }

    // -------------------------
    // Story
    // -------------------------

    if (item.story && item.story.trim() !== "") {

        story.innerHTML = item.story.replace(/\n/g,"<br>");

    } else {

        story.innerHTML = "<h3>Coming Soon...</h3>";

    }

    // -------------------------
    // Active Part Button
    // -------------------------

    document.querySelectorAll(".partButton").forEach(btn=>{

        btn.classList.remove("active");

    });

    const active=document.getElementById("part-"+currentIndex);

    if(active){

        active.classList.add("active");

    }

    // -------------------------
    // Previous / Next
    // -------------------------

    prevBtn.disabled = currentIndex === 0;

    nextBtn.disabled = currentIndex === currentData.length-1;

    hideLoading();

}

// -----------------------------
// Create Part Buttons
// -----------------------------

function createPartButtons(){

    partsContainer.innerHTML="";

    currentData.forEach((item,index)=>{

        const button=document.createElement("button");

        button.className="partButton";

        button.id="part-"+index;

        button.textContent=item.title;

        button.onclick=()=>{

            currentIndex=index;

            renderCurrent();

        };

        partsContainer.appendChild(button);

    });

}

// -----------------------------
// Previous Button
// -----------------------------

prevBtn.onclick=()=>{

    if(currentIndex===0){

        return;

    }

    currentIndex--;

    renderCurrent();

};

// -----------------------------
// Next Button
// -----------------------------

nextBtn.onclick=()=>{

    if(currentIndex>=currentData.length-1){

        return;

    }

    currentIndex++;

    renderCurrent();

};
