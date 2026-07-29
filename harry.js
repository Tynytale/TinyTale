// ==========================
// TinyTale - Harry Potter
// ==========================

const intro = document.getElementById("intro");
const enterMagic = document.getElementById("enterMagic");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");

const trailerBtn = document.getElementById("trailerBtn");
const episode1Btn = document.getElementById("episode1Btn");

const lockedButtons = document.querySelectorAll(".locked");

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// Enter Hogwarts
enterMagic.addEventListener("click", () => {

    bgMusic.play();

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.style.display = "none";

        mainContent.style.display = "block";

    }, 1000);

});

// Trailer
trailerBtn.addEventListener("click", () => {

    window.location.href = "player.html?type=trailer";

});

// Episode 1
episode1Btn.addEventListener("click", () => {

    window.location.href = "player.html?episode=1";

});

// Locked Episodes
lockedButtons.forEach(button => {

    button.addEventListener("click", () => {

        popup.style.display = "flex";

    });

});

// Close popup
closePopup.addEventListener("click", () => {

    popup.style.display = "none";

});

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.style.display = "none";

    }

});
