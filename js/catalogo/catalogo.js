const API_URL = "http://192.168.50.23:5501/api/products";

let selectedProductId = null;

// Inicializar

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    setupCreate();
    setupEdit();
    setupDelete();
    setupTableEvents();
    setupCheckboxes();
});

// API

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    return response;
}

// Productos

async function loadProducts() {
    try {
        const response = await request(API_URL);

        const productos = await response.json();

        renderProducts(productos);
    } catch (error) {
        console.error(error);
    }
}

function renderProducts(productos) {
    const tableBody = document.getElementById("products-table");

    tableBody.innerHTML = productos
        .map((producto) => createProductRow(producto))
        .join("");
}

function createProductRow(producto) {
    return `
        <tr>
            <td>
                <input
                    type="checkbox"
                    class="form-check-input product-checkbox"
                />
            </td>

            <td>
                ${producto.id}
            </td>

            <td>
                ${producto.nombre}
            </td>

            <td>
                $${Number(producto.precio).toLocaleString("es-CL")}
            </td>

            <td>
                ${producto.stock}
            </td>

            <td>

                <button
                    class="action-btn edit edit-btn"
                    data-id="${producto.id}"
                    data-nombre="${producto.nombre}"
                    data-precio="${producto.precio}"
                    data-stock="${producto.stock}"
                    data-bs-toggle="modal"
                    data-bs-target="#editProductModal"
                >
                    <i class="material-icons">
                        edit
                    </i>
                </button>

                <button
                    class="action-btn delete delete-btn"
                    data-id="${producto.id}"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteProductModal"
                >
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </td>
        </tr>
    `;
}

// Create

function setupCreate() {
    const form = document.getElementById("addProductForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const product = {
            nombre: document.getElementById("addNombre").value,
            precio: document.getElementById("addPrecio").value,
            stock: document.getElementById("addStock").value,
        };
        try {
            await request(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            closeModal("addProductModal");

            form.reset();

            loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

// Edit

function setupEdit() {
    const form = document.getElementById("editProductForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("editId").value;

        const product = {
            nombre: document.getElementById("editNombre").value,
            precio: document.getElementById("editPrecio").value,
            stock: document.getElementById("editStock").value,
        };

        try {
            await request(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            closeModal("editProductModal");

            loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

// Delete

function setupDelete() {
    const form = document.querySelector("#deleteProductModal form");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            await request(`${API_URL}/${selectedProductId}`, {
                method: "DELETE",
            });

            closeModal("deleteProductModal");

            await loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

// Eventos de Tabla

function setupTableEvents() {
    const tableBody = document.getElementById("products-table");

    tableBody.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".edit-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        if (editBtn) {
            fillEditForm(editBtn.dataset);
        }

        if (deleteBtn) {
            selectedProductId = deleteBtn.dataset.id;
        }
    });
}

function fillEditForm(data) {
    document.getElementById("editId").value = data.id;
    document.getElementById("editNombre").value = data.nombre;
    document.getElementById("editPrecio").value = data.precio;
    document.getElementById("editStock").value = data.stock;
}

// Checkboxes

function setupCheckboxes() {
    const selectAll = document.getElementById("selectAll");

    selectAll?.addEventListener("change", function () {
        document.querySelectorAll(".product-checkbox").forEach((cb) => {
            cb.checked = this.checked;
        });
    });
}

// Helpers
function closeModal(modalId) {
    bootstrap.Modal.getInstance(document.getElementById(modalId))?.hide();
}
