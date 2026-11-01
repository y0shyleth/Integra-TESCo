/* ============================================================
   participante_scripts.js
   Módulo Participante / Asesor — Integra-TESCO
   Regla: campos con data-role="ambos" → participante y asesor
          campos con data-role="participante" → solo participante
   ============================================================ */
/* ===================== FONDO DE HEXÁGONOS (anime.js) ===================== */
function initHexBackground() {
  const container = document.getElementById('bgHexContainer');
  if (!container || typeof anime === 'undefined') return;

  // Limpiar por si se llama más de una vez
  container.innerHTML = '';

  const hexWidth = 120;
  const hexHeight = 138;
  const colSpacing = hexWidth * 1.82;
  const rowSpacing = hexHeight * 1.72;

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const cols = Math.ceil(viewW / colSpacing) + 2;
  const rows = Math.ceil(viewH / rowSpacing) + 2;

  const hexes = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hex = document.createElement('div');
      hex.className = 'bg-hexagon';

      // Offset alternado en filas (patrón panal)
      const offsetX = (row % 2) * (colSpacing / 2);
      const x = col * colSpacing - hexWidth + offsetX;
      const y = row * rowSpacing - hexHeight;

      hex.style.left = `${x}px`;
      hex.style.top = `${y}px`;
      hex.style.opacity = (0.25 + Math.random() * 0.35).toFixed(2);

      // Variación de tamaño para dar profundidad
      const scale = 0.7 + Math.random() * 0.7;
      hex.style.transform = `scale(${scale.toFixed(2)})`;

      container.appendChild(hex);
      hexes.push(hex);
    }
  }

  // Animación de flotación suave (similar al admin)
  hexes.forEach((hex, i) => {
    const baseOpacity = parseFloat(hex.style.opacity);
    const baseScale = parseFloat(
      (hex.style.transform.match(/scale\(([\d.]+)\)/) || [null, '1'])[1]
    );
    const driftX = 10 + Math.random() * 20;
    const driftY = 10 + Math.random() * 20;
    const rot = (Math.random() - 0.5) * 8;

    anime({
      targets: hex,
      translateX: [
        { value: -driftX, duration: 0 },
        { value: driftX, duration: 6000 + Math.random() * 4000 },
        { value: -driftX, duration: 6000 + Math.random() * 4000 }
      ],
      translateY: [
        { value: -driftY, duration: 0 },
        { value: driftY, duration: 7000 + Math.random() * 4000 },
        { value: -driftY, duration: 7000 + Math.random() * 4000 }
      ],
      rotate: [
        { value: -rot, duration: 0 },
        { value: rot, duration: 8000 + Math.random() * 4000 },
        { value: -rot, duration: 8000 + Math.random() * 4000 }
      ],
      opacity: [
        { value: baseOpacity * 0.6, duration: 0 },
        { value: baseOpacity, duration: 3500 + Math.random() * 2000 },
        { value: baseOpacity * 0.6, duration: 3500 + Math.random() * 2000 }
      ],
      scale: [
        { value: baseScale * 0.95, duration: 0 },
        { value: baseScale * 1.05, duration: 5000 + Math.random() * 3000 },
        { value: baseScale * 0.95, duration: 5000 + Math.random() * 3000 }
      ],
      delay: i * 30,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });
  });
}

// Inicializar cuando el DOM esté listo
if (typeof anime !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHexBackground);
  } else {
    initHexBackground();
  }
} else {
  window.addEventListener('load', () => {
    if (typeof anime !== 'undefined') initHexBackground();
  });
}

// Re-ajustar al redimensionar (con debounce)
let _hexResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_hexResizeTimer);
  _hexResizeTimer = setTimeout(() => {
    if (typeof anime !== 'undefined') initHexBackground();
  }, 400);
});
/* ===================== UTILIDADES ===================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PASSWORD = /^[a-zA-Z0-9_\-*\/,\.\?]{8,}$/;
const REGEX_CURP = /^[A-Z]{4}[0-9]{6}[A-Z]{6}[A-Z0-9]{2}$/i;
const REGEX_MATRICULA = /^[0-9]{1,9}$/;

/* ===================== TOGGLE CONTRASEÑA ===================== */
function setupPasswordToggle(toggleId, inputId) {
  const btn = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) { icon.classList.toggle('fa-eye', !isPwd); icon.classList.toggle('fa-eye-slash', isPwd); }
    btn.setAttribute('aria-label', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
}
setupPasswordToggle('toggleLoginPassword', 'loginPassword');
setupPasswordToggle('toggleRegPassword', 'regPassword');

/* ===================== VALIDACIONES ===================== */
function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (error) error.textContent = message || '';
  if (input) {
    input.style.borderColor = message ? 'rgba(255,92,92,0.7)' : '';
    input.style.boxShadow = message ? '0 0 0 3px rgba(255,92,92,0.15)' : '';
  }
}
function clearError(inputId, errorId) { setError(inputId, errorId, ''); }
const validateEmail = (v) => REGEX_EMAIL.test(v.trim());
const validatePassword = (v) => REGEX_PASSWORD.test(v);
const validateCurp = (v) => REGEX_CURP.test(v.trim());

/* ===================== LOGIN ===================== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!validateEmail(email)) { setError('loginEmail', 'loginEmailError', 'Ingresa un correo válido (ejemplo@dominio.com)'); valid = false; }
    else clearError('loginEmail', 'loginEmailError');

    if (!validatePassword(password)) { setError('loginPassword', 'loginPasswordError', 'Mínimo 8 caracteres. Permitidos: letras, números y _-*/, .?'); valid = false; }
    else clearError('loginPassword', 'loginPasswordError');

    if (valid) window.location.href = 'inicio_participante.html';
  });
}

/* ===================== SWITCH LOGIN ↔ REGISTRO ===================== */
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');

function switchCards(hideEl, showEl) {
  if (!hideEl || !showEl) return;
  hideEl.classList.add('animating-out');
  setTimeout(() => {
    hideEl.classList.add('hidden');
    hideEl.classList.remove('animating-out');
    showEl.classList.remove('hidden');
    showEl.classList.add('animating-in');
    setTimeout(() => showEl.classList.remove('animating-in'), 450);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 250);
}

const showRegisterLink = document.getElementById('showRegisterLink');
if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); switchCards(loginCard, registerCard); });

const showLoginLink = document.getElementById('showLoginLink');
if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchCards(registerCard, loginCard); });

/* ===================== TOOLTIP SEXO ===================== */
const sexoTooltipLink = document.getElementById('sexoTooltipLink');
const sexoTooltip = document.getElementById('sexoTooltip');
if (sexoTooltipLink && sexoTooltip) {
  sexoTooltipLink.addEventListener('click', (e) => { e.preventDefault(); sexoTooltip.classList.toggle('show'); });
}

/* ===================== ROL: VISIBILIDAD POR data-role ===================== */
const roleRadios = document.querySelectorAll('input[name="rol"]');
const roleElements = document.querySelectorAll('[data-role]');

function updateRoleVisibility() {
  const selected = document.querySelector('input[name="rol"]:checked');
  const isAsesor = selected && selected.value === 'asesor';

  roleElements.forEach((el) => {
    const role = el.getAttribute('data-role');
    let visible = false;
    if (role === 'ambos') visible = true;
    else if (role === 'participante') visible = !isAsesor;

    el.style.display = visible ? '' : 'none';

    // Ajustar required en campos ocultos
    const fields = el.matches('input, select, textarea') ? [el] : el.querySelectorAll('input, select, textarea');
    fields.forEach((f) => {
      if (visible) {
        // Reestablecer required según el atributo original data-required
        if (f.dataset.required === 'true') f.setAttribute('required', '');
      } else {
        f.removeAttribute('required');
      }
    });
  });
}

// Marcar required original en todos los campos requeridos del registro
document.querySelectorAll('#registerForm input[required], #registerForm select[required]').forEach((f) => {
  f.dataset.required = 'true';
});

roleRadios.forEach((r) => r.addEventListener('change', updateRoleVisibility));
updateRoleVisibility();

/* ===================== REGISTRO ===================== */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const selectedRol = document.querySelector('input[name="rol"]:checked');
    const isAsesor = selectedRol && selectedRol.value === 'asesor';

    // Campos comunes a ambos roles (data-role="ambos")
    const nombre = document.getElementById('regNombre').value.trim();
    if (!nombre) { setError('regNombre', 'regNombreError', 'Campo obligatorio'); valid = false; } else clearError('regNombre', 'regNombreError');

    const apPat = document.getElementById('regApellidoPaterno').value.trim();
    if (!apPat) { setError('regApellidoPaterno', 'regApellidoPaternoError', 'Campo obligatorio'); valid = false; } else clearError('regApellidoPaterno', 'regApellidoPaternoError');

    const apMat = document.getElementById('regApellidoMaterno').value.trim();
    if (!apMat) { setError('regApellidoMaterno', 'regApellidoMaternoError', 'Campo obligatorio'); valid = false; } else clearError('regApellidoMaterno', 'regApellidoMaternoError');

    const curp = document.getElementById('regCurp').value.trim();
    if (!validateCurp(curp)) { setError('regCurp', 'regCurpError', 'CURP inválida (4 letras, 6 dígitos, 6 letras, 2 alfanuméricos)'); valid = false; } else clearError('regCurp', 'regCurpError');

    const email = document.getElementById('regEmail').value.trim();
    if (!validateEmail(email)) { setError('regEmail', 'regEmailError', 'Correo inválido'); valid = false; } else clearError('regEmail', 'regEmailError');

    const password = document.getElementById('regPassword').value;
    if (!validatePassword(password)) { setError('regPassword', 'regPasswordError', 'Mínimo 8 caracteres. Permitidos: letras, números y _-*/, .?'); valid = false; } else clearError('regPassword', 'regPasswordError');

    const correoInst = document.getElementById('regCorreoInstitucional').value.trim();
    if (!validateEmail(correoInst)) { setError('regCorreoInstitucional', 'regCorreoInstitucionalError', 'Correo institucional inválido'); valid = false; } else clearError('regCorreoInstitucional', 'regCorreoInstitucionalError');

    const correoPersonal = document.getElementById('regCorreoPersonal').value.trim();
    if (correoPersonal && !validateEmail(correoPersonal)) { setError('regCorreoPersonal', 'regCorreoPersonalError', 'Correo personal inválido'); valid = false; } else clearError('regCorreoPersonal', 'regCorreoPersonalError');

    // Campos solo participante (data-role="participante")
    if (!isAsesor) {
      const matricula = document.getElementById('regMatricula').value.trim();
      if (!REGEX_MATRICULA.test(matricula)) { setError('regMatricula', 'regMatriculaError', 'Máximo 9 dígitos'); valid = false; } else clearError('regMatricula', 'regMatriculaError');

      const plantel = document.getElementById('regPlantel').value;
      if (!plantel) { setError('regPlantel', 'regPlantelError', 'Selecciona un plantel'); valid = false; } else clearError('regPlantel', 'regPlantelError');

      const carrera = document.getElementById('regCarrera').value;
      if (!carrera) { setError('regCarrera', 'regCarreraError', 'Selecciona una carrera'); valid = false; } else clearError('regCarrera', 'regCarreraError');

      const semestre = document.getElementById('regSemestre').value;
      if (!semestre) { setError('regSemestre', 'regSemestreError', 'Selecciona un semestre'); valid = false; } else clearError('regSemestre', 'regSemestreError');

      const grupo = document.getElementById('regGrupo').value.trim();
      if (!grupo) { setError('regGrupo', 'regGrupoError', 'Campo obligatorio'); valid = false; } else clearError('regGrupo', 'regGrupoError');

      // Código de equipo (solo participante)
      const codigoEquipo = document.getElementById('regCodigoEquipo').value.trim();
      if (codigoEquipo && codigoEquipo.length !== 6) { setError('regCodigoEquipo', 'regCodigoEquipoError', 'El código debe tener 6 caracteres'); valid = false; } else clearError('regCodigoEquipo', 'regCodigoEquipoError');
    }

    if (valid) window.location.href = 'inicio_participante.html';
  });
}

/* ===================== MODAL OLVIDÉ CONTRASEÑA ===================== */
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotModal = document.getElementById('forgotModal');
const closeForgotModal = document.getElementById('closeForgotModal');
const sendResetBtn = document.getElementById('sendResetBtn');

function openForgotModal() { if (forgotModal) forgotModal.classList.add('show'); }
function closeForgotModalFn() {
  if (forgotModal) {
    forgotModal.classList.remove('show');
    clearError('forgotEmail', 'forgotEmailError');
    clearError('forgotCurp', 'forgotCurpError');
  }
}

if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); openForgotModal(); });
if (closeForgotModal) closeForgotModal.addEventListener('click', closeForgotModalFn);
if (forgotModal) forgotModal.addEventListener('click', (e) => { if (e.target === forgotModal) closeForgotModalFn(); });

if (sendResetBtn) {
  sendResetBtn.addEventListener('click', () => {
    const email = document.getElementById('forgotEmail').value.trim();
    const curp = document.getElementById('forgotCurp').value.trim();
    let valid = true;

    if (!email && !curp) {
      setError('forgotEmail', 'forgotEmailError', 'Ingresa tu correo o CURP');
      valid = false;
    } else {
      if (email && !validateEmail(email)) { setError('forgotEmail', 'forgotEmailError', 'Correo inválido'); valid = false; } else clearError('forgotEmail', 'forgotEmailError');
      if (curp && !validateCurp(curp)) { setError('forgotCurp', 'forgotCurpError', 'CURP inválida'); valid = false; } else clearError('forgotCurp', 'forgotCurpError');
    }

    if (valid) {
      alert('Se ha enviado una notificación a los administradores para restablecer tu contraseña. Recibirás una notificación por correo electrónico.');
      closeForgotModalFn();
      document.getElementById('forgotEmail').value = '';
      document.getElementById('forgotCurp').value = '';
    }
  });
}


/* ============================================================
   DASHBOARD PARTICIPANTE (inicio_participante.html)
   ============================================================ */

/* ---------- Navbar hamburguesa ---------- */
(function initNavbarToggler() {
  const toggler = document.getElementById('navbarToggler');
  const menu = document.getElementById('navMenu');
  if (!toggler || !menu) return;

  toggler.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    toggler.setAttribute('aria-expanded', String(isOpen));
    const icon = toggler.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
    }
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('show')) return;
    if (!menu.contains(e.target) && !toggler.contains(e.target)) {
      menu.classList.remove('show');
      toggler.setAttribute('aria-expanded', 'false');
      const icon = toggler.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
  });
})();

/* ---------- Generador de código aleatorio ---------- */
function generarCodigoEquipo(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin caracteres ambiguos
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/* ---------- MODAL CREAR EQUIPO ---------- */
(function initModalCrearEquipo() {
  const modal = document.getElementById('modalCrearEquipo');
  const btnOpen = document.getElementById('btnCrearEquipo');
  const btnClose = document.getElementById('closeCrearEquipo');
  const btnCancel = document.getElementById('cancelarCrearEquipo');
  const form = document.getElementById('formCrearEquipo');
  const codigoInput = document.getElementById('codigoEquipo');
  const tooltipIcon = document.querySelector('[data-tooltip="tooltipCodigo"]');
  const tooltip = document.getElementById('tooltipCodigo');

  if (!modal) return;

  function abrir() {
    modal.classList.add('show');
    // Generar código nuevo cada vez que se abre
    if (codigoInput) {
      codigoInput.value = generarCodigoEquipo();
      codigoInput.classList.remove('copiado');
    }
    // Resetear errores
    ['nuevoNombreEquipo', 'nuevoCategoria'].forEach((id) => {
      clearError(id, id + 'Error');
    });
  }

  function cerrar() {
    modal.classList.remove('show');
  }

  if (btnOpen) btnOpen.addEventListener('click', abrir);
  if (btnClose) btnClose.addEventListener('click', cerrar);
  if (btnCancel) btnCancel.addEventListener('click', cerrar);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrar();
  });

  // Copiar código al hacer clic
  if (codigoInput) {
    codigoInput.addEventListener('click', () => {
      if (!codigoInput.value || codigoInput.value === '------') return;
      navigator.clipboard.writeText(codigoInput.value).then(() => {
        codigoInput.classList.remove('copiado');
        void codigoInput.offsetWidth; // reflow
        codigoInput.classList.add('copiado');
      }).catch(() => {
        // Fallback para navegadores sin clipboard API
        codigoInput.select();
        document.execCommand('copy');
        codigoInput.classList.remove('copiado');
        void codigoInput.offsetWidth;
        codigoInput.classList.add('copiado');
      });
    });
  }

  // Tooltip del ícono (?)
  if (tooltipIcon && tooltip) {
    tooltipIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.classList.toggle('show');
    });
  }

  // Enviar formulario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nombre = document.getElementById('nuevoNombreEquipo').value.trim();
      if (!nombre) {
        setError('nuevoNombreEquipo', 'nuevoNombreEquipoError', 'Campo obligatorio');
        valid = false;
      } else clearError('nuevoNombreEquipo', 'nuevoNombreEquipoError');

      const categoria = document.getElementById('nuevoCategoria').value;
      if (!categoria) {
        setError('nuevoCategoria', 'nuevoCategoriaError', 'Selecciona una categoría');
        valid = false;
      } else clearError('nuevoCategoria', 'nuevoCategoriaError');

      if (valid) {
        // Aquí iría la lógica real de envío
        alert('Equipo creado correctamente. Código: ' + codigoInput.value);
        cerrar();
        form.reset();
      }
    });
  }
})();

/* ---------- MODAL UNIRSE A EQUIPO ---------- */
(function initModalUnirseEquipo() {
  const modal = document.getElementById('modalUnirseEquipo');
  const btnOpen = document.getElementById('btnUnirseEquipo');
  const btnClose = document.getElementById('closeUnirseEquipo');
  const btnCancel = document.getElementById('cancelarUnirseEquipo');
  const btnPegar = document.getElementById('btnPegarCodigo');
  const btnConfirmar = document.getElementById('btnUnirseConfirmar');
  const input = document.getElementById('codigoUnirse');

  if (!modal) return;

  function abrir() {
    modal.classList.add('show');
    clearError('codigoUnirse', 'codigoUnirseError');
  }
  function cerrar() {
    modal.classList.remove('show');
    if (input) input.value = '';
    clearError('codigoUnirse', 'codigoUnirseError');
  }

  if (btnOpen) btnOpen.addEventListener('click', abrir);
  if (btnClose) btnClose.addEventListener('click', cerrar);
  if (btnCancel) btnCancel.addEventListener('click', cerrar);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrar();
  });

  // Pegar desde el portapapeles
  if (btnPegar && input) {
    btnPegar.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          input.value = text.trim().toUpperCase().slice(0, 6);
          clearError('codigoUnirse', 'codigoUnirseError');
        }
      } catch {
        alert('No se pudo acceder al portapapeles. Pega el código manualmente.');
      }
    });
  }

  // Confirmar unión
  if (btnConfirmar && input) {
    btnConfirmar.addEventListener('click', () => {
      const code = input.value.trim().toUpperCase();
      if (code.length !== 6) {
        setError('codigoUnirse', 'codigoUnirseError', 'El código debe tener 6 caracteres');
        return;
      }
      clearError('codigoUnirse', 'codigoUnirseError');
      alert('Te has unido al equipo con código: ' + code);
      cerrar();
    });
  }
})();

/* ---------- Cerrar modales con Escape ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach((m) => m.classList.remove('show'));
    const menu = document.getElementById('navMenu');
    const toggler = document.getElementById('navbarToggler');
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggler?.setAttribute('aria-expanded', 'false');
      const icon = toggler?.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
  }
});


/* ============================================================
   VISTA DE EQUIPO (equipo_participante.html)
   ============================================================ */

/* ---------- Datos de ejemplo de personas ---------- */
const PERSONAS_DATA = {
  'lani': {
    nombre: 'Lani Yamille',
    apPaterno: 'Fragoso',
    apMaterno: 'Salinas',
    curp: 'FRSL010101MMCPXHA2',
    sexo: 'Femenino',
    matricula: '202320123',
    carrera: 'SIC',
    semestre: '7',
    grupo: '3711',
    correo: '202320123@tesco.edu.mx',
    archivos: ['Certificado.pdf', 'Constancia_inscripcion.pdf']
  },
  'danna': {
    nombre: 'Danna Karina',
    apPaterno: 'Aguilar',
    apMaterno: 'Márquez',
    curp: 'AUMD020202MMCGNR03',
    sexo: 'Femenino',
    matricula: '202320456',
    carrera: 'SIC',
    semestre: '7',
    grupo: '3711',
    correo: '202320456@tesco.edu.mx',
    archivos: ['Constancia_inscripcion.pdf']
  },
  'alyson': {
    nombre: 'Alyson Avril',
    apPaterno: 'Olmos',
    apMaterno: 'Vera',
    curp: 'OOVA030303MMCLRY05',
    sexo: 'Femenino',
    matricula: '202320789',
    carrera: 'TIC',
    semestre: '6',
    grupo: '3612',
    correo: '202320789@tesco.edu.mx',
    archivos: []
  },
  'nelly': {
    nombre: 'Nelly',
    apPaterno: 'Sánchez',
    apMaterno: 'Ruíz',
    curp: 'SARU040404MMCNXL07',
    sexo: 'Femenino',
    matricula: '202320321',
    carrera: 'IGE',
    semestre: '8',
    grupo: '3811',
    correo: '202320321@tesco.edu.mx',
    archivos: []
  },
  'axel': {
    nombre: 'Axel Adrián',
    apPaterno: 'Mejía',
    apMaterno: 'Lozano',
    curp: 'MELA050505HMCJZX09',
    sexo: 'Masculino',
    matricula: '202320654',
    carrera: 'MEC',
    semestre: '5',
    grupo: '3512',
    correo: '202320654@tesco.edu.mx',
    archivos: []
  },
  'jose-luis': {
    nombre: 'José Luis',
    apPaterno: 'Camacho',
    apMaterno: 'Campero',
    curp: 'CACJ700101HMCMPS01',
    sexo: 'Masculino',
    matricula: 'ASESOR001',
    carrera: 'Docente',
    semestre: '—',
    grupo: '—',
    correo: 'jose.camacho@tesco.edu.mx',
    archivos: []
  },
  'luis-enrique': {
    nombre: 'Luis Enrique',
    apPaterno: 'Vivanco',
    apMaterno: 'Bienavidez',
    curp: 'VIBL750202HMCNNS02',
    sexo: 'Masculino',
    matricula: 'ASESOR002',
    carrera: 'Docente',
    semestre: '—',
    grupo: '—',
    correo: 'luis.vivanco@tesco.edu.mx',
    archivos: []
  }
};

/* ---------- MODAL INFO PERSONA ---------- */
(function initModalPersona() {
  const modal = document.getElementById('modalPersona');
  const title = document.getElementById('personaModalTitle');
  const grid = document.getElementById('personaInfoGrid');
  const filesList = document.getElementById('personaFilesList');

  if (!modal) return;

  function abrirPersona(personaId) {
    const data = PERSONAS_DATA[personaId];
    if (!data) return;

    title.textContent = `${data.nombre} ${data.apPaterno} ${data.apMaterno}`;

    const campos = [
      ['Nombre(s)', data.nombre],
      ['Apellido Paterno', data.apPaterno],
      ['Apellido Materno', data.apMaterno],
      ['CURP', data.curp],
      ['Sexo', data.sexo],
      ['Matrícula', data.matricula],
      ['Carrera', data.carrera],
      ['Semestre', data.semestre],
      ['Grupo', data.grupo],
      ['Correo institucional', data.correo]
    ];

    grid.innerHTML = campos.map(([label, value]) => `
      <div class="info-item">
        <span class="info-label">${label}</span>
        <span class="info-value">${value}</span>
      </div>
    `).join('');

    if (data.archivos.length === 0) {
      filesList.innerHTML = '<li><span class="info-value" style="color:var(--text-muted);font-style:italic;">Sin archivos personales</span></li>';
    } else {
      filesList.innerHTML = data.archivos.map((file) => `
        <li>
          <a href="#" onclick="event.preventDefault();">
            <i class="fas fa-file-pdf"></i> ${file}
          </a>
        </li>
      `).join('');
    }

    modal.classList.add('show');
  }

  // Delegación: botones "Ver información"
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-persona]');
    if (!btn) return;
    // Solo los botones de ver (no los de eliminar)
    if (btn.classList.contains('btn-icon-ver')) {
      abrirPersona(btn.getAttribute('data-persona'));
    }
  });
})();

/* ---------- ELIMINAR INTEGRANTE / ASESOR ---------- */
(function initEliminarPersona() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-persona].btn-icon-del');
    if (!btn) return;

    const personaId = btn.getAttribute('data-persona');
    const data = PERSONAS_DATA[personaId];
    const nombre = data ? `${data.nombre} ${data.apPaterno}` : 'esta persona';

    if (confirm(`¿Estás seguro de eliminar a ${nombre} del equipo?`)) {
      const row = btn.closest('.persona-row');
      if (row) {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(() => row.remove(), 300);
      }
    }
  });
})();

/* ---------- AGREGAR INTEGRANTE ---------- */
(function initAgregarIntegrante() {
  const btn = document.getElementById('btnAgregarIntegrante');
  const select = document.getElementById('selectNuevoIntegrante');
  const lista = document.getElementById('listaIntegrantes');

  if (!btn || !select || !lista) return;

  btn.addEventListener('click', () => {
    const val = select.value;
    if (!val) {
      alert('Selecciona un participante para agregar.');
      return;
    }

    const data = PERSONAS_DATA[val];
    if (!data) return;

    const nombreCompleto = `${data.nombre} ${data.apPaterno} ${data.apMaterno}`;

    const row = document.createElement('div');
    row.className = 'persona-row';
    row.innerHTML = `
      <div class="persona-info">
        <span class="persona-nombre">${nombreCompleto}</span>
      </div>
      <div class="persona-actions">
        <button type="button" class="btn-icon-ver" data-persona="${val}" title="Ver información"><i class="fas fa-eye"></i></button>
        <button type="button" class="btn-icon-del" data-persona="${val}" title="Eliminar integrante"><i class="fas fa-trash"></i></button>
      </div>
    `;
    lista.appendChild(row);

    // Quitar la opción del select
    select.querySelector(`option[value="${val}"]`)?.remove();
    select.value = '';
  });
})();

/* ---------- AGREGAR ASESOR ---------- */
(function initAgregarAsesor() {
  const btn = document.getElementById('btnAgregarAsesor');
  const select = document.getElementById('selectNuevoAsesor');
  const lista = document.getElementById('listaAsesores');

  if (!btn || !select || !lista) return;

  btn.addEventListener('click', () => {
    const val = select.value;
    if (!val) {
      alert('Selecciona un asesor para agregar.');
      return;
    }

    const data = PERSONAS_DATA[val];
    if (!data) return;

    const nombreCompleto = `${data.nombre} ${data.apPaterno} ${data.apMaterno}`;

    const row = document.createElement('div');
    row.className = 'persona-row';
    row.innerHTML = `
      <div class="persona-info">
        <span class="persona-nombre">${nombreCompleto}</span>
        <span class="persona-rol">Asesor</span>
      </div>
      <div class="persona-actions">
        <button type="button" class="btn-icon-ver" data-persona="${val}" title="Ver información"><i class="fas fa-eye"></i></button>
        <button type="button" class="btn-icon-del" data-persona="${val}" title="Eliminar asesor"><i class="fas fa-trash"></i></button>
      </div>
    `;
    lista.appendChild(row);

    select.querySelector(`option[value="${val}"]`)?.remove();
    select.value = '';
  });
})();

/* ---------- COPIAR CÓDIGO DE EQUIPO ---------- */
(function initCopiarCodigo() {
  const input = document.getElementById('codigoEquipoView');
  if (!input) return;

  input.addEventListener('click', () => {
    if (!input.value) return;
    navigator.clipboard.writeText(input.value).then(() => {
      input.classList.remove('copiado');
      void input.offsetWidth;
      input.classList.add('copiado');
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      input.classList.remove('copiado');
      void input.offsetWidth;
      input.classList.add('copiado');
    });
  });
})();

/* ---------- BOTONES DE NAVEGACIÓN ---------- */
(function initNavButtons() {
  const btnArchivos = document.getElementById('btnSubirArchivos');
  if (btnArchivos) btnArchivos.addEventListener('click', () => {
    window.location.href = 'archivose_participante.html';
  });

  const btnEvaluaciones = document.getElementById('btnVerEvaluaciones');
  if (btnEvaluaciones) btnEvaluaciones.addEventListener('click', () => {
    window.location.href = 'evaluaciones_participante.html';
  });
})();

/* ---------- MODAL REQUISITOS ---------- */
(function initModalRequisitos() {
  const modal = document.getElementById('modalRequisitos');
  const btnOpen = document.getElementById('btnRequisitos');
  const btnEnviar = document.getElementById('btnEnviarValidacion');

  if (!modal) return;

  if (btnOpen) btnOpen.addEventListener('click', () => modal.classList.add('show'));

  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      alert('Se envió la solicitud para validar su equipo. Le será notificado por correo la decisión que se tome.');
      modal.classList.remove('show');
    });
  }
})();

/* ---------- SALIR DEL EQUIPO ---------- */
(function initSalirEquipo() {
  const btn = document.getElementById('btnSalirEquipo');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas salir del equipo?')) {
      alert('Has salido del equipo.');
      window.location.href = 'inicio_participante.html';
    }
  });
})();

/* ---------- DESHACER EQUIPO ---------- */
(function initDeshacerEquipo() {
  const modal = document.getElementById('modalDeshacerEquipo');
  const btnOpen = document.getElementById('btnDeshacerEquipo');
  const btnConfirm = document.getElementById('btnConfirmarDeshacer');
  const input = document.getElementById('passwordDeshacer');

  if (!modal) return;

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('show');
      if (input) input.value = '';
      clearError('passwordDeshacer', 'passwordDeshacerError');
    });
  }

  if (btnConfirm && input) {
    btnConfirm.addEventListener('click', () => {
      const pwd = input.value.trim();
      if (!pwd) {
        setError('passwordDeshacer', 'passwordDeshacerError', 'Ingresa tu contraseña');
        return;
      }
      if (pwd.length < 8) {
        setError('passwordDeshacer', 'passwordDeshacerError', 'La contraseña debe tener al menos 8 caracteres');
        return;
      }
      clearError('passwordDeshacer', 'passwordDeshacerError');
      alert('El equipo ha sido eliminado. Serás redirigido al inicio.');
      window.location.href = 'inicio_participante.html';
    });
  }

  // Toggle de contraseña
  const toggleBtn = document.getElementById('togglePasswordDeshacer');
  if (toggleBtn && input) {
    toggleBtn.addEventListener('click', () => {
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPwd);
        icon.classList.toggle('fa-eye-slash', isPwd);
      }
    });
  }
})();

/* ---------- CERRAR MODALES CON data-close-modal ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-close-modal]');
  if (btn) {
    const modalId = btn.getAttribute('data-close-modal');
    document.getElementById(modalId)?.classList.remove('show');
  }
});

/* ============================================================
   VISTA DE ARCHIVOS DE EQUIPO (archivose_participante.html)
   ============================================================ */

(function initArchivosEquipo() {
  const tablaBody = document.getElementById('tablaArchivosBody');
  const contadorTexto = document.getElementById('contadorArchivosTexto');
  if (!tablaBody || !contadorTexto) return;

  // Función para recalcular el contador (N/3)
  function actualizarContador() {
    const filas = tablaBody.querySelectorAll('tr');
    let cargados = 0;
    
    filas.forEach((fila) => {
      const nombreCelda = fila.querySelector('.nombre-archivo');
      if (nombreCelda && !nombreCelda.classList.contains('sin-archivo')) {
        cargados++;
      }
    });

    contadorTexto.textContent = `Se han enviado ${cargados}/3 archivos`;
  }

  // Función para actualizar el estado visual de los botones de una fila
  function actualizarBotonesFila(fila) {
    const nombreCelda = fila.querySelector('.nombre-archivo');
    const btnVer = fila.querySelector('.btn-ver');
    const btnEliminar = fila.querySelector('.btn-eliminar');
    
    const tieneArchivo = !nombreCelda.classList.contains('sin-archivo');

    if (btnVer) btnVer.disabled = !tieneArchivo;
    if (btnEliminar) btnEliminar.disabled = !tieneArchivo;
  }

  // Delegación de eventos para clics en la tabla
  tablaBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const fila = btn.closest('tr');
    const inputFile = fila.querySelector('.input-file-hidden');
    const nombreCelda = fila.querySelector('.nombre-archivo');

    // --- Acción: CARGAR ---
    if (btn.classList.contains('btn-cargar')) {
      inputFile.click();
    }

    // --- Acción: VER ---
    if (btn.classList.contains('btn-ver')) {
      if (!btn.disabled) {
        alert(`Abriendo visor para: ${nombreCelda.textContent}`);
      }
    }

    // --- Acción: ELIMINAR ---
    if (btn.classList.contains('btn-eliminar')) {
      if (btn.disabled) return;
      
      if (confirm(`¿Estás seguro de eliminar el archivo "${nombreCelda.textContent}"?`)) {
        nombreCelda.textContent = '—';
        nombreCelda.classList.add('sin-archivo');
        actualizarBotonesFila(fila);
        actualizarContador();
      }
    }
  });

  // Manejo de cambio de archivo (cuando el usuario elige un archivo)
  tablaBody.addEventListener('change', (e) => {
    if (!e.target.matches('.input-file-hidden')) return;

    const input = e.target;
    const fila = input.closest('tr');
    const nombreCelda = fila.querySelector('.nombre-archivo');

    if (input.files && input.files.length > 0) {
      // Actualizar celda con el nombre del archivo cargado
      nombreCelda.textContent = input.files[0].name;
      nombreCelda.classList.remove('sin-archivo');
      
      // Actualizar UI
      actualizarBotonesFila(fila);
      actualizarContador();
    }
    
    // Limpiar el input para permitir volver a subir el mismo archivo si se desea
    input.value = '';
  });

  // Inicializar estado de los botones al cargar la página
  const filas = tablaBody.querySelectorAll('tr');
  filas.forEach((fila) => actualizarBotonesFila(fila));
  actualizarContador();

})();

/* ============================================================
   VISTA DE EVALUACIONES (evaluaciones_participante.html)
   ============================================================ */

(function initEvaluaciones() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  
  if (tabBtns.length > 0) {
    // --- Lógica de Pestañas ---
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Quitar active de todos
        tabBtns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        // Poner active al seleccionado
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId)?.classList.add('active');
      });
    });

    // --- Lógica del Input de Evaluación ---
    const inputEval = document.getElementById('inputNumEvaluacion');
    const evaluadorText = document.querySelector('.evaluador-nombre-text');
    const rubricaItems = document.querySelectorAll('.rubrica-item');

    // Datos simulados de las evaluaciones
    const datosEvaluaciones = [
      { evaluador: 'Fabiola Fuentes Herrera', puntajes: [5, 4, 9] },
      { evaluador: 'Luis Enrique Vivanco', puntajes: [4, 5, 8] },
      { evaluador: 'Oscar Escobar Domínguez', puntajes: [5, 5, 10] },
      { evaluador: 'José Luis Camacho', puntajes: [3, 4, 7] },
      { evaluador: 'Carlos Gibran Martínez', puntajes: [5, 5, 9] },
      { evaluador: 'José Roberto Pérez', puntajes: [4, 3, 8] }
    ];

    function actualizarEvaluacion(num) {
      // Validar que esté en rango
      if (num < 1) num = 1;
      if (num > datosEvaluaciones.length) num = datosEvaluaciones.length;
      
      inputEval.value = num;

      const data = datosEvaluaciones[num - 1];
      
      // Actualizar nombre del evaluador
      if (evaluadorText) {
        evaluadorText.textContent = `Evaluador: ${data.evaluador}`;
      }

      // Actualizar puntajes de la rúbrica
      rubricaItems.forEach((item, index) => {
        const puntajeSpan = item.querySelector('.puntaje-obtenido');
        if (puntajeSpan && data.puntajes[index] !== undefined) {
          puntajeSpan.textContent = data.puntajes[index];
        }
      });
    }

    if (inputEval) {
      // Evento al cambiar manualmente el número
      inputEval.addEventListener('change', (e) => {
        actualizarEvaluacion(parseInt(e.target.value, 10) || 1);
      });

      // Permitir flechas arriba/abajo
      inputEval.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          actualizarEvaluacion(parseInt(inputEval.value, 10) + 1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          actualizarEvaluacion(parseInt(inputEval.value, 10) - 1);
        }
      });
    }

    // --- Modal de Reporte ---
    const btnAbrirReporte = document.getElementById('btnAbrirReporte');
    const modalReportar = document.getElementById('modalReportar');
    const btnEnviarReporte = document.getElementById('btnEnviarReporte');

    if (btnAbrirReporte && modalReportar) {
      btnAbrirReporte.addEventListener('click', () => {
        modalReportar.classList.add('show');
        // Limpiar campos y errores
        document.getElementById('motivoReporte').value = '';
        document.getElementById('descripcionReporte').value = '';
        clearError('motivoReporte', 'motivoReporteError');
        clearError('descripcionReporte', 'descripcionReporteError');
      });
    }

    if (btnEnviarReporte) {
      btnEnviarReporte.addEventListener('click', () => {
        let valid = true;
        const motivo = document.getElementById('motivoReporte').value;
        const desc = document.getElementById('descripcionReporte').value.trim();

        if (!motivo) {
          setError('motivoReporte', 'motivoReporteError', 'Selecciona un motivo');
          valid = false;
        } else clearError('motivoReporte', 'motivoReporteError');

        if (!desc) {
          setError('descripcionReporte', 'descripcionReporteError', 'Escribe una descripción');
          valid = false;
        } else clearError('descripcionReporte', 'descripcionReporteError');

        if (valid) {
          alert('Tu reporte ha sido enviado. Será revisado por los administradores.');
          modalReportar.classList.remove('show');
        }
      });
    }
  }
})();

/* ============================================================
   VISTA DE PERFIL (perfil_participante.html)
   ============================================================ */

(function initPerfilParticipante() {
  const form = document.getElementById('perfilForm');
  
  // --- 1. Guardar cambios del formulario principal ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validaciones de los campos editables (#)
      const curp = document.getElementById('perfilCurp').value.trim();
      if (!validateCurp(curp)) {
        setError('perfilCurp', 'perfilCurpError', 'CURP inválida');
        valid = false;
      } else clearError('perfilCurp', 'perfilCurpError');

      const plantel = document.getElementById('perfilPlantel').value;
      if (!plantel) { setError('perfilPlantel', 'perfilPlantelError', 'Selecciona un plantel'); valid = false; } 
      else clearError('perfilPlantel', 'perfilPlantelError');

      const carrera = document.getElementById('perfilCarrera').value;
      if (!carrera) { setError('perfilCarrera', 'perfilCarreraError', 'Selecciona una carrera'); valid = false; } 
      else clearError('perfilCarrera', 'perfilCarreraError');

      const semestre = document.getElementById('perfilSemestre').value;
      if (!semestre) { setError('perfilSemestre', 'perfilSemestreError', 'Selecciona un semestre'); valid = false; } 
      else clearError('perfilSemestre', 'perfilSemestreError');

      const grupo = document.getElementById('perfilGrupo').value.trim();
      if (!grupo) { setError('perfilGrupo', 'perfilGrupoError', 'Campo obligatorio'); valid = false; } 
      else clearError('perfilGrupo', 'perfilGrupoError');

      const correoInst = document.getElementById('perfilCorreoInst').value.trim();
      if (!validateEmail(correoInst)) {
        setError('perfilCorreoInst', 'perfilCorreoInstError', 'Correo institucional inválido');
        valid = false;
      } else clearError('perfilCorreoInst', 'perfilCorreoInstError');

      const correoPersonal = document.getElementById('perfilCorreoPersonal').value.trim();
      if (correoPersonal && !validateEmail(correoPersonal)) {
        setError('perfilCorreoPersonal', 'perfilCorreoPersonalError', 'Correo personal inválido');
        valid = false;
      } else clearError('perfilCorreoPersonal', 'perfilCorreoPersonalError');

      if (valid) {
        alert('Datos actualizados correctamente.');
      }
    });
  }

  // --- 2. Toggle de contraseña reutilizable para los modales ---
  document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-toggle-pass');
      const input = document.getElementById(inputId);
      if (!input) return;

      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPwd);
        icon.classList.toggle('fa-eye-slash', isPwd);
      }
    });
  });

  // --- 3. Modal Cambiar Contraseña ---
  const btnCambiarPass = document.getElementById('btnCambiarPassword');
  const modalCambiarPass = document.getElementById('modalCambiarPassword');
  const btnConfirmarCambioPass = document.getElementById('btnConfirmarCambioPass');

  if (btnCambiarPass && modalCambiarPass) {
    btnCambiarPass.addEventListener('click', () => {
      modalCambiarPass.classList.add('show');
      // Limpiar
      document.getElementById('passActual').value = '';
      document.getElementById('passNueva').value = '';
      document.getElementById('passConfirmar').value = '';
      clearError('passActual', 'passActualError');
      clearError('passNueva', 'passNuevaError');
      clearError('passConfirmar', 'passConfirmarError');
    });
  }

  if (btnConfirmarCambioPass) {
    btnConfirmarCambioPass.addEventListener('click', () => {
      let valid = true;
      const actual = document.getElementById('passActual').value;
      const nueva = document.getElementById('passNueva').value;
      const confirmar = document.getElementById('passConfirmar').value;

      if (!actual) {
        setError('passActual', 'passActualError', 'Ingresa tu contraseña actual');
        valid = false;
      } else clearError('passActual', 'passActualError');

      if (!validatePassword(nueva)) {
        setError('passNueva', 'passNuevaError', 'Mínimo 8 caracteres válidos');
        valid = false;
      } else if (nueva === actual) {
        setError('passNueva', 'passNuevaError', 'La nueva contraseña debe ser distinta a la actual');
        valid = false;
      } else clearError('passNueva', 'passNuevaError');

      if (nueva !== confirmar) {
        setError('passConfirmar', 'passConfirmarError', 'Las contraseñas no coinciden');
        valid = false;
      } else clearError('passConfirmar', 'passConfirmarError');

      if (valid) {
        alert('Contraseña actualizada correctamente.');
        modalCambiarPass.classList.remove('show');
      }
    });
  }

  // --- 4. Modal Borrar Cuenta ---
  const btnBorrarCuenta = document.getElementById('btnBorrarCuenta');
  const modalBorrarCuenta = document.getElementById('modalBorrarCuenta');
  const btnConfirmarBorrarCuenta = document.getElementById('btnConfirmarBorrarCuenta');

  if (btnBorrarCuenta && modalBorrarCuenta) {
    btnBorrarCuenta.addEventListener('click', () => {
      modalBorrarCuenta.classList.add('show');
      document.getElementById('passBorrar').value = '';
      clearError('passBorrar', 'passBorrarError');
    });
  }

  if (btnConfirmarBorrarCuenta) {
    btnConfirmarBorrarCuenta.addEventListener('click', () => {
      const pass = document.getElementById('passBorrar').value;
      
      if (!pass) {
        setError('passBorrar', 'passBorrarError', 'Ingresa tu contraseña');
        return;
      }
      
      // Simulamos validación de contraseña
      clearError('passBorrar', 'passBorrarError');
      
      if (confirm('¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        alert('Tu cuenta ha sido eliminada.');
        window.location.href = 'index.html';
      }
    });
  }
})();


/* ============================================================
   VISTA DE ARCHIVOS PERSONALES (archivosp_participante.html)
   ============================================================ */

(function initArchivosPersonales() {
  const tablaBody = document.getElementById('tablaArchivosPersonalesBody');
  const btnAddFileRow = document.getElementById('btnAddFileRow');
  if (!tablaBody) return;

  // Función para actualizar el estado de los botones de una fila
  function actualizarBotonesFila(fila) {
    const nombreCelda = fila.querySelector('.nombre-archivo');
    const btnVer = fila.querySelector('.btn-ver');
    const btnEliminar = fila.querySelector('.btn-eliminar');
    
    const tieneArchivo = nombreCelda && !nombreCelda.classList.contains('sin-archivo');

    if (btnVer) btnVer.disabled = !tieneArchivo;
    if (btnEliminar) btnEliminar.disabled = !tieneArchivo;
  }

  // Asignar eventos a las filas existentes al cargar
  tablaBody.querySelectorAll('tr').forEach((fila) => actualizarBotonesFila(fila));

  // Delegación de eventos para la tabla
  tablaBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const fila = btn.closest('tr');
    const inputFile = fila.querySelector('.input-file-hidden');
    const nombreCelda = fila.querySelector('.nombre-archivo');

    // Cargar
    if (btn.classList.contains('btn-cargar')) {
      inputFile.click();
    }

    // Ver
    if (btn.classList.contains('btn-ver')) {
      if (!btn.disabled) {
        alert(`Abriendo visor para: ${nombreCelda.textContent}`);
      }
    }

    // Eliminar
    if (btn.classList.contains('btn-eliminar')) {
      if (btn.disabled) return;
      
      if (confirm(`¿Estás seguro de eliminar el archivo "${nombreCelda.textContent}"?`)) {
        nombreCelda.textContent = '—';
        nombreCelda.classList.add('sin-archivo');
        actualizarBotonesFila(fila);
      }
    }
  });

  // Manejo del cambio de archivo en el input oculto
  tablaBody.addEventListener('change', (e) => {
    if (!e.target.matches('.input-file-hidden')) return;

    const input = e.target;
    const fila = input.closest('tr');
    const nombreCelda = fila.querySelector('.nombre-archivo');

    if (input.files && input.files.length > 0) {
      nombreCelda.textContent = input.files[0].name;
      nombreCelda.classList.remove('sin-archivo');
      actualizarBotonesFila(fila);
    }
    
    input.value = '';
  });

  // --- Añadir nueva fila ---
  if (btnAddFileRow) {
    btnAddFileRow.addEventListener('click', () => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td data-label="Concepto">
          <input type="text" class="form-control form-control-sm" placeholder="Ej. Nuevo documento">
        </td>
        <td data-label="Nombre del archivo" class="nombre-archivo sin-archivo">—</td>
        <td data-label="Acciones" class="acciones-cell">
          <button type="button" class="btn-tabla btn-cargar" title="Cargar"><i class="fas fa-upload"></i> Cargar</button>
          <button type="button" class="btn-tabla btn-ver" title="Ver" disabled><i class="fas fa-eye"></i> Ver</button>
          <button type="button" class="btn-tabla btn-eliminar" title="Eliminar" disabled><i class="fas fa-trash"></i> Eliminar</button>
          <input type="file" class="input-file-hidden" style="display: none;">
        </td>
      `;
      
      tablaBody.appendChild(newRow);
      
      // Hacer scroll hacia la nueva fila
      newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Enfocar el input de concepto
      newRow.querySelector('input[type="text"]').focus();
    });
  }
})();