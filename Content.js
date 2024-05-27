
async function sleepUntil(f, timeoutMs) {
  return new Promise((resolve, reject) => {
    let timeWas = new Date();
    let wait = setInterval(function () {
      if (f()) {
        console.log("resolved after", new Date() - timeWas, "ms");
        clearInterval(wait);
        resolve();
      } else if (new Date() - timeWas > timeoutMs) {
        // Timeout
        console.log("rejected after", new Date() - timeWas, "ms");
        clearInterval(wait);
        reject();
      }
    }, 20);
  });
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const callback = async () => {

  let oldButtons = document.getElementsByClassName("watch-online");
  console.log(oldButtons)
  for (let i = 0; i < oldButtons.length; i++) {
    oldButtons[i].remove();
  }
  console.log("Old buttons removed")

  let currentLocation = window.location.href;
  if (!/https:\/\/shikimori\.one\/animes\/z?(\d+)/.test(currentLocation)) {
    console.log("wrong url")
    return;
  }
  let titleId = currentLocation.match(
    /https:\/\/shikimori\.one\/animes\/z?(\d+)/
  )[1];

  const button = document.createElement("a");
  button.classList.add("b-link_button", "dark");
  button.id = "reDirector";
  button.href = `https://aniu.ru/anime/s${titleId}#player`;
  button.target = "_blank";
  button.title = "Aniu";
  button.textContent = "Re:Director";

  const line = document.createElement("div");
  line.classList.add("line");
  line.appendChild(button);

  const watchOnline = document.createElement("div");
  watchOnline.classList.add("watch-online");
  watchOnline.appendChild(line);

  await sleepUntil(() => document.querySelector(".c-info-right"), 60 * 1000);
  let infoBlock = document.getElementsByClassName("c-info-right")[0];
  infoBlock.appendChild(watchOnline);

  console.log("button added")

  await sleep(500);
  if (document.getElementById('reDirector')) {
    console.log("button exists")
    return
  } 
  else {
    callback();
  }
}


let lastUrl;

new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    console.log("url changed from: " + url + " to: " + lastUrl)
    lastUrl = url;
    callback();

  }
}).observe(document, { subtree: true, childList: true });
