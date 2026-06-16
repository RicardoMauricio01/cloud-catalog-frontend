const API_URL = '/api/auth';

function mostrarMensaje(texto, tipo = 'ok') {
    const msg = document.getElementById('msg');
    if (!msg) return;

    if (!texto) {
        msg.style.display = 'none';
        msg.textContent = '';
        msg.className = 'msg-box';
        return;
    }

    msg.style.display = 'block';
    msg.textContent = texto;
    msg.className = `msg-box ${tipo}`;
}

function mostrarRegistro() {
    document.getElementById('card-title').innerText = 'Crear Cuenta';
    document.getElementById('card-subtitle').innerText = 'Regístrate para acceder al sistema';
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'block';
    document.getElementById('forgot-box').style.display = 'none';
    mostrarMensaje('');
}

function mostrarLogin() {
    document.getElementById('card-title').innerText = 'Bienvenido';
    document.getElementById('card-subtitle').innerText = 'Inicia sesión para continuar';
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('forgot-box').style.display = 'none';
    mostrarMensaje('');
}

async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        mostrarMensaje('Completa el correo y la contraseña', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.error || 'Error al iniciar sesión', 'error');
            return;
        }

        mostrarMensaje(`Bienvenido, ${data.user}`, 'ok');

        setTimeout(() => {
            window.location.href = 'productos.html';
        }, 1000);

    } catch (error) {
        console.error(error);
        mostrarMensaje('No se pudo conectar al servidor', 'error');
    }
}

async function registrar() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!username || !email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.error || 'Error al registrar usuario', 'error');
            return;
        }

        mostrarMensaje('Cuenta creada correctamente. Ahora inicia sesión.', 'ok');

        document.getElementById('reg-username').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';

        setTimeout(mostrarLogin, 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
}

function mostrarRecuperar() {
    document.getElementById('card-title').innerText = 'Bienvenido';
    document.getElementById('card-subtitle').innerText = 'Inicia sesión para continuar';
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('forgot-box').style.display = 'block';
    
    const alertSuccess = document.getElementById('alert-success');
    if (alertSuccess) alertSuccess.style.display = 'none';
    
    mostrarMensaje('');
}

async function solicitarEnlace() {
    const email = document.getElementById('forgot-email').value.trim();
    const successAlert = document.getElementById('alert-success');

    if (!email) {
        mostrarMensaje('Por favor, ingresa tu correo electrónico', 'error');
        return;
    }

    try {
        mostrarMensaje('Procesando solicitud...', 'ok');
        
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.error || 'Error al procesar la solicitud', 'error');
            return;
        }

        mostrarMensaje(data.mensaje, 'ok');
        
        if (successAlert) {
            successAlert.style.display = 'block';
        }
        
        document.getElementById('forgot-email').value = '';

    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
}
