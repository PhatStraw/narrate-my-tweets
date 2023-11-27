require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

// Middleware for parsing JSON data
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

// Enable CORS
app.use(cors({
    origin: '*'
  }));// Use cors

// Route to analyze image
app.post('/analyze_image', async (req, res) => {
    console.log("analyze_image");
    const base64Image = req.body.image;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            max_tokens: 300
        });
        res.json({ description: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the image');
    }
});
const speakFile = path.resolve("./speak.mp3");
// Route to generate speech from text
app.post('/generate_speech', async (req, res) => {
    const inputText = req.body.text;
    const voice = req.body.voice || 'alloy'; // Default voice set to 'alloy'

    try {
        const response = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice,
            input: inputText
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        res.set('Content-Type', 'audio/mpeg');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating speech');
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
