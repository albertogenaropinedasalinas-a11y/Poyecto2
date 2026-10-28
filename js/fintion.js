let agpsCarrito = [];
try {
    const guardado = JSON.parse(localStorage.getItem("agpsCarrito") || "[]");
    if (Array.isArray(guardado)) agpsCarrito = guardado;
} catch (error) {
    agpsCarrito = [];
}

const agpsOverlay = document.getElementById("agps-overlay");
const agpsItems = document.getElementById("agps-items");
const agpsTotal = document.getElementById("agps-total");
const agpsConteo = document.getElementById("agps-conteo");
const agpsAviso = document.getElementById("agps-aviso");

function agpsActualizar() {
    if (!agpsItems) return;

    const cantidad = agpsCarrito.reduce((suma, p) => suma + p.cantidad, 0);
    if (agpsConteo) agpsConteo.textContent = cantidad;
    agpsItems.replaceChildren();

    if (agpsCarrito.length === 0) {
        agpsItems.textContent = "Tu bolsa está vacía.";
    } else {
        agpsCarrito.forEach((producto, indice) => {
            const fila = document.createElement("div");
            fila.className = "agps-item";

            const nombre = document.createElement("span");
            nombre.textContent = `${producto.nombre} × ${producto.cantidad} — $${(producto.precio * producto.cantidad).toFixed(2)}`;

            const quitar = document.createElement("button");
            quitar.className = "agps-quitar";
            quitar.textContent = "Quitar";
            quitar.dataset.quitar = indice;

            fila.append(nombre, quitar);
            agpsItems.appendChild(fila);
        });
    }

    const total = agpsCarrito.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
    if (agpsTotal) agpsTotal.textContent = total.toFixed(2);

    try {
        localStorage.setItem("agpsCarrito", JSON.stringify(agpsCarrito));
    } catch (error) {}
}

function agpsMostrarAviso(mensaje) {
    if (!agpsAviso) return;

    agpsAviso.textContent = mensaje;
    agpsAviso.classList.add("agps-visible");
    clearTimeout(agpsMostrarAviso.temporizador);

    agpsMostrarAviso.temporizador = setTimeout(() => {
        agpsAviso.classList.remove("agps-visible");
    }, 2000);
}

document.querySelectorAll(".agps-agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        if (!nombre || !Number.isFinite(precio) || precio < 0) return;

        const existente = agpsCarrito.find(p => p.nombre === nombre);

        if (existente) existente.cantidad++;
        else agpsCarrito.push({ nombre, precio, cantidad: 1 });

        agpsActualizar();
        agpsMostrarAviso("Producto agregado a tu bolsa");
    });
});

agpsItems?.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-quitar]");
    if (!boton) return;

    const indice = Number(boton.dataset.quitar);

    if (Number.isInteger(indice) && indice >= 0 && indice < agpsCarrito.length) {
        agpsCarrito.splice(indice, 1);
        agpsActualizar();
    }
});

document.getElementById("agps-abrir")?.addEventListener("click", () => {
    agpsOverlay?.classList.add("agps-visible");
});

document.getElementById("agps-cerrar")?.addEventListener("click", () => {
    agpsOverlay?.classList.remove("agps-visible");
});

agpsOverlay?.addEventListener("click", evento => {
    if (evento.target === agpsOverlay) agpsOverlay.classList.remove("agps-visible");
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") agpsOverlay?.classList.remove("agps-visible");
});

document.getElementById("agps-form-contacto")?.addEventListener("submit", evento => {
    evento.preventDefault();

    const respuesta = document.getElementById("agps-respuesta");
    if (respuesta) {
        respuesta.textContent = "Formulario validado. Para enviar mensajes reales, conecta un servicio de correo.";
    }

    agpsMostrarAviso("Formulario de demostración");
});

agpsActualizar();

