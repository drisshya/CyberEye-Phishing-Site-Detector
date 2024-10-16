chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { const url = tabs[0].url;
    const phishingIndicators = ["phish", "fake", "fraud"];
    const isPhishing = phishingIndicators.some((indicator) => url.includes(indicator));
    
    const resultElement = document.getElementById("result"); if (isPhishing) {
    resultElement.textContent = "Alert: You are being phished!!"; resultElement.style.color = "red";
    } else {
    resultElement.textContent = "Yayy!! This website is safe to use"; resultElement.style.color = "green";
    }
    });
   	