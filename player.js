// TinyTale Player

const player = document.getElementById("videoPlayer");
const story = document.getElementById("storyContent");
const title = document.getElementById("episodeTitle");

async function loadEpisode() {

    const response = await fetch("episodes.json");
    const data = await response.json();

    const episode = data.episodes[0];
    const part = episode.parts[0];

    title.textContent = episode.title;

    player.src = part.video;

    if (part.story) {

        fetch(part.story)
            .then(res => res.text())
            .then(text => {

                story.innerHTML = text.replace(/\n/g, "<br>");

            })
            .catch(() => {

                story.innerHTML = "Unable to load story.";

            });

    }

}

loadEpisode();
