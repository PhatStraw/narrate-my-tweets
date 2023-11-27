
function convertTextToSpeech(text) {
    console.log("convertTextToSpeech");
    chrome.storage.local.get(['narrationEnabled', 'selectedVoice'], function(items) {
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
    console.log("captureTextFromTimeline");
    chrome.runtime.sendMessage({action: 'captureScreen'}, function(response) {
        console.log("response", response);
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
    console.log("sendImageToServerForAnalysis");
    let base64Image = imageDataUrl.split(',')[1];
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
});

if (!window.hasAddedListener) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "narrateTweets") {
            captureTextFromTimeline()
            return true; // Indicates response is sent asynchronously  
        }
    });
    window.hasAddedListener = true;
}
