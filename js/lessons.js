// ===== LESSONS MODULE =====
const Lessons = {
  currentLevel: 'beginner',

  init() {
    this.setupTabs();
    this.renderLessons('beginner');
  },

  setupTabs() {
    document.querySelectorAll('.level-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const level = tab.dataset.level;
        this.currentLevel = level;
        this.renderLessons(level);

        // Track visited levels
        if (!App.state.levelsVisited) App.state.levelsVisited = [];
        if (!App.state.levelsVisited.includes(level)) {
          App.state.levelsVisited.push(level);
          App.saveState();
          App.checkBadges();
        }
      });
    });
  },

async renderLessons(level) {
  const grid = document.getElementById('lessonsGrid');
  grid.innerHTML = '<p style="color:var(--text3);padding:20px;">Cargando lecciones...</p>';

  try {
    const lessons = await DB.fetchLessons(level);

    if (!lessons.length) {
      grid.innerHTML = '<p style="color:var(--text3);">No hay lecciones disponibles aún.</p>';
      return;
    }

    grid.innerHTML = lessons.map(lesson => {
      const done = App.state.completedLessons.includes(lesson.id);
      return `
        <div class="lesson-card ${done ? 'completed' : ''}" onclick="Lessons.openLesson('${lesson.id}')">
          <div class="lesson-icon">${lesson.icon}</div>
          <div class="lesson-info">
            <h4>${lesson.title}</h4>
            <p>${lesson.description}</p>
            <div class="lesson-meta">
              <span class="lesson-xp">+${lesson.xp} XP</span>
              <span class="lesson-time">⏱ ${lesson.time_minutes} min</span>
              ${done ? '<span class="lesson-done">✓ Completada</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch(e) {
    grid.innerHTML = '<p style="color:var(--accent3);">Error cargando lecciones. Intenta de nuevo.</p>';
  }
},

async openLesson(id) {
  const lessons = await DB.fetchLessons(this.currentLevel);
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return;

  // Parsear JSON si viene como string de Supabase
  const vocabulary = typeof lesson.vocabulary === 'string' ? JSON.parse(lesson.vocabulary) : lesson.vocabulary || [];
  const grammar    = typeof lesson.grammar    === 'string' ? JSON.parse(lesson.grammar)    : lesson.grammar    || [];
  const exercises  = typeof lesson.exercises  === 'string' ? JSON.parse(lesson.exercises)  : lesson.exercises  || [];

  const container = document.getElementById('lessonContent');
  const done = App.state.completedLessons.includes(id);

  container.innerHTML = `
    <div class="lesson-detail">
      <div class="lesson-detail-header">
        <h2>${lesson.icon} ${lesson.title}</h2>
        <p>${lesson.description} · <strong style="color:var(--accent)">+${lesson.xp} XP</strong> al completar</p>
      </div>

      <div class="lesson-section">
        <h3>📖 Vocabulario clave</h3>
        <div class="vocab-grid">
          ${vocabulary.map(v => `
            <div class="vocab-card" onclick="Lessons.speak('${v.en}')">
              <div class="vocab-en">${v.en}</div>
              <div class="vocab-es">${v.es}</div>
              <div class="vocab-pron">${v.pron}</div>
            </div>
          `).join('')}
        </div>
        <p style="font-size:0.75rem;color:var(--text3);margin-top:8px;">💡 Haz clic en una palabra para escucharla</p>
      </div>

      <div class="lesson-section">
        <h3>📝 Gramática</h3>
        ${grammar.map(g => `
          <div class="grammar-box">
            <h4>${g.title}</h4>
            <p>${g.explanation}</p>
            <p style="margin-top:8px;font-style:italic;color:var(--text)">Ejemplo: ${g.example}</p>
          </div>
        `).join('')}
      </div>

      <div class="lesson-section">
        <h3>✏️ Ejercicios</h3>
        <div class="exercise-area">
          ${exercises.map((ex, i) => `
            <div class="exercise-item" id="ex-${i}">
              <p><strong>${i + 1}.</strong> ${ex.prompt}</p>
              <input type="text" placeholder="Tu respuesta aquí..." id="exInput-${i}"
                onkeydown="if(event.key==='Enter') Lessons.checkExercise(${i}, '${this.escapeStr(ex.answer)}', '${this.escapeStr(ex.hint)}')" />
              <div class="exercise-feedback" id="exFb-${i}"></div>
              <button class="btn-ghost" style="margin-top:8px;padding:6px 14px;font-size:0.8rem;"
                onclick="Lessons.checkExercise(${i}, '${this.escapeStr(ex.answer)}', '${this.escapeStr(ex.hint)}')">Verificar</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="lesson-complete-btn">
        ${done
          ? `<button class="btn-ghost" disabled>✓ Ya completaste esta lección</button>`
          : `<button class="btn-primary" onclick="Lessons.complete('${id}', ${lesson.xp}, '${lesson.title}')">
               Marcar como completada → +${lesson.xp} XP
             </button>`
        }
        <button class="btn-ghost" onclick="App.navigate('lessons')">Volver a lecciones</button>
      </div>
    </div>
  `;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-lesson-detail').classList.add('active');
  window.scrollTo(0, 0);
},

  escapeStr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  },

  checkExercise(i, answer, hint) {
    const input = document.getElementById(`exInput-${i}`);
    const fb = document.getElementById(`exFb-${i}`);
    const userAns = input.value.trim().toLowerCase();
    const correctAns = answer.toLowerCase();

    if (userAns === correctAns) {
      input.className = 'correct';
      fb.className = 'exercise-feedback ok';
      fb.textContent = '✓ ¡Correcto!';
    } else {
      input.className = 'wrong';
      fb.className = 'exercise-feedback err';
      // Partial credit / hint
      const words = correctAns.split(' ');
      const userWords = userAns.split(' ');
      const closeEnough = words.filter(w => userWords.some(uw => uw.includes(w.slice(0,3)))).length > words.length / 2;
      if (closeEnough && words.length > 1) {
        fb.textContent = `Casi... Pista: ${hint}`;
      } else {
        fb.textContent = `✗ Respuesta: "${answer}" — Pista: ${hint}`;
      }
    }
  },

 complete(id, xp, title) {
  if (App.state.completedLessons.includes(id)) return;

  App.state.completedLessons.push(id);
  App.saveState();
  App.addXP(xp, `Lección "${title}" completada`);
  App.checkBadges();

  const btn = document.querySelector('.lesson-complete-btn .btn-primary');
  if (btn) {
    btn.textContent = '✓ ¡Lección completada!';
    btn.disabled = true;
    btn.className = 'btn-ghost';
  }
},


  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  },
};
