// ===== RATINGS & STATS MODULE =====
const Ratings = {
  currentLesson: null,
  selectedStars: 0,

  showModal(lessonId, lessonTitle, lessonIcon) {
    this.currentLesson = { id: lessonId, title: lessonTitle, icon: lessonIcon };
    this.selectedStars = 0;

    document.getElementById('ratingLessonIcon').textContent = lessonIcon || '📚';
    document.getElementById('ratingLessonName').textContent = lessonTitle;
    document.getElementById('ratingName').value = (Auth.user && Auth.user.name) ? Auth.user.name : '';
    document.getElementById('ratingComment').value = '';

    document.querySelectorAll('.star').forEach(s => s.classList.remove('active', 'hover'));
    document.getElementById('ratingModal').classList.add('open');
    this.setupStars();
  },

  setupStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.onclick = () => {
        this.selectedStars = parseInt(star.dataset.star);
        stars.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.star) <= this.selectedStars);
        });
      };
      star.onmouseover = () => {
        stars.forEach(s => {
          s.classList.toggle('hover', parseInt(s.dataset.star) <= parseInt(star.dataset.star));
        });
      };
      star.onmouseleave = () => {
        stars.forEach(s => s.classList.remove('hover'));
      };
    });
  },

  async submit() {
    if (this.selectedStars === 0) {
      Toast.show('Por favor selecciona una calificación con estrellas', 'error');
      return;
    }

    const name    = document.getElementById('ratingName').value.trim() || 'Anónimo';
    const comment = document.getElementById('ratingComment').value.trim();

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/lesson_ratings`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          lesson_id:    this.currentLesson.id,
          lesson_title: this.currentLesson.title,
          stars:        this.selectedStars,
          comment:      comment || null,
          user_name:    name,
        })
      });

      if (!res.ok) throw new Error('Error al guardar');

      this.close();
      Toast.show(`⭐ ¡Gracias por tu calificación, ${name}!`, 'success');
      Stats.loadReviews();
      Stats.loadHomeStats();

    } catch(e) {
      Toast.show('No se pudo guardar. Intenta de nuevo.', 'error');
    }
  },

  close() {
    document.getElementById('ratingModal').classList.remove('open');
  },
};

// ===== STATS MODULE =====
const Stats = {

  async init() {
    this.trackVisit();
    await Promise.all([
      this.loadDashboard(),
      this.loadReviews(),
      this.loadLessonRatings(),
    ]);
  },

  async trackVisit() {
    if (sessionStorage.getItem('visit_tracked')) return;
    sessionStorage.setItem('visit_tracked', '1');
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ page: 'home' })
      });
    } catch(e) {}
  },

  async loadHomeStats() {
    try {
      // Visitantes
      const visRes = await fetch(
        `${SUPABASE_URL}/rest/v1/site_visits?select=id`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const visits = await visRes.json();
      if (Array.isArray(visits)) {
        const el = document.getElementById('statUsers');
        if (el) el.textContent = visits.length.toLocaleString('es-MX');
      }

      // Calificación promedio
      const ratRes = await fetch(
        `${SUPABASE_URL}/rest/v1/lesson_ratings?select=stars`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const rats = await ratRes.json();
      if (Array.isArray(rats) && rats.length > 0) {
        const avg = (rats.reduce((s, r) => s + r.stars, 0) / rats.length).toFixed(1);
        const el = document.getElementById('statRatingHome');
        if (el) el.textContent = `${avg} ⭐`;
      } else {
        const el = document.getElementById('statRatingHome');
        if (el) el.textContent = 'Sin reseñas aún';
      }

      // Lecciones (usamos total de ratings como proxy)
      const el2 = document.getElementById('statLessonsHome');
      if (el2 && Array.isArray(rats)) el2.textContent = rats.length.toLocaleString('es-MX');

    } catch(e) {
      console.error('HomeStats error:', e);
    }
  },

  async loadDashboard() {
    try {
      // Visitantes
      const visRes = await fetch(
        `${SUPABASE_URL}/rest/v1/site_visits?select=id`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const visits = await visRes.json();
      this.setEl('sdVisitors', Array.isArray(visits) ? visits.length.toLocaleString('es-MX') : '0');

      // Calificaciones
      const ratRes = await fetch(
        `${SUPABASE_URL}/rest/v1/lesson_ratings?select=stars`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const rats = await ratRes.json();
      if (Array.isArray(rats) && rats.length > 0) {
        const avg = (rats.reduce((s, r) => s + r.stars, 0) / rats.length).toFixed(1);
        this.setEl('sdRating', `${avg} ⭐ (${rats.length} reseñas)`);
        this.setEl('sdLessons', rats.length.toLocaleString('es-MX'));
      } else {
        this.setEl('sdRating', 'Sin reseñas aún');
        this.setEl('sdLessons', '0');
      }

      // Mensajes al chatbot (desde estado local)
      const messages = App.state.chatMessages || 0;
      this.setEl('sdMessages', messages.toLocaleString('es-MX'));

    } catch(e) {
      console.error('Dashboard error:', e);
      this.setEl('sdVisitors', 'Error');
      this.setEl('sdRating', 'Error');
      this.setEl('sdLessons', 'Error');
      this.setEl('sdMessages', 'Error');
    }
  },

  async loadReviews() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/lesson_ratings?order=created_at.desc&limit=12&comment=not.is.null`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const reviews = await res.json();

      const html = (Array.isArray(reviews) && reviews.length)
        ? reviews.map(r => this.renderReviewCard(r)).join('')
        : '<p style="color:var(--text3);text-align:center;padding:32px;grid-column:1/-1">Sé el primero en dejar una reseña 🌟</p>';

      ['reviewsGrid', 'statsReviewsGrid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      });
    } catch(e) {
      console.error('Reviews error:', e);
    }
  },

  renderReviewCard(r) {
    const stars   = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    const date    = new Date(r.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    const initial = (r.user_name || 'A')[0].toUpperCase();
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${initial}</div>
          <div class="review-meta">
            <strong>${r.user_name || 'Anónimo'}</strong>
            <span class="review-lesson">${r.lesson_title || 'Lección'}</span>
          </div>
          <div class="review-date">${date}</div>
        </div>
        <div class="review-stars">${stars}</div>
        <p class="review-comment">${r.comment}</p>
      </div>
    `;
  },

  async loadLessonRatings() {
    const container = document.getElementById('lessonRatingsTable');
    if (!container) return;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/lesson_ratings?select=lesson_title,stars&order=lesson_title`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();

      if (!Array.isArray(data) || !data.length) {
        container.innerHTML = '<p style="color:var(--text3)">Aún no hay calificaciones.</p>';
        return;
      }

      // Agrupar por lección
      const byLesson = {};
      data.forEach(r => {
        if (!byLesson[r.lesson_title]) byLesson[r.lesson_title] = [];
        byLesson[r.lesson_title].push(r.stars);
      });

      container.innerHTML = `
        <div class="ratings-table">
          ${Object.entries(byLesson).map(([title, stars]) => {
            const avg    = (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1);
            const pct    = (avg / 5) * 100;
            const filled = Math.round(avg);
            return `
              <div class="rating-row">
                <div class="rating-row-title">${title}</div>
                <div class="rating-row-stars">${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}</div>
                <div class="rating-row-bar-wrap">
                  <div class="rating-row-bar" style="width:${pct}%"></div>
                </div>
                <div class="rating-row-num">${avg} <span>(${stars.length})</span></div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch(e) {
      container.innerHTML = '<p style="color:var(--accent3)">Error cargando calificaciones.</p>';
    }
  },

  setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },
};

// ===== SHARE MODULE =====
const Share = {
  open() { document.getElementById('shareModal').classList.add('open'); },
  close() { document.getElementById('shareModal').classList.remove('open'); },
  copy() {
    const url = document.getElementById('shareUrlBox').textContent.trim();
    navigator.clipboard.writeText(url).then(() => {
      Toast.show('¡Enlace copiado! Compártelo 🇲🇽', 'success');
      this.close();
    });
  },
};

// Cerrar modales al hacer clic fuera
document.addEventListener('click', e => {
  if (e.target.id === 'ratingModal') Ratings.close();
  if (e.target.id === 'shareModal')  Share.close();
});

// Cargar estadísticas del home al iniciar
window.addEventListener('DOMContentLoaded', () => {
  Stats.trackVisit();
  Stats.loadHomeStats();
  Stats.loadReviews();
});
