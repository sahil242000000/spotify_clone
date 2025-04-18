let currentsong= new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}   


async function getSongs(folder) {
  currfolder= folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }




  let songUl = document.querySelector(".songslist").getElementsByTagName("ul")[0];
  songUl.innerHTML=""
for (const song of songs) {
  songUl.innerHTML = songUl.innerHTML +
    `<li>
                      <img class="music" src="img/music.svg" alt="music" srcset="">
                      <span>
                          <div>${song.replaceAll("%20", " ")}</div>
                      
                          <div>Sanik</div>
                      </span>
                      <div class="playnow">
                          Play Now
                          <img class="play" src="img/play.svg" alt="play" srcset="">
                      </div>
              
                      </li>`;
}


Array.from(document.querySelector(".songslist").getElementsByTagName("li")
).forEach(e => {
  e.addEventListener("click",element => {
      playmusic(e.querySelector("span").firstElementChild.innerHTML.trim())
  } )
  
});
return songs
}




const playmusic = (track, pause = false) => {
    // let audio= new Audio("/songs/" + track)
currentsong.src = `/${currfolder}/` + track
if(!pause){
currentsong.play()
     play.src="img/pause.svg"
    }
     document.querySelector(".songinfo").innerHTML= decodeURI(track)
     document.querySelector(".songtime").innerHTML="00:00/00:00"


}





async function displayAlbums() {
  console.log("displaying albums")
  let a = await fetch(`/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
      const e = array[index]; 
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
          let folder = e.href.split("/").slice(-2)[0]
          // Get the metadata of the folder
          let a = await fetch(`/songs/${folder}/info.json`)
          let response = await a.json(); 
          cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class=" card">
                        <div class="playy">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="cover" srcset="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
      }
  }


  

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          console.log("Fetching Songs")
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
          playmusic(songs[0])

      })
  })
}




async function main() {
  await getSongs("songs/ncs");
  playmusic(songs[0], true)

  await displayAlbums()

  
  play.addEventListener("click", () => {
    if(currentsong.paused) {
      currentsong.play()
      play.src="img/pause.svg"
    }
    else{
       currentsong.pause()
      play.src="img/play.svg"
    }
  })

  currentsong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${
      secondsToMinutesSeconds(currentsong.currentTime)}/ ${secondsToMinutesSeconds(currentsong.duration) }`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })


document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".left").style.left= "0"

})
document.querySelector(".close").addEventListener("click", ()=>{
  document.querySelector(".left").style.left= "-120%"
  
})
prevsong.addEventListener("click", ()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if((index-1) >= 0) {
    playmusic(songs[index-1])
  }
})

nextsong.addEventListener("click", ()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if((index + 1) < songs.length) {
    playmusic(songs[index + 1])
  }
})

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  currentsong.volume=parseInt(e.target.value)/100
  if (currentsong.volume >0){
    document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
}
})

document.querySelector(".volume>img").addEventListener("click", e=>{ 
  if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentsong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
      currentsong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})
}
main();
