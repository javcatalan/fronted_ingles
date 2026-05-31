// ===== VOCABULARY MODULE =====
const Vocabulary = {
  currentCategory: null,
  currentWords: [],
  currentMode: null,
  practiceWords: [],
  practiceIndex: 0,
  practiceScore: 0,

  CATEGORIES: [
    { id: 'verbs',    name: 'Verbos',      icon: '🏃', color: '#4fffb0' },
    { id: 'clothing', name: 'Ropa',        icon: '👕', color: '#7b61ff' },
    { id: 'vehicles', name: 'Vehículos',   icon: '🚗', color: '#ff6b6b' },
    { id: 'fruits',   name: 'Frutas',      icon: '🍎', color: '#ffd93d' },
    { id: 'tools',    name: 'Herramientas',icon: '🔧', color: '#6bcb77' },
    { id: 'body',     name: 'Cuerpo',      icon: '💪', color: '#ff9f43' },
    { id: 'animals',  name: 'Animales',    icon: '🐾', color: '#54a0ff' },
    { id: 'food',     name: 'Comida',      icon: '🍽️', color: '#ff6b9d' },
    { id: 'colors',   name: 'Colores',     icon: '🎨', color: '#a29bfe' },
    { id: 'numbers',  name: 'Números',     icon: '🔢', color: '#fd79a8' },
  ],

  init() {
    this.renderCategories();
  },

  renderCategories() {
    const container = document.getElementById('vocabCategories');
    if (!container) return;

    const learned = JSON.parse(localStorage.getItem('vocab_learned') || '{}');

    container.innerHTML = this.CATEGORIES.map(cat => {
      const done = learned[cat.id] || 0;
      return `
        <div class="vocab-cat-card" onclick="Vocabulary.openCategory('${cat.id}')"
             style="--cat-color: ${cat.color}">
          <div class="vocab-cat-icon">${cat.icon}</div>
          <div class="vocab-cat-info">
            <h4>${cat.name}</h4>
            <div class="vocab-cat-progress">
              <div class="vocab-cat-bar" id="catBar-${cat.id}" style="width:0%"></div>
            </div>
            <span class="vocab-cat-count" id="catCount-${cat.id}">Cargando...</span>
          </div>
          <div class="vocab-cat-arrow">→</div>
        </div>
      `;
    }).join('');

    // Load counts from Supabase
    this.loadCategoryCounts();
  },

  async loadCategoryCounts() {
    const learned = JSON.parse(localStorage.getItem('vocab_learned') || '{}');
    for (const cat of this.CATEGORIES) {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/vocabulary?category=eq.${cat.id}&select=id`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const data = await res.json();
        const total = data.length;
        const done = learned[cat.id] || 0;
        const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

        const countEl = document.getElementById(`catCount-${cat.id}`);
        const barEl = document.getElementById(`catBar-${cat.id}`);
        if (countEl) countEl.textContent = `${done}/${total} palabras`;
        if (barEl) barEl.style.width = `${pct}%`;
      } catch(e) {}
    }
  },

  async openCategory(categoryId) {
    this.currentCategory = categoryId;
    const cat = this.CATEGORIES.find(c => c.id === categoryId);

    // Show loading
    document.getElementById('vocabCategories').style.display = 'none';
    document.getElementById('vocabDetail').style.display = 'block';
    document.getElementById('vocabDetailTitle').textContent = `${cat.icon} ${cat.name}`;
    document.getElementById('vocabWordList').innerHTML =
      '<p style="color:var(--text3);padding:20px;">Cargando palabras...</p>';

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/vocabulary?category=eq.${categoryId}&order=english`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      this.currentWords = await res.json();
      this.renderWordList();
    } catch(e) {
      document.getElementById('vocabWordList').innerHTML =
        '<p style="color:var(--accent3);">Error cargando palabras.</p>';
    }
  },

  renderWordList() {
    const container = document.getElementById('vocabWordList');
    const words = this.currentWords;

    container.innerHTML = words.map(w => `
      <div class="vocab-word-row" onclick="Vocabulary.speakWord('${w.english}')">
        <span class="vocab-word-emoji">${w.image_emoji || '📝'}</span>
        <div class="vocab-word-info">
          <strong>${w.english}</strong>
          <span>${w.spanish}</span>
        </div>
        <span class="vocab-word-pron">${w.pronunciation}</span>
        <button class="vocab-speak-btn" onclick="event.stopPropagation(); Vocabulary.speakWord('${w.english}')">🔊</button>
      </div>
    `).join('');
  },

  backToCategories() {
    document.getElementById('vocabCategories').style.display = 'grid';
    document.getElementById('vocabDetail').style.display = 'none';
    this.currentMode = null;
    document.getElementById('vocabPractice').style.display = 'none';
    this.renderCategories();
  },

  selectMode(mode) {
    this.currentMode = mode;
    const count = Math.min(this.currentWords.length, 10);
    const shuffled = [...this.currentWords].sort(() => Math.random() - 0.5);
    this.practiceWords = shuffled.slice(0, count);
    this.practiceIndex = 0;
    this.practiceScore = 0;

    document.getElementById('vocabDetail').style.display = 'none';
    document.getElementById('vocabPractice').style.display = 'block';

    this.renderPracticeQuestion();
  },

  renderPracticeQuestion() {
    const container = document.getElementById('vocabPracticeContent');
    const words = this.practiceWords;
    const idx = this.practiceIndex;

    if (idx >= words.length) {
      this.showPracticeResult();
      return;
    }

    const word = words[idx];
    const progress = Math.round((idx / words.length) * 100);
    const cat = this.CATEGORIES.find(c => c.id === this.currentCategory);

    // Header
    document.getElementById('vocabPracticeTitle').textContent =
      this.currentMode === 'flashcard' ? '🃏 Flashcards' :
      this.currentMode === 'matching'  ? '🔗 Matching' : '✍️ Escritura';

    document.getElementById('vocabPracticeProgress').textContent =
      `${idx + 1} / ${words.length}`;
    document.getElementById('vocabPracticeBar').style.width = `${progress}%`;

    if (this.currentMode === 'flashcard') {
      this.renderFlashcard(word, container);
    } else if (this.currentMode === 'matching') {
      this.renderMatching(word, container, words);
    } else {
      this.renderWriting(word, container);
    }
  },

  renderFlashcard(word, container) {
    container.innerHTML = `
      <div class="flashcard" id="flashcard" onclick="Vocabulary.flipCard()">
        <div class="flashcard-inner" id="flashcardInner">
          <div class="flashcard-front">
            <div class="fc-emoji">${word.image_emoji || '📝'}</div>
            <div class="fc-word">${word.english}</div>
            <div class="fc-pron">${word.pronunciation}</div>
            <div class="fc-hint">Toca para ver la traducción</div>
          </div>
          <div class="flashcard-back">
            <div class="fc-emoji">${word.image_emoji || '📝'}</div>
            <div class="fc-word">${word.spanish}</div>
            <div class="fc-example">"${word.example_en}"</div>
            <div class="fc-example-es">${word.example_es}</div>
          </div>
        </div>
      </div>
      <div class="flashcard-actions" id="fcActions" style="display:none">
        <button class="btn-fc wrong" onclick="Vocabulary.flashcardAnswer(false)">😕 No la sabía</button>
        <button class="btn-fc correct" onclick="Vocabulary.flashcardAnswer(true)">✓ La sabía</button>
      </div>
      <button class="btn-ghost" style="margin-top:12px;width:100%" onclick="Vocabulary.speakWord('${word.english}')">
        🔊 Escuchar pronunciación
      </button>
    `;
  },

  flipCard() {
    const inner = document.getElementById('flashcardInner');
    inner.classList.toggle('flipped');
    document.getElementById('fcActions').style.display = 'flex';
  },

  flashcardAnswer(knew) {
    if (knew) this.practiceScore++;
    this.practiceIndex++;
    this.renderPracticeQuestion();
  },

  renderMatching(word, container, allWords) {
    // Get 3 wrong options + 1 correct
    const others = allWords.filter(w => w.english !== word.english)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...others, word].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="matching-question">
        <div class="match-word">
          <span class="match-emoji">${word.image_emoji || '📝'}</span>
          <span class="match-english">${word.english}</span>
          <button onclick="Vocabulary.speakWord('${word.english}')" class="speak-inline">🔊</button>
        </div>
        <p class="match-instruction">¿Cuál es la traducción correcta?</p>
        <div class="match-options">
          ${options.map(opt => `
            <button class="match-option" onclick="Vocabulary.checkMatch(this, '${opt.spanish}', '${word.spanish}')">
              ${opt.spanish}
            </button>
          `).join('')}
        </div>
        <div class="match-feedback" id="matchFeedback"></div>
      </div>
    `;
  },

  checkMatch(btn, selected, correct) {
    const allBtns = document.querySelectorAll('.match-option');
    allBtns.forEach(b => b.disabled = true);
    const feedback = document.getElementById('matchFeedback');

    if (selected === correct) {
      btn.classList.add('match-correct');
      feedback.innerHTML = '✓ ¡Correcto!';
      feedback.style.color = 'var(--accent)';
      this.practiceScore++;
    } else {
      btn.classList.add('match-wrong');
      allBtns.forEach(b => { if (b.textContent.trim() === correct) b.classList.add('match-correct'); });
      feedback.innerHTML = `✗ Era: <strong>${correct}</strong>`;
      feedback.style.color = 'var(--accent3)';
    }

    setTimeout(() => {
      this.practiceIndex++;
      this.renderPracticeQuestion();
    }, 1200);
  },

  renderWriting(word, container) {
    container.innerHTML = `
      <div class="writing-question">
        <div class="writing-prompt">
          <span class="writing-emoji">${word.image_emoji || '📝'}</span>
          <p>¿Cómo se dice en inglés?</p>
          <strong class="writing-spanish">${word.spanish}</strong>
          <button onclick="Vocabulary.speakWord('${word.english}')" class="speak-inline" title="Pista: escuchar">🔊 Pista</button>
        </div>
        <input type="text" id="writingInput" placeholder="Escribe en inglés..." autocomplete="off"
          onkeydown="if(event.key==='Enter') Vocabulary.checkWriting('${word.english}', '${word.spanish}')" />
        <button class="btn-primary" style="width:100%;margin-top:10px"
          onclick="Vocabulary.checkWriting('${word.english}', '${word.spanish}')">
          Verificar →
        </button>
        <div class="writing-feedback" id="writingFeedback"></div>
      </div>
    `;
    setTimeout(() => document.getElementById('writingInput')?.focus(), 100);
  },

  checkWriting(correct, spanish) {
    const input = document.getElementById('writingInput');
    const feedback = document.getElementById('writingFeedback');
    const userAnswer = input.value.trim().toLowerCase();
    const correctLower = correct.toLowerCase();

    input.disabled = true;

    if (userAnswer === correctLower) {
      input.style.borderColor = 'var(--accent)';
      feedback.innerHTML = '✓ ¡Perfecto!';
      feedback.style.color = 'var(--accent)';
      this.practiceScore++;
      setTimeout(() => { this.practiceIndex++; this.renderPracticeQuestion(); }, 1000);
    } else {
      // Close enough? (typo forgiveness)
      const similarity = this.similarityScore(userAnswer, correctLower);
      if (similarity > 0.8) {
        input.style.borderColor = 'var(--accent)';
        feedback.innerHTML = `✓ ¡Casi perfecto! La respuesta es: <strong>${correct}</strong>`;
        feedback.style.color = 'var(--accent)';
        this.practiceScore++;
        setTimeout(() => { this.practiceIndex++; this.renderPracticeQuestion(); }, 1500);
      } else {
        input.style.borderColor = 'var(--accent3)';
        feedback.innerHTML = `✗ La respuesta correcta es: <strong>${correct}</strong>`;
        feedback.style.color = 'var(--accent3)';
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn-ghost';
        retryBtn.style = 'margin-top:10px;width:100%';
        retryBtn.textContent = 'Continuar →';
        retryBtn.onclick = () => { this.practiceIndex++; this.renderPracticeQuestion(); };
        feedback.appendChild(retryBtn);
      }
    }
  },

  similarityScore(a, b) {
    if (a === b) return 1;
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1;
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }
    return matches / longer.length;
  },

  showPracticeResult() {
    const total = this.practiceWords.length;
    const pct = Math.round((this.practiceScore / total) * 100);
    const cat = this.CATEGORIES.find(c => c.id === this.currentCategory);
    const xpEarned = this.practiceScore * 3;

    let emoji, msg;
    if (pct === 100) { emoji = '🏆'; msg = '¡Perfecto! ¡Las conoces todas!'; }
    else if (pct >= 70) { emoji = '⭐'; msg = '¡Muy bien! Sigue practicando.'; }
    else { emoji = '💪'; msg = 'Sigue practicando, ¡vas mejorando!'; }

    // Save progress
    const learned = JSON.parse(localStorage.getItem('vocab_learned') || '{}');
    learned[this.currentCategory] = Math.max(learned[this.currentCategory] || 0, this.practiceScore);
    localStorage.setItem('vocab_learned', JSON.stringify(learned));

    // Add XP
    App.addXP(xpEarned, `Vocabulario de ${cat.name} practicado`);

    // Check badge
    if (pct === 100) {
      const badgeKey = `vocab_${this.currentCategory}`;
      if (!App.state.badges.includes(badgeKey)) {
        App.state.badges.push(badgeKey);
        App.saveState();
        setTimeout(() => Toast.show(`🏅 ¡Insignia: ${cat.icon} Maestro de ${cat.name}!`, 'success'), 600);
      }
    }

    document.getElementById('vocabPracticeContent').innerHTML = `
      <div class="vocab-result">
        <div class="vr-emoji">${emoji}</div>
        <div class="vr-score">${this.practiceScore}/${total}</div>
        <h3>${msg}</h3>
        <p>Ganaste <strong style="color:var(--accent)">+${xpEarned} XP</strong></p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px">
          <button class="btn-primary" onclick="Vocabulary.selectMode('${this.currentMode}')">Practicar de nuevo</button>
          <button class="btn-ghost" onclick="Vocabulary.backToCategoryDetail()">Cambiar modo</button>
          <button class="btn-ghost" onclick="Vocabulary.backToCategories()">Ver categorías</button>
        </div>
      </div>
    `;
  },

  backToCategoryDetail() {
    document.getElementById('vocabPractice').style.display = 'none';
    document.getElementById('vocabDetail').style.display = 'block';
  },

  speakWord(word) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  },
};
