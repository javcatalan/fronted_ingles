// ===== PROGRESS MODULE =====
const Progress = {
  render() {
    this.updateXPDisplay();
    this.renderStats();
    this.renderBadges();
  },

  updateXPDisplay() {
    const xp = App.state.xp;
    const level = this.getLevel(xp);
    const nextLevel = this.getNextLevel(xp);

    // Update XP text
    const xpEl = document.getElementById('xpAmount');
    if (xpEl) xpEl.textContent = xp;

    // Level name
    const levelNameEl = document.getElementById('levelName');
    if (levelNameEl) levelNameEl.textContent = level.name;

    // XP to next
    const xpToNextEl = document.getElementById('xpToNext');
    if (xpToNextEl) {
      if (nextLevel) {
        const remaining = nextLevel.min - xp;
        xpToNextEl.textContent = `Necesitas ${remaining} XP más para ser "${nextLevel.name}"`;
      } else {
        xpToNextEl.textContent = '¡Has alcanzado el nivel máximo! 🏆';
      }
    }

    // Progress bar
    const pct = nextLevel
      ? Math.min(100, ((xp - level.min) / (nextLevel.min - level.min)) * 100)
      : 100;

    const barEl = document.getElementById('xpBar');
    if (barEl) barEl.style.width = `${pct}%`;

    // SVG ring
    const ring = document.getElementById('xpRing');
    if (ring) {
      const circumference = 339;
      const dashOffset = circumference - (circumference * pct / 100);
      ring.style.strokeDashoffset = dashOffset;
    }

    // Nav XP badge
    const navBadge = document.getElementById('navXpBadge');
    if (navBadge) navBadge.textContent = `${xp} XP`;
  },

  getLevel(xp) {
    for (let i = LEVEL_NAMES.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_NAMES[i].min) return LEVEL_NAMES[i];
    }
    return LEVEL_NAMES[0];
  },

  getNextLevel(xp) {
    for (const level of LEVEL_NAMES) {
      if (xp < level.min) return level;
    }
    return null;
  },

  renderStats() {
    const s = App.state;
    const els = {
      statLessons: s.completedLessons?.length || 0,
      statQuizzes: s.quizzesCompleted || 0,
      statMessages: s.chatMessages || 0,
      statStreak: `${s.streak || 0} ${(s.streak || 0) === 1 ? 'día' : 'días'}`,
    };

    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  },

  renderBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;

    const earnedBadges = App.state.badges || [];

    grid.innerHTML = BADGES_DATA.map(badge => {
      const earned = earnedBadges.includes(badge.id);
      return `
        <div class="badge-item ${earned ? 'earned' : 'locked'}" title="${badge.condition}">
          <div class="badge-emoji">${badge.emoji}</div>
          <div class="badge-name">${badge.name}</div>
          ${!earned ? '<div style="font-size:0.7rem;color:var(--text3);margin-top:3px;">🔒 Bloqueada</div>' : ''}
        </div>
      `;
    }).join('');
  },
};
