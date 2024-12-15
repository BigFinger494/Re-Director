document.addEventListener("DOMContentLoaded", () => {
    const baseUrlInput = document.getElementById("baseUrl");
    const saveButton = document.getElementById("saveButton");
    const message = document.getElementById("message");
  
    // Загружаем текущее значение из хранилища
    chrome.storage.sync.get({ baseUrl: "https://aniu.ru" }, (data) => {
      baseUrlInput.value = data.baseUrl;
    });
  
    // Обработчик сохранения
    saveButton.addEventListener("click", () => {
      const newBaseUrl = baseUrlInput.value.trim();
  
      if (!newBaseUrl || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(newBaseUrl)) {
        message.style.color = "red";
        message.textContent = "Invalid URL. Please enter a valid URL.";
        return;
      }
  
      chrome.storage.sync.set({ baseUrl: newBaseUrl }, () => {
        // Отображаем уведомление об успешном сохранении
        message.style.color = "green";
        message.textContent = "Settings saved successfully!";
  
        // Убираем сообщение через 3 секунды
        setTimeout(() => {
          message.textContent = "";
        }, 3000);
      });
    });
  });
  