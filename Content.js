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

const callback = async () => {
  let currentLocation = window.location.href;
  if (!/https:\/\/shikimori\.one\/animes\/(z?\d+)/.test(currentLocation)) {
    return;
  }
  let titleId = currentLocation.match(
    /https:\/\/shikimori\.one\/animes\/(z?\d+)/
  )[1];

  await sleepUntil(() => document.querySelector(".c-info-right"), 60 * 1000);

  let originalName = document
    .getElementsByClassName("b-separator")[0].parentElement.textContent.split(' / ')[1]

  const button = document.createElement("a");
  button.classList.add("b-link_button", "dark");
  button.id = "reDirector";
  button.href = `https://aniu.ru/search/?q=${originalName}`;
  button.target = "_blank";
  button.title = "Aniu";
  button.textContent = "Re:Director";

  const line = document.createElement("div");
  line.classList.add("line");
  line.appendChild(button);

  const watchOnline = document.createElement("div");
  watchOnline.classList.add("watch-online");
  watchOnline.appendChild(line);

  let infoBlock = document.getElementsByClassName("c-info-right")[0];
  infoBlock.appendChild(watchOnline);
};

let lastUrl;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    callback();
  }
}).observe(document, { subtree: true, childList: true });
