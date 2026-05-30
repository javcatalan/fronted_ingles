// ===== QUIZ MODULE =====
const Quiz = {
  questions: [],
  current: 0,
  score: 0,
  answered: false,
  level: 'beginner',

  reset() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
      <div class="quiz-start">
        <div class="quiz-icon">🎯</div>
        <h3>¿Listo para el quiz?</h3>
        <p>10 preguntas de vocabulario y gramática. Ganarás puntos por cada respuesta correcta.</p>
        <div class="quiz-options">
          <label>Selecciona nivel:
            <select id="quizLevel">
              <option value="beginner">🌱 Principiante</option>
              <option value="intermediate">🌿 Intermedio</option>
              <option value="advanced">🌳 Avanzado</option>
            </select>
          </label>
        </div>
        <button class="btn-primary" id="startQuizBtn" onclick="Quiz.start()">Comenzar quiz</button>
      </div>
    `;
  },

  start() {
    const levelSelect = document.getElementById('quizLevel');
    this.level = levelSelect ? levelSelect.value : 'beginner';
    const pool = [...(QUIZ_QUESTIONS[this.level] || QUIZ_QUESTIONS.beginner)];
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.questions = pool.slice(0, 10);
    this.current = 0;
    this.score = 0;
    this.answered = false;
    this.renderQuestion();
  },

  renderQuestion() {
    if (this.current >= this.questions.length) {
      this.showResult();
      return;
    }

    const q = this.questions[this.current];
    const progress = ((this.current) / this.questions.length * 100).toFixed(0);

    document.getElementById('quizContainer').innerHTML = `
      <div class="quiz-card">
        <div class="quiz-meta">
          <span class="quiz-num">Pregunta ${this.current + 1} de ${this.questions.length}</span>
          <span class="quiz-score-live">⭐ ${this.score} correctas</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-answers">
          ${q.options.map((opt, i) => `
            <button class="quiz-answer" data-index="${i}" onclick="Quiz.answer(${i})">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <button class="btn-primary" id="quizNextBtn" style="display:none" onclick="Quiz.next()">
          ${this.current + 1 < this.questions.length ? 'Siguiente pregunta →' : 'Ver resultado'}
        </button>
      </div>
    `;

    this.answered = false;
  },

  answer(selectedIdx) {
    if (this.answered) return;
    this.answered = true;

    const q = this.questions[this.current];
    const buttons = document.querySelectorAll('.quiz-answer');
    const feedback = document.getElementById('quizFeedback');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIdx === q.correct) {
      this.score++;
      buttons[selectedIdx].classList.add('selected-correct');
      feedback.style.color = 'var(--accent)';
      feedback.textContent = `✓ ¡Correcto! ${q.explanation}`;
    } else {
      buttons[selectedIdx].classList.add('selected-wrong');
      buttons[q.correct].classList.add('show-correct');
      feedback.style.color = 'var(--accent3)';
      feedback.textContent = `✗ Incorrecto. ${q.explanation}`;
    }

    document.getElementById('quizNextBtn').style.display = 'block';
  },

  next() {
    this.current++;
    this.renderQuestion();
  },

  showResult() {
    const total = this.questions.length;
    const pct = Math.round((this.score / total) * 100);
    let emoji, msg;

    if (pct === 100) { emoji = '🏆'; msg = '¡Perfecto! Eres increíble.'; }
    else if (pct >= 80) { emoji = '⭐'; msg = '¡Excelente trabajo!'; }
    else if (pct >= 60) { emoji = '👍'; msg = 'Bien hecho. ¡Sigue practicando!'; }
    else if (pct >= 40) { emoji = '📚'; msg = 'Necesitas repasar un poco más.'; }
    else { emoji = '💪'; msg = '¡No te rindas! El inglés toma tiempo.'; }

    const xpEarned = this.score * 5;

    document.getElementById('quizContainer').innerHTML = `
      <div class="quiz-result">
        <div class="result-emoji">${emoji}</div>
        <div class="result-score">${this.score}/${total}</div>
        <h3>${msg}</h3>
        <p>Respondiste <strong>${this.score} de ${total}</strong> preguntas correctamente (${pct}%)<br>
           <span style="color:var(--accent)">+${xpEarned} XP ganados</span></p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn-primary" onclick="Quiz.start()">Intentar de nuevo</button>
          <button class="btn-ghost" onclick="App.navigate('lessons')">Ir a lecciones</button>
        </div>
      </div>
    `;

    // Update state
    App.state.quizzesCompleted++;
    if (pct === 100) App.state.perfectQuiz = true;
    App.saveState();
    App.addXP(xpEarned, `Quiz de ${this.level} completado`);
    App.checkBadges();
  },
};
