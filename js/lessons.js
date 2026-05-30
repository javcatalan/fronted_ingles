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
  const level = this.currentLevel;
  const lessons = await DB.fetchLessons(level);
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return;
  // ... resto igual que antes
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

  complete(id) {
    if (App.state.completedLessons.includes(id)) return;
    const lesson = this.findLesson(id);
    if (!lesson) return;

    App.state.completedLessons.push(id);
    App.saveState();
    App.addXP(lesson.xp, `Lección "${lesson.title}" completada`);
    App.checkBadges();

    // Update button
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
