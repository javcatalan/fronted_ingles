// ===== DATA: Lessons, Quiz Questions, Badges =====
const LESSONS_DATA = {
  beginner: [
    {
      id: 'b1', title: 'Greetings & Introductions', icon: '👋',
      xp: 20, time: '10 min', level: 'beginner',
      description: 'Learn how to say hello and introduce yourself.',
      vocabulary: [
        { en: 'Hello', es: 'Hola', pron: '/həˈloʊ/' },
        { en: 'Goodbye', es: 'Adiós', pron: '/ˌɡʊdˈbaɪ/' },
        { en: 'Please', es: 'Por favor', pron: '/pliːz/' },
        { en: 'Thank you', es: 'Gracias', pron: '/θæŋk juː/' },
        { en: 'Sorry', es: 'Lo siento', pron: '/ˈsɒri/' },
        { en: 'My name is', es: 'Mi nombre es', pron: '/maɪ neɪm ɪz/' },
        { en: 'Nice to meet you', es: 'Mucho gusto', pron: '/naɪs tə miːt juː/' },
        { en: 'How are you?', es: '¿Cómo estás?', pron: '/haʊ ɑːr juː/' },
      ],
      grammar: [
        { title: 'Subject Pronouns', explanation: 'En inglés siempre debes usar el sujeto. Los pronombres son: <code>I</code> (yo), <code>you</code> (tú), <code>he/she</code> (él/ella), <code>we</code> (nosotros), <code>they</code> (ellos).', example: '"I am Maria. She is my friend."' },
        { title: 'Verb "to be" — presente', explanation: 'El verbo ser/estar en inglés es <code>be</code>. Se conjuga: <code>I am</code>, <code>you are</code>, <code>he/she is</code>, <code>we are</code>, <code>they are</code>.', example: '"I am happy. You are my friend."' },
      ],
      exercises: [
        { prompt: 'Traduce: "Hola, mi nombre es Carlos."', answer: 'Hello, my name is Carlos.', hint: 'Usa Hello + my name is' },
        { prompt: 'Completa: "She ___ my teacher." (ser)', answer: 'is', hint: 'She → is' },
        { prompt: 'Traduce: "Mucho gusto."', answer: 'Nice to meet you.', hint: 'Piensa en la frase de presentación' },
      ]
    },
    {
      id: 'b2', title: 'Numbers & Colors', icon: '🔢',
      xp: 20, time: '12 min', level: 'beginner',
      description: 'Count in English and name basic colors.',
      vocabulary: [
        { en: 'One', es: 'Uno', pron: '/wʌn/' },
        { en: 'Two', es: 'Dos', pron: '/tuː/' },
        { en: 'Three', es: 'Tres', pron: '/θriː/' },
        { en: 'Ten', es: 'Diez', pron: '/tɛn/' },
        { en: 'Red', es: 'Rojo', pron: '/rɛd/' },
        { en: 'Blue', es: 'Azul', pron: '/bluː/' },
        { en: 'Green', es: 'Verde', pron: '/ɡriːn/' },
        { en: 'Yellow', es: 'Amarillo', pron: '/ˈjɛloʊ/' },
      ],
      grammar: [
        { title: 'Artículos: a / an', explanation: '<code>a</code> se usa antes de consonantes: "a red car". <code>an</code> se usa antes de vocales: "an orange".', example: '"I have a blue pen. She eats an apple."' },
      ],
      exercises: [
        { prompt: 'Escribe el color en inglés: "verde"', answer: 'green', hint: 'Es una palabra muy parecida a "grín"' },
        { prompt: '¿"an" o "a"? ___ elephant', answer: 'an', hint: '"elephant" empieza con vocal' },
        { prompt: 'Traduce: "Tengo dos gatos rojos."', answer: 'I have two red cats.', hint: 'I have + número + color + sustantivo' },
      ]
    },
    {
      id: 'b3', title: 'Family Members', icon: '👨‍👩‍👧',
      xp: 25, time: '10 min', level: 'beginner',
      description: 'Talk about your family in English.',
      vocabulary: [
        { en: 'Mother / Mom', es: 'Madre / Mamá', pron: '/ˈmʌðər/' },
        { en: 'Father / Dad', es: 'Padre / Papá', pron: '/ˈfɑːðər/' },
        { en: 'Brother', es: 'Hermano', pron: '/ˈbrʌðər/' },
        { en: 'Sister', es: 'Hermana', pron: '/ˈsɪstər/' },
        { en: 'Grandfather', es: 'Abuelo', pron: '/ˈɡrænfɑːðər/' },
        { en: 'Grandmother', es: 'Abuela', pron: '/ˈɡrænmʌðər/' },
        { en: 'Cousin', es: 'Primo/a', pron: '/ˈkʌzən/' },
        { en: 'Uncle / Aunt', es: 'Tío / Tía', pron: '/ˈʌŋkəl/ /ænt/' },
      ],
      grammar: [
        { title: 'Posesivos', explanation: 'Para mostrar posesión usamos: <code>my</code> (mi), <code>your</code> (tu), <code>his</code> (su - de él), <code>her</code> (su - de ella), <code>our</code> (nuestro), <code>their</code> (su - de ellos).', example: '"My brother is tall. Her mother is kind."' },
      ],
      exercises: [
        { prompt: 'Traduce: "Mi hermana se llama Ana."', answer: 'My sister\'s name is Ana.', hint: 'My + sister\'s name is' },
        { prompt: 'Completa: "___ father works here." (él)', answer: 'His', hint: 'Posesivo de él' },
        { prompt: 'Traduce: "Nuestros abuelos viven en Guatemala."', answer: 'Our grandparents live in Guatemala.', hint: 'Our + grandparents + live' },
      ]
    },
    {
      id: 'b4', title: 'Days & Time', icon: '📅',
      xp: 25, time: '15 min', level: 'beginner',
      description: 'Learn the days of the week and how to tell time.',
      vocabulary: [
        { en: 'Monday', es: 'Lunes', pron: '/ˈmʌndeɪ/' },
        { en: 'Tuesday', es: 'Martes', pron: '/ˈtuːzdeɪ/' },
        { en: 'Wednesday', es: 'Miércoles', pron: '/ˈwɛnzdeɪ/' },
        { en: 'Thursday', es: 'Jueves', pron: '/ˈθɜːrzdeɪ/' },
        { en: 'Friday', es: 'Viernes', pron: '/ˈfraɪdeɪ/' },
        { en: 'Saturday', es: 'Sábado', pron: '/ˈsætərdeɪ/' },
        { en: 'Sunday', es: 'Domingo', pron: '/ˈsʌndeɪ/' },
        { en: 'Weekend', es: 'Fin de semana', pron: '/ˌwiːkˈɛnd/' },
      ],
      grammar: [
        { title: 'Preposición "on" con días', explanation: 'Con días de la semana usamos <code>on</code>: "on Monday", "on Fridays". Con "at" para horas: "at 3 o\'clock". Con "in" para períodos: "in the morning".', example: '"I work on Monday. School starts at 8."' },
      ],
      exercises: [
        { prompt: '¿Cómo se dice "Miércoles" en inglés?', answer: 'Wednesday', hint: 'Suena como "wenzday"' },
        { prompt: 'Completa: "I have class ___ Monday."', answer: 'on', hint: 'Días llevan "on"' },
        { prompt: 'Traduce: "El fin de semana descanso."', answer: 'I rest on the weekend.', hint: 'I rest + on the weekend' },
      ]
    },
  ],
  intermediate: [
    {
      id: 'i1', title: 'Present Continuous', icon: '🏃',
      xp: 35, time: '15 min', level: 'intermediate',
      description: 'Talk about what is happening right now.',
      vocabulary: [
        { en: 'Running', es: 'Corriendo', pron: '/ˈrʌnɪŋ/' },
        { en: 'Reading', es: 'Leyendo', pron: '/ˈriːdɪŋ/' },
        { en: 'Cooking', es: 'Cocinando', pron: '/ˈkʊkɪŋ/' },
        { en: 'Sleeping', es: 'Durmiendo', pron: '/ˈsliːpɪŋ/' },
        { en: 'Working', es: 'Trabajando', pron: '/ˈwɜːrkɪŋ/' },
        { en: 'Studying', es: 'Estudiando', pron: '/ˈstʌdiɪŋ/' },
        { en: 'Watching', es: 'Viendo', pron: '/ˈwɒtʃɪŋ/' },
        { en: 'Talking', es: 'Hablando', pron: '/ˈtɔːkɪŋ/' },
      ],
      grammar: [
        { title: 'Estructura del Present Continuous', explanation: 'Se forma con <code>am/is/are + verbo-ing</code>. Sujeto + be + verbo + ing = acción en progreso ahora.', example: '"I am studying English. She is cooking dinner."' },
        { title: 'Negativo e interrogativo', explanation: 'Negativo: <code>I am not sleeping</code>. Pregunta: <code>Are you working?</code> Respuesta corta: "Yes, I am" / "No, I\'m not".', example: '"Are you reading? No, I\'m not. I\'m watching TV."' },
      ],
      exercises: [
        { prompt: 'Escribe: "Ella está cocinando ahora."', answer: 'She is cooking now.', hint: 'She + is + cook + -ing' },
        { prompt: 'Haz la pregunta: "____ they working?" (are/is)', answer: 'Are', hint: 'They → Are' },
        { prompt: 'Traduce: "Nosotros no estamos durmiendo."', answer: 'We are not sleeping.', hint: 'We are not + sleeping' },
      ]
    },
    {
      id: 'i2', title: 'Past Simple', icon: '⏳',
      xp: 40, time: '18 min', level: 'intermediate',
      description: 'Talk about events that already happened.',
      vocabulary: [
        { en: 'Went', es: 'Fue / Fui', pron: '/wɛnt/' },
        { en: 'Ate', es: 'Comió / Comí', pron: '/eɪt/' },
        { en: 'Saw', es: 'Vio / Vi', pron: '/sɔː/' },
        { en: 'Had', es: 'Tuvo / Tuve', pron: '/hæd/' },
        { en: 'Made', es: 'Hizo / Hice', pron: '/meɪd/' },
        { en: 'Said', es: 'Dijo / Dije', pron: '/sɛd/' },
        { en: 'Yesterday', es: 'Ayer', pron: '/ˈjɛstərdeɪ/' },
        { en: 'Last week', es: 'La semana pasada', pron: '/læst wiːk/' },
      ],
      grammar: [
        { title: 'Verbos regulares en pasado', explanation: 'A los verbos regulares se les agrega <code>-ed</code>: walk → walked, cook → cooked, study → studied.', example: '"I walked to school. She cooked dinner yesterday."' },
        { title: 'Verbos irregulares', explanation: 'Los verbos irregulares tienen formas propias: go → went, eat → ate, see → saw, have → had. ¡Hay que memorizarlos!', example: '"I went to the park. We ate pizza."' },
      ],
      exercises: [
        { prompt: 'Pasado de "go":', answer: 'went', hint: 'Verbo irregular' },
        { prompt: 'Traduce: "Ayer comí arroz."', answer: 'Yesterday I ate rice.', hint: 'Yesterday + I + ate' },
        { prompt: 'Completa: "She ___ (walk) to school this morning."', answer: 'walked', hint: 'Regular verb + -ed' },
      ]
    },
    {
      id: 'i3', title: 'Expressing Opinions', icon: '💬',
      xp: 35, time: '14 min', level: 'intermediate',
      description: 'Share your thoughts and opinions in English.',
      vocabulary: [
        { en: 'I think that...', es: 'Creo que...', pron: '/aɪ θɪŋk ðæt/' },
        { en: 'In my opinion', es: 'En mi opinión', pron: '/ɪn maɪ əˈpɪnjən/' },
        { en: 'I agree', es: 'Estoy de acuerdo', pron: '/aɪ əˈɡriː/' },
        { en: 'I disagree', es: 'No estoy de acuerdo', pron: '/aɪ ˌdɪsəˈɡriː/' },
        { en: 'However', es: 'Sin embargo', pron: '/haʊˈɛvər/' },
        { en: 'Although', es: 'Aunque', pron: '/ɔːlˈðoʊ/' },
        { en: 'In addition', es: 'Además', pron: '/ɪn əˈdɪʃən/' },
        { en: 'Therefore', es: 'Por lo tanto', pron: '/ˈðɛrfɔːr/' },
      ],
      grammar: [
        { title: 'Conectores de opinión', explanation: 'Para dar opiniones: <code>I think / I believe / In my opinion</code>. Para contrastar: <code>However / Although / On the other hand</code>. Para añadir: <code>In addition / Furthermore / Also</code>.', example: '"I think dogs are great. However, they need a lot of care."' },
      ],
      exercises: [
        { prompt: 'Traduce: "En mi opinión, el inglés es divertido."', answer: 'In my opinion, English is fun.', hint: 'In my opinion + English + is + fun' },
        { prompt: 'Completa: "I agree ___ you." (with/of)', answer: 'with', hint: 'Agree with someone' },
        { prompt: 'Usa "however": "I like cats. ___, I\'m allergic."', answer: 'However', hint: 'Conector de contraste al inicio de oración' },
      ]
    },
  ],
  advanced: [
    {
      id: 'a1', title: 'Conditional Sentences', icon: '🔀',
      xp: 50, time: '20 min', level: 'advanced',
      description: 'Master the different types of conditionals.',
      vocabulary: [
        { en: 'Unless', es: 'A menos que', pron: '/ənˈlɛs/' },
        { en: 'Provided that', es: 'Siempre que', pron: '/prəˈvaɪdɪd ðæt/' },
        { en: 'As long as', es: 'Siempre y cuando', pron: '/æz lɒŋ æz/' },
        { en: 'Suppose that', es: 'Supón que', pron: '/səˈpoʊz ðæt/' },
        { en: 'Otherwise', es: 'De lo contrario', pron: '/ˈʌðərwaɪz/' },
        { en: 'Regardless', es: 'Sin importar', pron: '/rɪˈɡɑːrdlɪs/' },
        { en: 'Hypothetically', es: 'Hipotéticamente', pron: '/ˌhaɪpəˈθɛtɪkli/' },
        { en: 'Would have', es: 'Habría', pron: '/wʊd hæv/' },
      ],
      grammar: [
        { title: 'First Conditional (real/posible)', explanation: 'Para situaciones posibles: <code>If + present simple, will + base verb</code>. Expresa consecuencias probables.', example: '"If it rains, I will stay home."' },
        { title: 'Second Conditional (hipotético)', explanation: 'Para situaciones hipotéticas o poco probables: <code>If + past simple, would + base verb</code>.', example: '"If I had a million dollars, I would travel the world."' },
        { title: 'Third Conditional (pasado irreal)', explanation: 'Para situaciones pasadas que no ocurrieron: <code>If + past perfect, would have + past participle</code>.', example: '"If I had studied harder, I would have passed the exam."' },
      ],
      exercises: [
        { prompt: 'Completa: "If I ___ (be) you, I would apologize."', answer: 'were', hint: '2nd conditional: pasado subjuntivo, "were" para todos' },
        { prompt: 'Traduce: "Si hubiera llegado antes, lo habría visto."', answer: 'If I had arrived earlier, I would have seen him.', hint: '3rd conditional: had + pp / would have + pp' },
        { prompt: 'Completa: "If it ___ (rain), we will cancel the event."', answer: 'rains', hint: '1st conditional: presente simple en la condición' },
      ]
    },
    {
      id: 'a2', title: 'Passive Voice', icon: '🔄',
      xp: 45, time: '18 min', level: 'advanced',
      description: 'Learn when and how to use the passive voice effectively.',
      vocabulary: [
        { en: 'Was built', es: 'Fue construido', pron: '/wɒz bɪlt/' },
        { en: 'Has been made', es: 'Ha sido hecho', pron: '/hæz biːn meɪd/' },
        { en: 'Is being written', es: 'Está siendo escrito', pron: '/ɪz ˈbiːɪŋ ˈrɪtən/' },
        { en: 'Will be done', es: 'Será hecho', pron: '/wɪl biː dʌn/' },
        { en: 'By whom', es: 'Por quién', pron: '/baɪ huːm/' },
        { en: 'To be announced', es: 'Por anunciarse', pron: '/tə biː əˈnaʊnst/' },
        { en: 'Reportedly', es: 'Según se informa', pron: '/rɪˈpɔːrtɪdli/' },
        { en: 'Allegedly', es: 'Supuestamente', pron: '/əˈlɛdʒɪdli/' },
      ],
      grammar: [
        { title: 'Estructura de la voz pasiva', explanation: 'Activa: subject + verb + object. Pasiva: <code>object + be (conjugado) + past participle (+ by + agent)</code>.', example: '"The cake was eaten by Maria." (Active: Maria ate the cake.)"' },
        { title: 'Usos de la voz pasiva', explanation: 'Se usa cuando: el agente es desconocido ("The car was stolen"), el agente es obvio, o queremos enfatizar el objeto/acción en lugar del sujeto.', example: '"English is spoken worldwide. The results will be announced tomorrow."' },
      ],
      exercises: [
        { prompt: 'Pasa a pasiva: "They built this bridge in 1950."', answer: 'This bridge was built in 1950.', hint: 'Subject pasiva + was/were + past participle' },
        { prompt: 'Completa: "The letter ___ (write) by my sister."', answer: 'was written', hint: 'Past passive: was/were + past participle' },
        { prompt: 'Traduce: "El informe está siendo revisado."', answer: 'The report is being reviewed.', hint: 'is being + past participle' },
      ]
    },
  ]
};

const QUIZ_QUESTIONS = {
  beginner: [
    { q: 'What does "Goodbye" mean in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Por favor'], correct: 1, explanation: '"Goodbye" means "Adiós" in Spanish.' },
    { q: 'Choose the correct form: "She ___ my sister."', options: ['am', 'are', 'is', 'be'], correct: 2, explanation: 'He/She/It uses "is" in the present.' },
    { q: 'What color is "verde" in English?', options: ['Blue', 'Yellow', 'Red', 'Green'], correct: 3, explanation: '"Verde" = Green in English.' },
    { q: 'Which article goes with "apple"?', options: ['a', 'an', 'the', 'some'], correct: 1, explanation: '"Apple" starts with a vowel, so we use "an".' },
    { q: 'How do you say "lunes" in English?', options: ['Sunday', 'Friday', 'Monday', 'Tuesday'], correct: 2, explanation: '"Lunes" = Monday.' },
    { q: 'What is "hermano" in English?', options: ['Sister', 'Brother', 'Father', 'Mother'], correct: 1, explanation: '"Hermano" = Brother.' },
    { q: 'Choose: "I ___ happy today."', options: ['is', 'are', 'am', 'be'], correct: 2, explanation: 'With "I" we use "am".' },
    { q: '"Please" means...', options: ['Lo siento', 'Gracias', 'Por favor', 'De nada'], correct: 2, explanation: '"Please" = "Por favor".' },
    { q: 'Complete: "They ___ my friends."', options: ['is', 'am', 'are', 'be'], correct: 2, explanation: 'With "they" we use "are".' },
    { q: 'What is "abuela" in English?', options: ['Grandfather', 'Mother', 'Aunt', 'Grandmother'], correct: 3, explanation: '"Abuela" = Grandmother.' },
  ],
  intermediate: [
    { q: 'Which sentence uses Present Continuous correctly?', options: ['She cooks now.', 'She is cooking now.', 'She cooking now.', 'She cook now.'], correct: 1, explanation: 'Present Continuous = is/am/are + verb-ing.' },
    { q: 'Past tense of "go" is:', options: ['goed', 'gone', 'went', 'goes'], correct: 2, explanation: '"Go" is irregular: go → went.' },
    { q: 'Choose the correct connector: "I like coffee. ___, I prefer tea."', options: ['Also', 'However', 'Therefore', 'Besides'], correct: 1, explanation: '"However" shows contrast between two ideas.' },
    { q: 'Correct past tense: "She ___ (walk) to school yesterday."', options: ['walk', 'walks', 'walked', 'walking'], correct: 2, explanation: 'Regular verb in past: add -ed.' },
    { q: '"I agree ___ you" — correct preposition:', options: ['to', 'with', 'for', 'of'], correct: 1, explanation: 'We say "agree with" someone.' },
    { q: 'Which is NOT a present continuous form?', options: ['am running', 'is eating', 'are slept', 'is working'], correct: 2, explanation: '"are slept" is wrong. It should be "are sleeping".' },
    { q: '"In my opinion" is used to express:', options: ['A fact', 'A command', 'An opinion', 'A question'], correct: 2, explanation: '"In my opinion" introduces personal views.' },
    { q: '"Last week" signals which tense?', options: ['Present', 'Future', 'Past', 'Present perfect'], correct: 2, explanation: '"Last week" is a past time marker.' },
    { q: 'What does "although" mean?', options: ['Por lo tanto', 'Además', 'Sin embargo', 'Aunque'], correct: 3, explanation: '"Although" = "Aunque" — shows contrast.' },
    { q: 'Correct form: "They ___ studying right now."', options: ['was', 'is', 'are', 'am'], correct: 2, explanation: 'They → are.' },
  ],
  advanced: [
    { q: 'Which is a correct Second Conditional?', options: ['If it will rain, I stay.', 'If I were rich, I would travel.', 'If she studied, she passes.', 'If they will come, we celebrate.'], correct: 1, explanation: 'Second Conditional: If + past simple, would + base verb.' },
    { q: 'Passive voice of "They built the bridge": ', options: ['The bridge is built.', 'The bridge was built.', 'The bridge built.', 'The bridge has build.'], correct: 1, explanation: 'Past passive: was/were + past participle.' },
    { q: '"If I had studied, I ___ passed." (Third Conditional)', options: ['would', 'will have', 'would have', 'had'], correct: 2, explanation: 'Third Conditional: would have + past participle.' },
    { q: 'Choose the correct passive: "The results ___ announced tomorrow."', options: ['will be', 'are being', 'were', 'has been'], correct: 0, explanation: 'Future passive: will be + past participle.' },
    { q: '"Unless" is equivalent to:', options: ['If', 'If not', 'Even if', 'Because'], correct: 1, explanation: '"Unless" = "If not" — conditional exception.' },
    { q: 'Which is the correct Third Conditional?', options: ['If he called, I answer.', 'If he had called, I would have answered.', 'If he calls, I will answer.', 'If he would call, I answered.'], correct: 1, explanation: '3rd Cond: If + past perfect, would have + past participle.' },
    { q: '"The report is being reviewed" means:', options: ['Future passive', 'Past passive', 'Present continuous passive', 'Perfect passive'], correct: 2, explanation: 'is being + past participle = present continuous passive.' },
    { q: '"As long as" is used to express:', options: ['Contrast', 'Condition', 'Addition', 'Reason'], correct: 1, explanation: '"As long as" introduces a condition that must be met.' },
    { q: 'Correct active → passive: "Maria wrote the email."', options: ['The email was wrote by Maria.', 'The email written by Maria.', 'The email was written by Maria.', 'The email is written by Maria.'], correct: 2, explanation: 'Past passive: was + past participle (written, not wrote).' },
    { q: 'First Conditional: "If it ___ (rain), we ___ (cancel)."', options: ['rained / would cancel', 'rains / will cancel', 'rains / would cancel', 'rained / will cancel'], correct: 1, explanation: '1st Conditional: If + present simple, will + base verb.' },
  ]
};

const BADGES_DATA = [
  { id: 'first_lesson', emoji: '🎯', name: 'Primera lección', condition: 'Completa tu primera lección', xpRequired: 0, lessonsRequired: 1 },
  { id: 'quiz_master', emoji: '🧠', name: 'Quiz Master', condition: 'Completa 3 quizzes', xpRequired: 0, quizzesRequired: 3 },
  { id: 'chatty', emoji: '💬', name: 'Conversador', condition: 'Envía 10 mensajes al chatbot', xpRequired: 0, messagesRequired: 10 },
  { id: 'xp_100', emoji: '⭐', name: '100 XP', condition: 'Alcanza 100 puntos de experiencia', xpRequired: 100 },
  { id: 'xp_300', emoji: '🌟', name: '300 XP', condition: 'Alcanza 300 puntos de experiencia', xpRequired: 300 },
  { id: 'xp_500', emoji: '🏆', name: '500 XP', condition: 'Alcanza 500 puntos de experiencia', xpRequired: 500 },
  { id: 'all_beginner', emoji: '🌱', name: 'Principiante completo', condition: 'Completa todas las lecciones de principiante', xpRequired: 0, allLevelRequired: 'beginner' },
  { id: 'streak_3', emoji: '🔥', name: 'En racha', condition: 'Estudia 3 días seguidos', xpRequired: 0, streakRequired: 3 },
  { id: 'perfect_quiz', emoji: '💯', name: 'Quiz perfecto', condition: 'Obtén 10/10 en un quiz', xpRequired: 0, perfectQuizRequired: true },
  { id: 'explorer', emoji: '🧭', name: 'Explorador', condition: 'Intenta los 3 niveles de lección', xpRequired: 0, allLevelsVisited: true },
];

const LEVEL_NAMES = [
  { name: 'Novato', min: 0, max: 100 },
  { name: 'Estudiante', min: 100, max: 250 },
  { name: 'Aprendiz', min: 250, max: 500 },
  { name: 'Competente', min: 500, max: 800 },
  { name: 'Avanzado', min: 800, max: 1200 },
  { name: 'Experto', min: 1200, max: 2000 },
  { name: 'Maestro', min: 2000, max: Infinity },
];
