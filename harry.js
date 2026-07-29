// ==========================
// TinyTale - Harry Potter
// ==========================

// Buttons
const trailerBtn = document.getElementById("trailerBtn");
const episode1Btn = document.getElementById("episode1Btn");

const lockedButtons = document.querySelectorAll(".locked");

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// Trailer
trailerBtn.addEventListener("click", () => {

    // Future trailer page
    window.location.href = "player.html?type=trailer";

});

// Episode 1
episode1Btn.addEventListener("click", () => {

    // Future episode player
    window.location.href = "player.html?episode=1";

});

// Locked Episodes
lockedButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        popup.style.display="flex";

    });

});

// Close Popup
closePopup.addEventListener("click",()=>{

    popup.style.display="none";

});

// Close when tapping outside
popup.addEventListener("click",(e)=>{

    if(e.target===popup){

        popup.style.display="none";

    }

});

// Page Animation
window.addEventListener("load",()=>{

    document.body.style.opacity="0";
    document.body.style.transition="opacity .8s";

    setTimeout(()=>{

        document.body.style.opacity="1";

    },100);

});
