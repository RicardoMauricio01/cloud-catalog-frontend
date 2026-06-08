const API_URL = "http://192.168.50.23:5501/api/products";

let selectedProductId = null;

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    setupCreate();

    setupEdit();

    setupDelete();
});

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Error obteniendo productos");
        }

        const productos = await response.json();

        const tableBody = document.getElementById("products-table");

        tableBody.innerHTML = "";

        productos.forEach((producto) => {
            const row = document.createElement("tr");

            row.innerHTML = `
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
                `;

            tableBody.appendChild(row);
        });

        setupCheckboxes();

        setupDynamicButtons();
    } catch (error) {
        console.error(error);
    }
}

function setupCreate() {
    const form = document.getElementById("addProductForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("addNombre").value;

        const precio = document.getElementById("addPrecio").value;

        const stock = document.getElementById("addStock").value;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    precio,
                    stock,
                }),
            });

            if (!response.ok) {
                throw new Error("Error creando producto");
            }

            bootstrap.Modal.getInstance(
                document.getElementById("addProductModal")
            ).hide();

            form.reset();

            loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

function setupEdit() {
    const form = document.getElementById("editProductForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("editId").value;

        const nombre = document.getElementById("editNombre").value;

        const precio = document.getElementById("editPrecio").value;

        const stock = document.getElementById("editStock").value;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    precio,
                    stock,
                }),
            });

            if (!response.ok) {
                throw new Error("Error actualizando producto");
            }

            bootstrap.Modal.getInstance(
                document.getElementById("editProductModal")
            ).hide();

            loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

function setupDelete() {
    const form = document.querySelector("#deleteProductModal form");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/${selectedProductId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error eliminando producto");
            }

            bootstrap.Modal.getInstance(
                document.getElementById("deleteProductModal")
            ).hide();

            loadProducts();
        } catch (error) {
            console.error(error);
        }
    });
}

function setupDynamicButtons() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.getElementById("editId").value = btn.dataset.id;

            document.getElementById("editNombre").value = btn.dataset.nombre;

            document.getElementById("editPrecio").value = btn.dataset.precio;

            document.getElementById("editStock").value = btn.dataset.stock;
        });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedProductId = btn.dataset.id;
        });
    });
}

function setupCheckboxes() {
    const selectAll = document.getElementById("selectAll");

    const checkboxes = document.querySelectorAll(".product-checkbox");

    selectAll?.addEventListener("change", function () {
        checkboxes.forEach((cb) => {
            cb.checked = this.checked;
        });
    });
}
