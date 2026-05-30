# 🇺🇸 EnglishUp — Plataforma gratuita para aprender inglés

Una plataforma web completa para aprender inglés, con lecciones interactivas, quizzes, chatbot con IA y sistema de gamificación.

---

## 🏗️ Arquitectura

```
englishup/
├── frontend/               ← GitHub Pages (HTML/CSS/JS puro)
│   ├── index.html          ← App principal (Single Page App)
│   ├── css/style.css       ← Diseño completo
│   └── js/
│       ├── data.js         ← Lecciones, quizzes, insignias
│       ├── app.js          ← Navegación y estado global
│       ├── auth.js         ← Autenticación (local + backend)
│       ├── lessons.js      ← Módulo de lecciones
│       ├── quiz.js         ← Módulo de quiz
│       ├── chat.js         ← Chatbot con IA (Anthropic Claude)
│       └── progress.js     ← Progreso y gamificación
└── backend/                ← Render/Heroku (Flask + SQLite)
    ├── app.py              ← API REST completa
    ├── requirements.txt    ← Dependencias Python
    └── render.yaml         ← Config de despliegue en Render
```

---

## ✨ Características

### 📚 Lecciones interactivas
- **12 lecciones** organizadas en 3 niveles (A1-A2, B1, B2)
- Vocabulario con pronunciación IPA
- Gramática explicada con ejemplos
- Ejercicios interactivos con feedback inmediato
- Pronunciación por voz (Web Speech API)

### 🧠 Quiz dinámico
- 10 preguntas por sesión (aleatorias)
- 3 niveles de dificultad
- Feedback detallado por pregunta
- Sistema de puntos XP

### 🤖 Chatbot con IA (Coach Emma)
- Powered by **Claude Sonnet** (Anthropic API)
- Corrige errores gramaticales automáticamente
- Explica correcciones en español
- Sugerencias de conversación
- Fallback offline cuando no hay API

### 🏆 Sistema de gamificación
- **Puntos XP** por cada actividad
- **7 niveles** de usuario (Novato → Maestro)
- **10 insignias** desbloqueables
- **Racha diaria** de estudio
- Barra de progreso visual

### 👤 Autenticación
- Registro e inicio de sesión
- Progreso sincronizado con el backend
- Modo invitado (sin cuenta, localStorage)

---

## 🚀 Despliegue

### Frontend → GitHub Pages

1. Sube la carpeta `frontend/` a un repositorio de GitHub
2. Ve a **Settings → Pages → Source: Deploy from branch → main**
3. Tu app estará en: `https://tuusuario.github.io/englishup/`

```bash
git init
git add frontend/
git commit -m "EnglishUp frontend"
git remote add origin https://github.com/TU_USUARIO/englishup.git
git push -u origin main
```

### Backend → Render (gratis)

1. Sube la carpeta `backend/` a GitHub (mismo repo o separado)
2. Ve a [render.com](https://render.com) → New Web Service
3. Conecta tu repositorio
4. Configuración:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python
5. Agrega variable de entorno: `SECRET_KEY` = (genera una aleatoria)
6. Crea un **Disk** en `/var/data` para persistir SQLite

Tu API estará en: `https://englishup-backend.onrender.com`

### Conectar frontend con backend

En `js/auth.js`, actualiza la URL base:
```javascript
const API_BASE = 'https://tu-backend.onrender.com/api';
```

### API Key de Anthropic (para el chatbot)

El chatbot usa la **Anthropic API** directamente desde el frontend.

> ⚠️ **Nota de seguridad:** Para producción, enruta las llamadas a la IA a través de tu backend Flask para proteger la API key.

Para usar el chatbot en producción:
1. En `backend/app.py`, agrega el endpoint `/api/chat`
2. Coloca tu `ANTHROPIC_API_KEY` como variable de entorno en Render
3. En `js/chat.js`, cambia la URL a tu backend

---

## 🛠️ Desarrollo local

### Frontend
```bash
# Solo abre el archivo (no requiere servidor para básico)
open frontend/index.html

# O usa un servidor local
npx serve frontend/
# → http://localhost:3000
```

### Backend
```bash
cd backend/
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
FLASK_ENV=development python app.py
# → http://localhost:5000
```

---

## 📡 Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET  | `/api/auth/me` | Perfil actual |
| GET  | `/api/progress` | Obtener progreso |
| POST | `/api/progress/sync` | Sincronizar estado |
| POST | `/api/progress/lesson` | Completar lección |
| POST | `/api/progress/quiz` | Guardar quiz |
| POST | `/api/progress/chat` | Registrar mensaje |
| GET  | `/api/leaderboard` | Top 10 usuarios |
| GET  | `/api/stats` | Estadísticas globales |
| GET  | `/api/health` | Estado del servidor |

---

## 🎮 Sistema de XP e Insignias

| Actividad | XP |
|-----------|-----|
| Completar una lección | 20-50 XP según nivel |
| Respuesta correcta en quiz | 5 XP |
| Mensaje al chatbot | 2 XP |
| Error corregido por Emma | 5 XP |
| Registro de cuenta | 10 XP |

### Niveles
| XP | Nivel |
|----|-------|
| 0 | Novato |
| 100 | Estudiante |
| 250 | Aprendiz |
| 500 | Competente |
| 800 | Avanzado |
| 1200 | Experto |
| 2000+ | Maestro |

---

## 🔧 Personalización

### Agregar lecciones
En `js/data.js`, agrega un objeto al array del nivel correspondiente:
```javascript
LESSONS_DATA.beginner.push({
  id: 'b5', title: 'Tu lección', icon: '🎯',
  xp: 25, time: '10 min', level: 'beginner',
  description: 'Descripción',
  vocabulary: [...],
  grammar: [...],
  exercises: [...]
});
```

### Agregar preguntas al quiz
```javascript
QUIZ_QUESTIONS.beginner.push({
  q: 'Pregunta?',
  options: ['A', 'B', 'C', 'D'],
  correct: 0,  // índice de la respuesta correcta
  explanation: 'Explicación de por qué es correcto.'
});
```

---

## 📝 Tecnologías usadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+ (vanilla, sin frameworks)
- **Backend:** Python 3.11+, Flask 3.0, SQLite
- **IA:** Anthropic Claude (claude-sonnet-4)
- **Fuentes:** Syne + DM Sans (Google Fonts)
- **Voz:** Web Speech API (nativa del navegador)
- **Hosting:** GitHub Pages (frontend) + Render (backend)

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.

---

Hecho con ❤️ para ayudar a estudiantes latinoamericanos a aprender inglés gratis.
