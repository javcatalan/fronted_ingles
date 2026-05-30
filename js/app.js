// ===== APP STATE & NAVIGATION =====
const App = {
  currentPage: 'home',
  state: {
    xp: 0,
    completedLessons: [],
    quizzesCompleted: 0,
    chatMessages: 0,
    streak: 0,
    lastActive: null,
    badges: [],
    perfectQuiz: false,
    levelsVisited: [],
  },

  init() {
    this.loadState();
    this.setupNavigation();
    this.updateStreak();
    Auth.init();
    Progress.render();
  },

  loadState() {
    const saved = localStorage.getItem('englishup_state');
    if (saved) {
      try { this.state = { ...this.state, ...JSON.parse(saved) }; } catch(e) {}
    }
  },

  saveState() {
    localStorage.setItem('englishup_state', JSON.stringify(this.state));
  },

  addXP(amount, reason = '') {
    const oldXP = this.state.xp;
    this.state.xp += amount;
    this.saveState();
    this.showXPGain(amount, reason);
    this.checkBadges();
    Progress.updateXPDisplay();
    const navBadge = document.getElementById('navXpBadge');
    if (navBadge) navBadge.textContent = `${this.state.xp} XP`;
  },

  showXPGain(amount, reason) {
    Toast.show(`+${amount} XP ${reason ? '— ' + reason : ''}`, 'success');
  },

  checkBadges() {
    const s = this.state;
    const earned = [];

    if (s.completedLessons.length >= 1 && !s.badges.includes('first_lesson')) {
      earned.push('first_lesson');
    }
    if (s.quizzesCompleted >= 3 && !s.badges.includes('quiz_master')) {
      earned.push('quiz_master');
    }
    if (s.chatMessages >= 10 && !s.badges.includes('chatty')) {
      earned.push('chatty');
    }
    if (s.xp >= 100 && !s.badges.includes('xp_100')) earned.push('xp_100');
    if (s.xp >= 300 && !s.badges.includes('xp_300')) earned.push('xp_300');
    if (s.xp >= 500 && !s.badges.includes('xp_500')) earned.push('xp_500');
    if (s.streak >= 3 && !s.badges.includes('streak_3')) earned.push('streak_3');
    if (s.perfectQuiz && !s.badges.includes('perfect_quiz')) earned.push('perfect_quiz');

    const beginnerDone = LESSONS_DATA.beginner.every(l => s.completedLessons.includes(l.id));
    if (beginnerDone && !s.badges.includes('all_beginner')) earned.push('all_beginner');

    const allLevels = ['beginner', 'intermediate', 'advanced'];
    if (allLevels.every(l => s.levelsVisited && s.levelsVisited.includes(l)) && !s.badges.includes('explorer')) {
      earned.push('explorer');
    }

    earned.forEach(id => {
      s.badges.push(id);
      const badge = BADGES_DATA.find(b => b.id === id);
      if (badge) {
        setTimeout(() => Toast.show(`🏅 ¡Insignia desbloqueada: ${badge.emoji} ${badge.name}!`, 'success'), 800);
      }
    });

    if (earned.length) {
      this.saveState();
      Progress.render();
    }
  },

  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (this.state.lastActive === yesterday) {
        this.state.streak++;
      } else if (this.state.lastActive !== today) {
        this.state.streak = 1;
      }
      this.state.lastActive = today;
      this.saveState();
    }
  },

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        this.navigate(link.dataset.page);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.activeElement.id === 'chatInput') {
        Chat.send();
      }
    });
  },

  navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) {
      pageEl.classList.add('active');
      this.currentPage = page;
    }

    const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');

    if (page === 'lessons') Lessons.init();
    if (page === 'progress') Progress.render();
    if (page === 'quiz') Quiz.reset();

    window.scrollTo(0, 0);
  },
};

// ===== TOAST =====
const Toast = {
  timer: null,
  show(msg, type = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast show ${type}`;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => el.classList.remove('show'), 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
