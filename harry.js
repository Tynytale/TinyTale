const intro = document.getElementById("intro");
const enterMagic = document.getElementById("enterMagic");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");

const trailerBtn = document.getElementById("trailerBtn");
const episode1Btn = document.getElementById("episode1Btn");

const lockedButtons = document.querySelectorAll(".locked");

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

enterMagic.addEventListener("click", () => {

    bgMusic.play();

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.style.display = "none";

        mainContent.style.display = "block";

    }, 1000);

});

trailerBtn.addEventListener("click", () => {

    window.location.href = "player.html?mode=trailer&episode=1";

});

episode1Btn.addEventListener("click", () => {

    window.location.href = "player.html?mode=episode&episode=1";

});

lockedButtons.forEach(button => {

    button.addEventListener("click", () => {

        popup.style.display = "flex";

    });

});

closePopup.addEventListener("click", () => {

    popup.style.display = "none";

});

popup.addEventListener("click", e => {

    if(e.target===popup){

        popup.style.display="none";

    }

});
