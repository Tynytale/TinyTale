// ===============================
// TinyTale Player v2.0
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

let episodeData = null;
let currentList = [];
let currentIndex = 0;

// ----------------------------
// Read URL
// ----------------------------

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode") || "episode";

const episodeId = parseInt(params.get("episode")) || 1;

// ----------------------------
// Popup
// ----------------------------

function showPopup(){

popup.style.display="flex";

}

closePopup.onclick=()=>{

popup.style.display="none";

}

popup.onclick=(e)=>{

if(e.target===popup){

popup.style.display="none";

}

}

// ----------------------------
// Load Story
// ----------------------------

async function loadStory(url){

if(!url){

story.innerHTML="<h3>Coming Soon...</h3>";

return;

}

try{

const response=await fetch(url);

const text=await response.text();

story.innerHTML=text.replace(/\n/g,"<br>");

}catch{

story.innerHTML="Unable to load story.";

}

}

// ----------------------------
// Load Current Part
// ----------------------------

async function loadPart(index){

currentIndex=index;

const part=currentList[index];

title.textContent=episodeData.title;

info.textContent=

mode==="trailer"

?`Trailer • ${part.title}`

:`Episode • ${part.title}`;

if(part.video){

player.src=part.video;

}else{

player.src="";

}

await loadStory(part.story);

document.querySelectorAll(".partButton").forEach(btn=>{

btn.classList.remove("active");

});

const active=document.getElementById("part-"+index);

if(active){

active.classList.add("active");

}

prevBtn.disabled=index===0;

nextBtn.disabled=index===currentList.length-1;

}

// ----------------------------
// Create Buttons
// ----------------------------

function createButtons(){

partsContainer.innerHTML="";

currentList.forEach((part,index)=>{

const button=document.createElement("button");

button.className="partButton";

button.id="part-"+index;

button.textContent=part.title;

button.onclick=()=>{

if(!part.video){

showPopup();

return;

}

loadPart(index);

}

partsContainer.appendChild(button);

});

}

// ----------------------------
// Previous
// ----------------------------

prevBtn.onclick=()=>{

if(currentIndex>0){

loadPart(currentIndex-1);

}

}

// ----------------------------
// Next
// ----------------------------

nextBtn.onclick=()=>{

if(currentIndex<currentList.length-1){

if(!currentList[currentIndex+1].video){

showPopup();

return;

}

loadPart(currentIndex+1);

}

}

// ----------------------------
// Load JSON
// ----------------------------

async function start(){

try{

const response=await fetch("episodes.json");

const json=await response.json();

episodeData=json.episodes.find(e=>e.id===episodeId);

if(!episodeData){

title.textContent="Episode Not Found";

loadingScreen.style.display="none";

return;

}

currentList=

mode==="trailer"

?episodeData.trailer

:episodeData.parts;

createButtons();

await loadPart(0);

loadingScreen.style.display="none";

playerContainer.style.display="block";

}catch{

title.textContent="Loading Failed";

loadingScreen.style.display="none";

}

}

start();
