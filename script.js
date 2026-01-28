const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Safety Check for Puter library
    if (typeof puter === 'undefined') {
        appendMessage("❌ Error: Puter.js is not loaded. Check your internet or index.html.", 'ai-message');
        return;
    }

    // 1. Add User Message
    appendMessage(text, 'user-message');
    userInput.value = '';

    // 2. Add Loading "Thinking" Bubble
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.id = loadingId;
    loadingDiv.innerText = "Gemini is thinking...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Call Google Gemini via Puter
        // We use "google/gemini-2.5-flash" for speed and coding ability
        const response = await puter.ai.chat(text, { 
            model: 'google/gemini-2.5-flash' 
        });

        // 4. Remove loading and show response
        const loadingElement = document.getElementById(loadingId);
        if(loadingElement) loadingElement.remove();

        // Gemini via Puter returns the text in response.message.content
        const aiText = response.message.content;
        appendMessage(aiText, 'ai-message');

    } catch (error) {
        const loadingElement = document.getElementById(loadingId);
        if(loadingElement) loadingElement.remove();
        
        appendMessage(`Error: ${error.message}. (Did you close the popup?)`, 'ai-message');
    }
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    
    if (className === 'ai-message') {
        // Parse Markdown for clean code blocks
        div.innerHTML = marked.parse(text);
    } else {
        div.innerText = text;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
