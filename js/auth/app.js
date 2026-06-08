const API_URL = 'http://localhost:5500';

function mostrarMensaje(texto, tipo = 'ok') {
    const msg = document.getElementById('msg');

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
    document.querySelector('.form-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'block';
    mostrarMensaje('');
}

function mostrarLogin() {
    document.querySelector('.form-box').style.display = 'block';
    document.getElementById('register-box').style.display = 'none';
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
        const response = await fetch(`${API_URL}/api/auth/login`, {
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
        mostrarMensaje('No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
}

async function registrar() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!username || !password) {
        mostrarMensaje('Completa usuario/correo y contraseña', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.error || 'Error al registrar usuario', 'error');
            return;
        }

        mostrarMensaje('Cuenta creada correctamente. Ahora inicia sesión.', 'ok');

        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';

        setTimeout(mostrarLogin, 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
}