async function loadProducts() {
    try {
        const response = await fetch("http://localhost:3000/api/products");

        if (!response.ok) {
            throw new Error("Error obteniendo productos");
        }

        const productos = await response.json();

        const tableBody = document.getElementById("products-table");

        tableBody.innerHTML = "";

        productos.forEach((producto) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$${Number(producto.precio).toLocaleString("es-CL")}</td>
                <td>${producto.stock}</td>
                <td>
                    <button>Ver</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

loadProducts();
