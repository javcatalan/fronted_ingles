// ===== AUTH MODULE =====
const Auth = {
  user: null,

  init() {
    const saved = localStorage.getItem('englishup_user');
    if (saved) {
      try {
        this.user = JSON.parse(saved);
        this.updateNavUI();
      } catch(e) {}
    }
  },

  openModal() {
    document.getElementById('authModal').classList.add('open');
  },

  closeModal() {
    document.getElementById('authModal').classList.remove('open');
  },

  switchTab(tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('authLoginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('authRegisterForm').classList.toggle('hidden', tab !== 'register');
  },

  login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    if (!email || !pass) { Toast.show('Completa todos los campos', 'error'); return; }

    // Simulate auth (in production, call backend)
    const users = JSON.parse(localStorage.getItem('englishup_users') || '[]');
    const found = users.find(u => u.email === email && u.password === btoa(pass));
    if (!found) { Toast.show('Credenciales incorrectas', 'error'); return; }

    this.user = { name: found.name, email: found.email };
    localStorage.setItem('englishup_user', JSON.stringify(this.user));

    // Load user-specific state
    const userState = localStorage.getItem(`englishup_state_${email}`);
    if (userState) {
      try { App.state = { ...App.state, ...JSON.parse(userState) }; } catch(e) {}
    }

    this.updateNavUI();
    this.closeModal();
    Toast.show(`👋 Bienvenido, ${this.user.name}!`, 'success');
    Progress.render();
  },

  register() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;

    if (!name || !email || !pass) { Toast.show('Completa todos los campos', 'error'); return; }
    if (pass.length < 6) { Toast.show('La contraseña debe tener al menos 6 caracteres', 'error'); return; }
    if (!email.includes('@')) { Toast.show('Ingresa un correo válido', 'error'); return; }

    const users = JSON.parse(localStorage.getItem('englishup_users') || '[]');
    if (users.find(u => u.email === email)) { Toast.show('Este correo ya está registrado', 'error'); return; }

    users.push({ name, email, password: btoa(pass) });
    localStorage.setItem('englishup_users', JSON.stringify(users));

    this.user = { name, email };
    localStorage.setItem('englishup_user', JSON.stringify(this.user));

    this.updateNavUI();
    this.closeModal();
    Toast.show(`🎉 ¡Bienvenido, ${name}! Cuenta creada.`, 'success');
    App.addXP(10, 'Registro completado');
  },

  guest() {
    this.closeModal();
    Toast.show('Explorando como invitado. Tu progreso se guardará localmente.', '');
  },

  logout() {
    if (this.user) {
      // Save user-specific state before logout
      localStorage.setItem(`englishup_state_${this.user.email}`, JSON.stringify(App.state));
    }
    this.user = null;
    localStorage.removeItem('englishup_user');
    this.updateNavUI();
    Toast.show('Sesión cerrada');
    App.navigate('home');
  },

  updateNavUI() {
    const navUser = document.getElementById('navUser');
    if (this.user) {
      navUser.innerHTML = `
        <span class="nav-xp-badge" id="navXpBadge">${App.state.xp} XP</span>
        <span class="nav-username">👤 ${this.user.name}</span>
        <button class="btn-ghost" onclick="Auth.logout()" style="padding:6px 14px;font-size:0.8rem;">Salir</button>
      `;
    } else {
      navUser.innerHTML = `<button class="btn-login" id="btnOpenAuth" onclick="Auth.openModal()">Iniciar sesión</button>`;
    }
  },
};

// Click outside modal to close
document.getElementById('authModal').addEventListener('click', e => {
  if (e.target.id === 'authModal') Auth.closeModal();
});

// Modal tab switching
document.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => Auth.switchTab(tab.dataset.tab));
});
