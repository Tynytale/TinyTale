// TinyTale Home Page

const journeyBtn = document.getElementById("journeyBtn");

journeyBtn.addEventListener("click", () => {

    journeyBtn.innerHTML = "✨ Opening...";

    journeyBtn.style.pointerEvents = "none";

    setTimeout(() => {

        window.location.href = "harrypotter.html";

    }, 1200);

});


// Smooth Navigation

document.querySelectorAll('nav a').forEach(link => {

    link.addEventListener('click', function(e){

        const target = this.getAttribute("href");

        if(target.startsWith("#")){

            e.preventDefault();

            document.querySelector(target).scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


// Fade In Animation

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    document.body.style.transition="opacity .8s";

    setTimeout(()=>{

        document.body.style.opacity="1";

    },100);

});
