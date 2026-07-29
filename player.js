// ==========================
// TinyTale Player
// ==========================

// ---------- Demo Data ----------

const parts = [

{

title:"Part 1",

video:"https://www.youtube.com/embed/dQw4w9WgXcQ",

story:`
This is where your story will appear.

Later, this text will automatically load from your GitHub Gist.

For now this is only a placeholder.
`

},

{

title:"Part 2",

video:"",

story:"Coming Soon."

},

{

title:"Part 3",

video:"",

story:"Coming Soon."

},

{

title:"Part 4",

video:"",

story:"Coming Soon."

},

{

title:"Part 5",

video:"",

story:"Coming Soon."

}

];

// ---------- Elements ----------

const player=document.getElementById("videoPlayer");

const story=document.getElementById("storyContent");

const buttons=document.querySelectorAll(".part");

const prevBtn=document.getElementById("prevBtn");

const nextBtn=document.getElementById("nextBtn");

let currentPart=0;

// ---------- Load Part ----------

function loadPart(index){

currentPart=index;

const data=parts[index];

if(data.video===""){

player.src="";

story.innerHTML="<h3>Coming Soon...</h3>";

}else{

player.src=data.video;

story.innerHTML=data.story;

}

buttons.forEach(btn=>btn.classList.remove("active"));

buttons[index].classList.add("active");

}

// ---------- Part Buttons ----------

buttons.forEach((button,index)=>{

button.addEventListener("click",()=>{

loadPart(index);

});

});

// ---------- Previous ----------

prevBtn.addEventListener("click",()=>{

if(currentPart>0){

loadPart(currentPart-1);

}

});

// ---------- Next ----------

nextBtn.addEventListener("click",()=>{

if(currentPart<parts.length-1){

loadPart(currentPart+1);

}

});

// ---------- First Load ----------

loadPart(0);
