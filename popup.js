document.getElementById('saveSettings').addEventListener('click', function() {
    const narrationToggle = document.getElementById('narrationToggle').checked;
    const selectedVoice = document.getElementById('voiceSelection').value;

    // Save settings to Chrome's local storage
    chrome.storage.local.set({narrationEnabled: narrationToggle, voice: selectedVoice}, function() {
        console.log('Settings saved');
    });

    // Send a message to content.js to update settings
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {narrationEnabled: narrationToggle, voice: selectedVoice});
    });
});
