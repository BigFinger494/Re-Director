document.addEventListener("DOMContentLoaded", () => {
    const baseUrlInput = document.getElementById("baseUrl");
    const saveButton = document.getElementById("saveButton");
    const message = document.getElementById("message");
  
    // Загружаем текущее значение
    chrome.storage.sync.get({ baseUrl: "https://aniu.ru" }, (data) => {
      baseUrlInput.value = data.baseUrl;
    });
  
    // Сохранение нового значения
    saveButton.addEventListener("click", () => {
      const newBaseUrl = baseUrlInput.value.trim();
  
      if (!newBaseUrl || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(newBaseUrl)) {
        message.style.color = "red";
        message.textContent = "Invalid URL!";
        return;
      }
  
      chrome.storage.sync.set({ baseUrl: newBaseUrl }, () => {
        message.style.color = "green";
        message.textContent = "Settings saved!";
        setTimeout(() => (message.textContent = ""), 3000);
      });
    });
  });
  