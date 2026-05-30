// ===== CONFIGURACIÓN SUPABASE =====
const SUPABASE_URL = 'https://sffjbdluvalzjrhyeezq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZmpiZGx1dmFsempyaHllZXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzE0NDgsImV4cCI6MjA5NTc0NzQ0OH0.MZOo_M1aAZuNHClYEcbwZH-lhhaA9Vtnhg4YwIAACAs';

// Cache local para no repetir consultas
const Cache = {
  lessons: {},
  quiz: {},

  setLessons(level, data) {
    this.lessons[level] = data;
    sessionStorage.setItem(`lessons_${level}`, JSON.stringify(data));
  },
  getLessons(level) {
    if (this.lessons[level]) return this.lessons[level];
    const s = sessionStorage.getItem(`lessons_${level}`);
    return s ? JSON.parse(s) : null;
  },
  setQuiz(level, data) {
    this.quiz[level] = data;
  },
  getQuiz(level) {
    return this.quiz[level] || null;
  }
};

// ===== API DE SUPABASE =====
const DB = {
  async fetchLessons(level) {
    const cached = Cache.getLessons(level);
    if (cached) return cached;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/lessons?level=eq.${level}&active=eq.true&order=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    );
    const data = await res.json();
    Cache.setLessons(level, data);
    return data;
  },

  async fetchQuizQuestions(level, count = 10) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/quiz_questions?level=eq.${level}&active=eq.true&limit=200`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    );
    const data = await res.json();

    // Mezclar aleatoriamente y tomar los que pidió el usuario
    const shuffled = data.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(q => ({
      q: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correct: q.correct_index,
      explanation: q.explanation,
    }));
  }
};

// ===== DATOS ESTÁTICOS (insignias y niveles) =====
const BADGES_DATA = [
  { id: 'first_lesson', emoji: '🎯', name: 'Primera lección', condition: 'Completa tu primera lección' },
  { id: 'quiz_master', emoji: '🧠', name: 'Quiz Master', condition: 'Completa 3 quizzes' },
  { id: 'chatty', emoji: '💬', name: 'Conversador', condition: 'Envía 10 mensajes al chatbot' },
  { id: 'xp_100', emoji: '⭐', name: '100 XP', condition: 'Alcanza 100 XP', xpRequired: 100 },
  { id: 'xp_300', emoji: '🌟', name: '300 XP', condition: 'Alcanza 300 XP', xpRequired: 300 },
  { id: 'xp_500', emoji: '🏆', name: '500 XP', condition: 'Alcanza 500 XP', xpRequired: 500 },
  { id: 'all_beginner', emoji: '🌱', name: 'Principiante completo', condition: 'Completa todas las lecciones de principiante' },
  { id: 'streak_3', emoji: '🔥', name: 'En racha', condition: 'Estudia 3 días seguidos' },
  { id: 'perfect_quiz', emoji: '💯', name: 'Quiz perfecto', condition: 'Obtén 100% en un quiz' },
  { id: 'explorer', emoji: '🧭', name: 'Explorador', condition: 'Intenta los 3 niveles' },
];

const LEVEL_NAMES = [
  { name: 'Novato',      min: 0 },
  { name: 'Estudiante',  min: 100 },
  { name: 'Aprendiz',    min: 250 },
  { name: 'Competente',  min: 500 },
  { name: 'Avanzado',    min: 800 },
  { name: 'Experto',     min: 1200 },
  { name: 'Maestro',     min: 2000 },
];