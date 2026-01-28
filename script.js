const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    appendMessage(text, 'user-message');
    userInput.value = '';

    // 2. Add Loading State
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.id = loadingId;
    loadingDiv.innerText = "Thinking... (This may prompt a popup)";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Call Puter.js AI
        // We use Llama 3.3 70B because it is excellent at coding
        const response = await puter.ai.chat(text, { 
            model: 'meta-llama/llama-3.3-70b-instruct' 
        });

        // 4. Remove loading and show response
        const loadingElement = document.getElementById(loadingId);
        if(loadingElement) loadingElement.remove();

        // Puter returns the object in response.message.content
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
        div.innerHTML = marked.parse(text);
    } else {
        div.innerText = text;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
