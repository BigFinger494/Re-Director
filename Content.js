// Функция ожидания до выполнения условия
async function sleepUntil(f, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeStart = Date.now();
    const interval = setInterval(() => {
      if (f()) {
        console.log("Condition met, resolving...");
        clearInterval(interval);
        resolve();
      } else if (Date.now() - timeStart > timeoutMs) {
        console.error("Timeout reached, rejecting...");
        clearInterval(interval);
        reject(new Error("Timeout while waiting for condition"));
      }
    }, 20);
  });
}

// Функция паузы
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Основная функция
const callback = async () => {
  try {
    console.log("Callback triggered");

    // Удаляем старые кнопки
    const oldButtons = document.getElementsByClassName("watch-online");
    console.log("Old buttons found:", oldButtons.length);
    for (const button of oldButtons) {
      button.remove();
    }
    console.log("Old buttons removed");

    // Проверяем, что URL соответствует шаблону
    const currentLocation = window.location.href;
    if (!/https:\/\/shikimori\.(one|me)\/animes\/z?(\d+)/.test(currentLocation)) {
      console.log("Not an anime page, exiting callback.");
      return;
    }

    // Извлекаем ID аниме из URL
    const titleId = currentLocation.match(/https:\/\/shikimori\.(one|me)\/animes\/z?(\d+)/)[2];
    console.log("Anime ID:", titleId);

    // Получаем базовый URL из настроек
    const baseUrl = await new Promise((resolve) => {
      chrome.storage.sync.get(["baseUrl"], (result) => {
        const url = result.baseUrl || "https://aniu.ru"; // Значение по умолчанию
        resolve(url);
      });
    });
    console.log("Base URL:", baseUrl);

    // Создаём кнопку
    const button = document.createElement("a");
    button.classList.add("b-link_button", "dark");
    button.id = "reDirector";
    button.href = `${baseUrl}/anime/s${titleId}#player`;
    button.target = "_blank";
    button.title = "Re:Director";
    button.textContent = "Re:Director";

    const line = document.createElement("div");
    line.classList.add("line");
    line.appendChild(button);

    const watchOnline = document.createElement("div");
    watchOnline.classList.add("watch-online");
    watchOnline.appendChild(line);

    // Ждём появления блока информации
    console.log("Waiting for .c-info-right...");
    await sleepUntil(() => document.querySelector(".c-info-right"), 60 * 1000);
    const infoBlock = document.querySelector(".c-info-right");

    if (!infoBlock) {
      console.error("Error: .c-info-right not found");
      return;
    }

    // Добавляем кнопку
    infoBlock.appendChild(watchOnline);
    console.log("Button added to .c-info-right");

    // Проверяем, добавилась ли кнопка
    await sleep(500);
    if (document.getElementById("reDirector")) {
      console.log("Button successfully exists in the DOM.");
    } else {
      console.warn("Button not found in DOM, retrying...");
      callback(); // Повторяем попытку, если кнопка не появилась
    }
  } catch (error) {
    console.error("Error in callback:", error);
  }
};

// Слушатель изменений URL
let lastUrl = location.href;

new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    console.log(`URL changed from ${lastUrl} to ${url}`);
    lastUrl = url;
    callback();
  }
}).observe(document, { subtree: true, childList: true });

// Первоначальный запуск
callback();
