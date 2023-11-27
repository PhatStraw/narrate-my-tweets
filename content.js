function convertTextToSpeech(text) {
    chrome.storage.local.get(['narrationEnabled', 'selectedVoice'], function(items) {
        if (items.narrationEnabled) return; // Do not narrate if disabled

        fetch('http://localhost:3000/generate_speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, voice: items.selectedVoice })
        })
        .then(response => response.blob())
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            playAudio(audioUrl);
        })
        .catch(error => console.error('Error:', error));
    });
}

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}


 function captureTextFromTimeline(){
    chrome.runtime.sendMessage({action: 'captureScreen'}, function(response) {
        console.log("captureTextFromTimeline", JSON.stringify(response));
        if (chrome.runtime.lastError) {
            // Handle the error or simply return
            console.error(chrome.runtime.lastError.message);
            return;
        }
        if (response && response.image) {
            sendImageToServerForAnalysis(response.image);
        }
    });
}


function sendImageToServerForAnalysis(imageDataUrl) {
    // Extract base64 data from the Data URL
    let base64Image = imageDataUrl.split(',')[1];
console.log("HERERRERE",base64Image);
    fetch('http://localhost:3000/analyze_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Image })
    })
    .then(response => response.json())
    .then(data => {
        // Assuming the server returns the extracted text
        convertTextToSpeech(data.description);
    })
    .catch(error => console.error('Error:', error));
}


// Listener for changes from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.storage.local.set({ narrationEnabled: request.narrationEnabled, selectedVoice: request.voice });

    if (request.narrationEnabled) {
        let textToNarrate = captureTextFromTimeline();
        convertTextToSpeech(textToNarrate);
    }
});

// Initial text capture and narration, if enabled
window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['narrationEnabled'], function(items) {
        if (!items.narrationEnabled) {
            console.log('Narration disabled');
            let textToNarrate = captureTextFromTimeline();
            convertTextToSpeech(textToNarrate);
        }
    });
});


window.addEventListener('scroll', () => {
    let captureTimeout;
    clearTimeout(captureTimeout);
    captureTimeout = setTimeout(() => {
        chrome.storage.local.get(['narrationEnabled'], function(items) {
            if (!items.narrationEnabled) {
                captureTextFromTimeline();
            }
        })
    }, 1000); // Adjust the delay as needed
});
