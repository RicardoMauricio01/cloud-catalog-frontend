const API_URL = "http://localhost:5000/api/products";

let selectedProductId = null;

let allProducts = [];
let currentPage = 1;

const PRODUCTS_PER_PAGE = 5;

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
        let errorMessage =
            "Error en la petición";

        try {
            const data =
                await response.json();

            errorMessage =
                data.message ||
                data.error ||
                errorMessage;
        } catch {}

        throw new Error(errorMessage);
    }

    return response;
}

// Productos

async function loadProducts() {
    const tableBody = document.getElementById("products-table");

    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6">
                Cargando productos...
            </td>
        </tr>
    `;

    try {
        const response = await request(API_URL);

        const productos = await response.json();

        allProducts = productos;

        // Evitar página inválida
        const totalPages = Math.max(
            1,
            Math.ceil(allProducts.length / PRODUCTS_PER_PAGE),
        );

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        renderProducts();
        renderPagination();

        resetSelectAll();
    } catch (error) {
        console.error(error);

        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    ${error.message}
                </td>
            </tr>
        `;
    }
}

function renderProducts() {
    const tableBody = document.getElementById("products-table");

    if (!allProducts.length) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    No hay productos registrados
                </td>
            </tr>
        `;

        updatePaginationInfo(0, 0, 0);

        return;
    }

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const end = start + PRODUCTS_PER_PAGE;

    const productsToShow = allProducts.slice(start, end);

    tableBody.innerHTML = productsToShow.map(createProductRow).join("");

    updatePaginationInfo(
        start + 1,
        Math.min(end, allProducts.length),
        allProducts.length,
    );
}

function renderPagination() {
    const pagination = document.getElementById("pagination");

    if (!pagination) {
        return;
    }

    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";

    // Anterior
    html += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button
                type="button"
                class="page-link"
                data-page="${currentPage - 1}"
            >
                Anterior
            </button>
        </li>
    `;

    // Números
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <button
                    type="button"
                    class="page-link"
                    data-page="${i}"
                >
                    ${i}
                </button>
            </li>
        `;
    }

    // Siguiente
    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button
                type="button"
                class="page-link"
                data-page="${currentPage + 1}"
            >
                Siguiente
            </button>
        </li>
    `;

    pagination.innerHTML = html;
}

function createProductRow(producto) {
    return `
        <tr>
            <td>
                <input
                    type="checkbox"
                    class="form-check-input product-checkbox"
                    data-id="${producto.id}"
                />
            </td>

            <td>
                ${producto.id}
            </td>

            <td>
                ${escapeHtml(producto.nombre)}
            </td>

            <td>
                $${Number(producto.precio).toLocaleString("es-CL")}
            </td>

            <td>
                ${producto.stock}
            </td>

            <td>
                <button
                    type="button"
                    class="action-btn edit edit-btn"
                    data-id="${producto.id}"
                    data-nombre="${escapeAttribute(producto.nombre)}"
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
                    type="button"
                    class="action-btn delete delete-btn"
                    data-id="${producto.id}"
                    data-nombre="${escapeAttribute(producto.nombre)}"
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
            nombre: document.getElementById("addNombre").value.trim(),

            precio: Number(document.getElementById("addPrecio").value),

            stock: Number(document.getElementById("addStock").value),
        };

        if (!validateProduct(product)) {
            return;
        }

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

            await loadProducts();

            alert("Producto agregado correctamente");
        } catch (error) {
            console.error(error);

            alert(error.message);
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
            nombre: document.getElementById("editNombre").value.trim(),

            precio: Number(document.getElementById("editPrecio").value),

            stock: Number(document.getElementById("editStock").value),
        };

        if (!validateProduct(product)) {
            return;
        }

        try {
            await request(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            closeModal("editProductModal");

            await loadProducts();

            alert("Producto actualizado");
        } catch (error) {
            console.error(error);

            alert(error.message);
        }
    });
}

// Delete

function setupDelete() {
    const form = document.getElementById("deleteProductForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const checkedProducts = document.querySelectorAll(
            ".product-checkbox:checked",
        );

        // IDs seleccionados (eliminar masivo)
        const selectedIds = [...checkedProducts].map((checkbox) =>
            Number(checkbox.dataset.id),
        );

        try {
            // ELIMINACIÓN MASIVA
            if (selectedIds.length > 0) {
                await Promise.all(
                    selectedIds.map((id) =>
                        request(`${API_URL}/${id}`, {
                            method: "DELETE",
                        }),
                    ),
                );
            }

            // ELIMINACIÓN INDIVIDUAL
            else if (selectedProductId) {
                await request(`${API_URL}/${selectedProductId}`, {
                    method: "DELETE",
                });
            } else {
                alert("Seleccione un producto");

                return;
            }

            closeModal("deleteProductModal");

            selectedProductId = null;

            await loadProducts();

            alert("Producto(s) eliminado(s)");
        } catch (error) {
            console.error(error);

            alert(error.message);
        }
    });
}

// Eventos de tabla

function setupTableEvents() {
    const tableBody = document.getElementById("products-table");

    tableBody?.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".edit-btn");

        const deleteBtn = e.target.closest(".delete-btn");

        if (editBtn) {
            fillEditForm(editBtn.dataset);
        }

        if (deleteBtn) {
            selectedProductId = deleteBtn.dataset.id;

            document.getElementById("deleteProductName").textContent =
                deleteBtn.dataset.nombre;
        }
    });

    const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");

    bulkDeleteBtn?.addEventListener("click", () => {
        const checked = document.querySelectorAll(".product-checkbox:checked");

        const deleteText = document.getElementById("deleteProductName");

        selectedProductId = null;

        if (checked.length === 1) {
            const row = checked[0].closest("tr");

            deleteText.textContent = row.children[2].textContent.trim();
        } else {
            deleteText.textContent = `${checked.length} productos`;
        }
    });

    document.getElementById("pagination")?.addEventListener("click", (e) => {
        const pageBtn = e.target.closest(".page-link");

        if (!pageBtn?.dataset.page) {
            return;
        }

        const page = Number(pageBtn.dataset.page);

        const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

        if (page < 1 || page > totalPages) {
            return;
        }

        currentPage = page;

        renderProducts();
        renderPagination();

        resetSelectAll();
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

    const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");

    selectAll?.addEventListener("change", function () {
        document.querySelectorAll(".product-checkbox").forEach((cb) => {
            cb.checked = this.checked;
        });

        const checked = document.querySelectorAll(".product-checkbox:checked");

        if (bulkDeleteBtn) {
            bulkDeleteBtn.disabled = checked.length === 0;
        }
    });

    document.addEventListener("change", (e) => {
        if (!e.target.matches(".product-checkbox")) {
            return;
        }

        const checkboxes = document.querySelectorAll(".product-checkbox");

        const checked = document.querySelectorAll(".product-checkbox:checked");

        selectAll.checked =
            checkboxes.length > 0 && checkboxes.length === checked.length;

        if (bulkDeleteBtn) {
            bulkDeleteBtn.disabled = checked.length === 0;
        }
    });
}

// Validaciones

function validateProduct(product) {
    if (!product.nombre) {
        alert("Ingrese un nombre válido");

        return false;
    }

    if (isNaN(product.precio) || product.precio < 0) {
        alert("Ingrese un precio válido");

        return false;
    }

    if (isNaN(product.stock) || product.stock < 0) {
        alert("Ingrese un stock válido");

        return false;
    }

    return true;
}

// Helpers

function closeModal(modalId) {
    bootstrap.Modal.getInstance(document.getElementById(modalId))?.hide();
}

function resetSelectAll() {
    const selectAll = document.getElementById("selectAll");

    const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");

    if (selectAll) {
        selectAll.checked = false;
    }

    if (bulkDeleteBtn) {
        bulkDeleteBtn.disabled = true;
    }
}

function updatePaginationInfo(start, end, total) {
    const el = document.getElementById("pagination-info");

    if (!el) {
        return;
    }

    el.innerHTML = `
        Mostrando
        <b>${start}-${end}</b>
        de
        <b>${total}</b>
        entradas
    `;
}

function escapeHtml(str) {
    const div = document.createElement("div");

    div.textContent = str ?? "";

    return div.innerHTML;
}

function escapeAttribute(str) {
    return String(str ?? "").replaceAll('"', "&quot;");
}
