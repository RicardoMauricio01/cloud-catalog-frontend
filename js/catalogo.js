const API_URL = "http://localhost:5000/api/products";

document.addEventListener("DOMContentLoaded", init);

let allProducts = [];
let currentCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(API_URL);
    allProducts = await res.json();

    setupCategoryFilters();
    renderProducts(allProducts);
});

async function init() {
    const products = await fetchProducts();
    renderProducts(products);
}

async function fetchProducts() {
    const res = await fetch(API_URL);
    return await res.json();
}

function renderProducts(products) {
    const grid = document.getElementById("products-grid");

    grid.innerHTML = products.map(p => `
        <div class="product-card">

            <img
                src="${p.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}"
                class="product-img"
            />

            <div class="product-name">${escapeHtml(p.nombre)}</div>

            <div class="product-price">
                $${Number(p.precio).toLocaleString("es-CL")}
            </div>

            <div class="product-stock">
                Stock: ${p.stock}
            </div>

        </div>
    `).join("");
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

function setupCategoryFilters() {
    const buttons = document.querySelectorAll(".cat-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // UI active
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCategory = btn.dataset.category;

            applyFilter();
        });
    });
}

function applyFilter() {
    if (currentCategory === "all") {
        renderProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(p =>
        String(p.categoria_id) === currentCategory
    );

    renderProducts(filtered);
}