/* script.js */
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const apiKeyInput = document.getElementById('apiKey');

async function sendMessage() {
    const text = userInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!text) return;
    if (!apiKey) {
        alert("Please enter your Google AI Studio API key.");
        return;
    }

    // 1. Add User Message to Chat
    appendMessage(text, 'user-message');
    userInput.value = '';

    try {
        // 2. Prepare the API URL (Gemini 1.5 Flash is fast and cheap/free)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 3. Prepare the Request Body
        // Gemini expects "contents" array, not "messages"
        const requestBody = {
            contents: [
                {
                    parts: [{ text: text }]
                }
            ]
        };

        // 4. Call Google API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // 5. Handle Errors
        if (data.error) {
            appendMessage(`Error: ${data.error.message}`, 'ai-message');
            return;
        }

        // 6. Extract Response Text
        // Gemini structure: candidates[0].content.parts[0].text
        const aiResponse = data.candidates[0].content.parts[0].text;
        appendMessage(aiResponse, 'ai-message');

    } catch (error) {
        appendMessage(`Network Error: ${error.message}`, 'ai-message');
    }
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    
    if (className === 'ai-message') {
        // Parse Markdown for code blocks
        div.innerHTML = marked.parse(text);
    } else {
        div.innerText = text;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
