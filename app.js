const API_URL = '/api-dev'

// Cargar usuarios al abrir la página
document.addEventListener('DOMContentLoaded', obtenerUsuarios);

async function obtenerUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();
        
        const lista = document.getElementById('lista-usuarios');
        const tabla = document.getElementById('tabla-usuarios');
        lista.innerHTML = '';
        tabla.style.display = 'table';

        usuarios.forEach(user => {
            lista.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>
                        <button onclick="prepararEditar(${user.id}, '${user.username}')" style="background: #f39c12; width: auto; padding: 5px 10px;">✏️</button>
                        <button onclick="eliminarUsuario(${user.id})" style="background: #e74c3c; width: auto; padding: 5px 10px;">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al obtener usuarios", error);
    }
}

async function registrar() {
    const user = document.getElementById('reg-username').value;
    const pass = document.getElementById('reg-password').value;
    
    await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });
    
    limpiarYRefrescar();
}

async function eliminarUsuario(id) {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
        await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
        obtenerUsuarios();
    }
}

async function prepararEditar(id, nombreActual) {
    const nuevoNombre = prompt("Nuevo nombre para " + nombreActual, nombreActual);
    const nuevaPass = prompt("Nueva contraseña para " + nombreActual);
    
    if (nuevoNombre && nuevaPass) {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: nuevoNombre, password: nuevaPass })
        });
        obtenerUsuarios();
    }
}

function limpiarYRefrescar() {
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    obtenerUsuarios();
}
