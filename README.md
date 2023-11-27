# Narrate My Tweets Chrome Extension

## Description
Narrate My Tweets is a Chrome extension designed to enhance the Twitter experience by providing text-to-speech functionality. It captures the visible tweets on the user's Twitter feed and narrates them using OpenAI's GPT-4 and Text-to-Speech APIs.

## Features
- **Text-to-Speech**: Converts tweets into spoken words.
- **Customizable Voice**: Users can select from various voices for narration.
- **Toggle Narration**: Easily enable or disable narration.

## Installation
1. **Clone the Repository**: Clone this repository to your local machine.
   ```
   git clone https://github.com/phatstraws/narrate-my-tweets.git
   ```

2. **Install Dependencies**: Navigate to the cloned directory and install necessary dependencies.
   ```
   cd narrate-my-tweets
   npm install
   ```

3. **Set Up OpenAI API Key**:
   - Create a `.env` file in the root directory.
   - Add your OpenAI API key to the `.env` file:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Start the Server**:
   ```
   node app.js
   ```

5. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `narrate-my-tweets` directory.

## Usage
- Navigate to [Twitter](https://twitter.com).
- Click on the extension icon to open the popup.
- Toggle narration and select a voice.
- Scroll through your Twitter feed to hear tweets narrated.

## Contributing
Contributions to the Narrate My Tweets extension are welcome! Feel free to open pull requests or submit issues for bugs and feature requests.

## License
[MIT License](LICENSE)
