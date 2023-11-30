document.getElementById('saveSettings').addEventListener('click', function() {
    const selectedVoice = document.getElementById('voiceSelection').value;

    // Save settings to Chrome's local storage
    chrome.storage.local.set({voice: selectedVoice}, function() {
        console.log('Settings saved');
    });
});

document.getElementById('captureButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("sending message");
        chrome.tabs.sendMessage(tabs[0].id, { action: "narrateTweets" });
        console.log("message sent");
    });
});

