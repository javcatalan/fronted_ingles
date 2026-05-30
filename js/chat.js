// ===== CHAT MODULE (Anthropic AI) =====
const Chat = {
  history: [],
  chatXP: 0,
  API_URL: 'https://tu-backend.onrender.com/api/chat',
  SYSTEM_PROMPT: `You are Emma, a friendly and encouraging English teacher for Spanish-speaking students from Latin America. Your role is to:

1. CONVERSE naturally in English with the student
2. CORRECT grammar and spelling mistakes in a friendly way
3. EXPLAIN corrections briefly in Spanish when needed
4. ENCOURAGE the student with positive reinforcement
5. Ask follow-up questions to keep the conversation going
6. Adjust your English level to the student's apparent proficiency

FORMAT your responses like this:
- Start with your natural reply to what they said
- If there are errors, add a correction section starting with "💡 Corrección:" 
- Keep your response concise (2-4 sentences max for the main reply)
- Be warm, patient, and motivating

Example:
User: "I go to park yesterday with my friends"
Emma: "That sounds fun! Parks are great for relaxing with friends. What did you do there?

💡 Corrección: "I go" → "I went" (usamos pasado: "went" no "go"). "to park" → "to the park" (necesita artículo "the")."

Never be harsh. Always celebrate effort and progress!`,

  async send() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    this.addMessage('user', text);

    // Add XP for chatting
    this.chatXP += 2;
    document.getElementById('chatPoints').textContent = this.chatXP;
    App.state.chatMessages++;
    App.saveState();
    App.checkBadges();

    // Show loading
    const loadingId = this.addLoadingMessage();

    // Call Anthropic API
    try {
      this.history.push({ role: 'user', content: text });

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: this.SYSTEM_PROMPT,
          messages: this.history.slice(-10), // Keep last 10 messages for context
        })
      });

      this.removeLoadingMessage(loadingId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      //const reply = data.content?.[0]?.text || "I'm having trouble responding right now. Please try again!";
      const reply = data.reply || "I'm having trouble responding right now. Please try again!";
        
      this.history.push({ role: 'assistant', content: reply });
      this.addBotMessage(reply);

      // Bonus XP if correction happened
      if (reply.includes('💡 Corrección:')) {
        this.chatXP += 3;
        document.getElementById('chatPoints').textContent = this.chatXP;
        App.addXP(5, 'Error corregido por Emma');
      } else {
        App.addXP(2, 'Mensaje enviado al chatbot');
      }

    } catch (err) {
      this.removeLoadingMessage(loadingId);
      console.error('Chat error:', err);

      // Fallback: local responses
      const fallback = this.getFallbackResponse(text);
      this.addBotMessage(fallback);
      App.addXP(2, 'Mensaje enviado al chatbot');
    }
  },

  getFallbackResponse(text) {
    const lower = text.toLowerCase();
    const responses = [
      { match: ['hello', 'hi', 'hey'], reply: "Hello there! Great to hear from you. How are you doing today? 😊" },
      { match: ['good', 'fine', 'great', 'well'], reply: "That's wonderful to hear! Tell me more about your day. What have you been up to?" },
      { match: ['bad', 'sad', 'tired'], reply: "I'm sorry to hear that. Remember, every day you practice English is progress! What would make you feel better?" },
      { match: ['food', 'eat', 'hungry'], reply: "Oh, I love talking about food! What's your favorite dish? Can you describe it in English?" },
      { match: ['family', 'brother', 'sister', 'mom', 'dad'], reply: "Family is so important! Tell me about your family. How many people are in your family?" },
      { match: ['work', 'job', 'study', 'school'], reply: "Interesting! Do you enjoy what you do? Tell me more about your work or studies." },
      { match: ['travel', 'trip', 'visit'], reply: "Travel is amazing for learning languages! Have you ever traveled somewhere where English was spoken?" },
    ];

    for (const r of responses) {
      if (r.match.some(m => lower.includes(m))) return r.reply;
    }

    const defaults = [
      "That's really interesting! Could you tell me more about that? I'd love to hear your thoughts. 😊",
      "Great effort writing in English! What you said makes perfect sense. Can you expand on that?",
      "I understand! English practice like this is so valuable. What else would you like to talk about?",
      "Very good! You're communicating well in English. Keep it up! What topic interests you most?",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  },

  addMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const isUser = role === 'user';
    const div = document.createElement('div');
    div.className = `msg ${isUser ? 'msg-user' : 'msg-bot'}`;
    div.innerHTML = `
      ${!isUser ? '<div class="msg-avatar">🤖</div>' : ''}
      <div class="msg-bubble">${this.escapeHtml(text)}</div>
      ${isUser ? '<div class="msg-avatar">👤</div>' : ''}
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  addBotMessage(text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg msg-bot';

    // Split main reply and correction
    const correctionIdx = text.indexOf('💡 Corrección:');
    let mainText = text;
    let correction = '';

    if (correctionIdx !== -1) {
      mainText = text.slice(0, correctionIdx).trim();
      correction = text.slice(correctionIdx).trim();
    }

    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div>
        <div class="msg-bubble">${this.formatText(mainText)}</div>
        ${correction ? `<div class="msg-correction">${this.formatText(correction)}</div>` : ''}
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  addLoadingMessage() {
    const container = document.getElementById('chatMessages');
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');
    div.className = 'msg msg-bot msg-loading';
    div.id = id;
    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  },

  removeLoadingMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  formatText(text) {
    return this.escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  },

  useSuggestion(btn) {
    const text = btn.textContent.trim();
    document.getElementById('chatInput').value = text;
    document.getElementById('chatInput').focus();
  },
};
