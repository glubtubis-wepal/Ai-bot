const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const apiKeyInput = document.getElementById('apiKey');

async function sendMessage() {
    const text = userInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!text) return;
    if (!apiKey) {
        alert("Please enter your OpenAI API key first.");
        return;
    }

    // 1. Add User Message to Chat
    appendMessage(text, 'user-message');
    userInput.value = '';

    // 2. Prepare the API Request
    const messages = [
        { role: "system", content: "You are an expert coding assistant. Provide code examples in Markdown format." },
        { role: "user", content: text }
    ];

    try {
        // 3. Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Or "gpt-4" if you have access
                messages: messages
            })
        });

        const data = await response.json();

        if (data.error) {
            appendMessage(`Error: ${data.error.message}`, 'ai-message');
        } else {
            const aiResponse = data.choices[0].message.content;
            appendMessage(aiResponse, 'ai-message');
        }

    } catch (error) {
        appendMessage(`Network Error: ${error.message}`, 'ai-message');
    }
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    
    // Use marked.parse to render code blocks correctly
    if (className === 'ai-message') {
        div.innerHTML = marked.parse(text);
    } else {
        div.innerText = text;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
