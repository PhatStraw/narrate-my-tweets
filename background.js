chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ narrationEnabled: false, selectedVoice: "alloy" });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the URL is not a `chrome://` URL and is a Twitter URL
  console.log(tab);
  if (
    tab &&
    tab.url &&
    tab.url.includes("twitter.com") &&
    changeInfo.status == "complete"
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "captureScreen") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.captureVisibleTab(
          tabs[0].windowId,
          { format: "jpeg", quality: 100 },
          function (dataUrl) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              sendResponse({ error: chrome.runtime.lastError.message });
            } else {
              console.log("dataurl", dataUrl);
              sendResponse({ image: dataUrl });
            }
          }
        );
        console.log("img sent");
      }
    );
  }
  return true; // Indicates response is sent asynchronously
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "narrate-tweets") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "narrateTweets" });
        });
    }
});
