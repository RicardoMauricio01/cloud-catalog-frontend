let carritoContador = 0;
let categoriaSeleccionada = "Todas";

// Base de datos de productos adaptada exactamente a la maqueta (image_4a19c8.jpg)
const productos = [
    { id: 1, nombre: "Arroz Tucapel 1kg", categoria: "Abarrotes", precio: 1200, disponible: true, img: "../img/abarrotes/arroz_tucapel.png" },
    { id: 2, nombre: "Leche Entera 1L", categoria: "Abarrotes", precio: 1500, disponible: true, img: "../img/abarrotes/leche_entera.png" },
    { id: 3, nombre: "Aceite Natura 900ml", categoria: "Abarrotes", precio: 1800, disponible: true, img: "../img/abarrotes/aceite_natura.png" },
    { id: 4, nombre: "Azúcar Iansa 1kg", categoria: "Abarrotes", precio: 1100, disponible: true, img: "../img/abarrotes/azucar_iansa.png" },
    { id: 5, nombre: "Porotos Banquete 1kg", categoria: "Abarrotes", precio: 1300, disponible: true, img: "../img/abarrotes/porotos_banquete.png" },
    { id: 6, nombre: "Fideos Carozzi Espirales 400g", categoria: "Abarrotes", precio: 950, disponible: true, img: "../img/abarrotes/fideos_carozzi.png" },
    { id: 7, nombre: "Atún San José 170g", categoria: "Abarrotes", precio: 1250, disponible: true, img: "../img/abarrotes/atun_san_jose.png" },
    { id: 8, nombre: "Salsa de Tomate Malloa 200g", categoria: "Abarrotes", precio: 750, disponible: true, img: "../img/abarrotes/salsa_malloa.png" },
    { id: 9, nombre: "Papel Higiénico Elite 4un", categoria: "Limpieza", precio: 1950, disponible: true, img: "../img/abarrotes/papel_elite.png" },
    { id: 10, nombre: "Shampoo Sedal 400ml", categoria: "Cuidado Personal", precio: 2600, disponible: true, img: "../img/abarrotes/sedal.png" },
    { id: 11, nombre: "Sprite 1.5L", categoria: "Bebidas", precio: 1300, disponible: true, img: "../img/abarrotes/sprite.png" },
    { id: 12, nombre: "Oreo Original", categoria: "Snacks", precio: 800, disponible: true, img: "../img/abarrotes/oreo_original.png" },
    { id: 13, nombre: "Papas Lays Clásicas", categoria: "Snacks", precio: 1600, disponible: true, img: "../img/abarrotes/papas_light.png" },
    { id: 14, nombre: "Pasta Colgate Triple Acción", categoria: "Cuidado Personal", precio: 2200, disponible: true, img: "../img/abarrotes/colgate.png" },
    { id: 15, nombre: "Queso Colun Laminado", categoria: "Lácteos", precio: 3200, disponible: true, img: "../img/abarrotes/queso_colum.png" }
];

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadoresSidebar();
    filtrarCatalogo();
    document.getElementById("search-input").addEventListener("input", filtrarCatalogo);
});

function renderizarProductos(listaProductos) {
    const grid = document.getElementById("grid-productos");
    const counter = document.getElementById("products-counter");
    
    grid.innerHTML = "";
    counter.innerText = `Mostrando 1-${listaProductos.length} de 312 productos`;

    if (listaProductos.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #718096; padding: 40px 0; font-weight: 600;">No se encontraron productos.</p>`;
        return;
    }

    listaProductos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${prod.img}" alt="${prod.nombre}" class="product-img" onerror="this.src='https://placehold.co/140x140?text=${prod.nombre}'">
            </div>
            <h3>${prod.nombre}</h3>
            <p class="product-price">$ ${prod.precio.toLocaleString('es-CL')}</p>
            <div class="card-footer">
                <span class="status-badge ${prod.disponible ? 'disponible' : 'agotado'}">
                    ${prod.disponible ? 'Disponible' : 'Agotado'}
                </span>
                <button class="add-to-cart-btn" ${!prod.disponible ? 'disabled' : ''} onclick="agregarAlCarrito()">
                    <span class="material-symbols-outlined" style="font-size:18px;">add_shopping_cart</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrarCatalogo() {
    const buscarTexto = document.getElementById("search-input").value.toLowerCase();
    const checkDisponible = document.getElementById("check-disponible").checked;
    const checkAgotado = document.getElementById("check-agotado").checked;
    const precioMaximo = parseInt(document.getElementById("price-slider").value);
    const orden = document.getElementById("sort-select").value;

    let filtrados = productos.filter(prod => {
        const cumpleCategoria = (categoriaSeleccionada === "Todas" || prod.categoria === categoriaSeleccionada);
        const cumpleBusqueda = prod.nombre.toLowerCase().includes(buscarTexto);
        const cumpleEstado = (prod.disponible && checkDisponible) || (!prod.disponible && checkAgotado);
        const cumplePrecio = prod.precio <= precioMaximo;

        return cumpleCategoria && cumpleBusqueda && cumpleEstado && cumplePrecio;
    });

    if (orden === "menor") {
        filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "mayor") {
        filtrados.sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(filtrados);
}

function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;

    const mapeoIds = {
        'Todas': 'cat-Todas', 'Abarrotes': 'cat-Abarrotes', 'Bebidas': 'cat-Bebidas',
        'Lácteos': 'cat-Lácteos', 'Limpieza': 'cat-Limpieza', 'Snacks': 'cat-Snacks',
        'Cuidado Personal': 'cat-Cuidado', 'Otros': 'cat-Otros'
    };

    Object.values(mapeoIds).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("active");
    });

    const elActivo = document.getElementById(mapeoIds[categoria]);
    if (elActivo) elActivo.classList.add("active");

    const links = document.querySelectorAll(".categories-links a");
    links.forEach(link => {
        if (link.innerText.trim() === categoria.toUpperCase() || (categoria === "Todas" && link.innerText.trim() === "TODAS LAS CATEGORÍAS")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    filtrarCatalogo();
}

function actualizarContadoresSidebar() {
    // Sincronizamos números rígidos estéticos con la maqueta de referencia
    if(document.getElementById("count-todas")) document.getElementById("count-todas").innerText = "312";
    if(document.getElementById("count-abarrotes")) document.getElementById("count-abarrotes").innerText = "120";
    if(document.getElementById("count-bebidas")) document.getElementById("count-bebidas").innerText = "45";
    if(document.getElementById("count-lacteos")) document.getElementById("count-lacteos").innerText = "32";
    if(document.getElementById("count-limpieza")) document.getElementById("count-limpieza").innerText = "28";
    if(document.getElementById("count-snacks")) document.getElementById("count-snacks").innerText = "54";
    if(document.getElementById("count-cuidado")) document.getElementById("count-cuidado").innerText = "36";
    if(document.getElementById("count-otros")) document.getElementById("count-otros").innerText = "15";
}

function actualizarLabelPrecio(valor) {
    const formatted = parseInt(valor).toLocaleString('es-CL');
    const inputMax = document.getElementById("price-max-label-input");
    if (inputMax) inputMax.value = `$ ${formatted}`;
}

function agregarAlCarrito() {
    carritoContador++;
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.innerText = carritoContador;
}

function toggleMenu() {
    const dropdown = document.getElementById("dropdown");
    if (dropdown) dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function verCompras() { console.log(carritoContador); }
function cerrarSesion() { window.location.href = "./index.html"; }