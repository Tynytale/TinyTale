const button = document.getElementById("enterBtn");
const transition = document.getElementById("transition");

button.addEventListener("click", () => {

    transition.style.opacity = "1";

    setTimeout(() => {
        window.location.href = "pages/home.html";
    }, 1200);

});
