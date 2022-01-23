const callback = () => {
  let currentLocation = window.location.href;
  if (!/https:\/\/shikimori\.one\/animes\/(z?\d+)/.test(currentLocation)) {
    return;
  }
  let titleId = currentLocation.match(
    /https:\/\/shikimori\.one\/animes\/(z?\d+)/
  )[1];

  let originalName = document
    .getElementsByClassName("l-page")[0]
    .getElementsByTagName("meta")[0].content;

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
