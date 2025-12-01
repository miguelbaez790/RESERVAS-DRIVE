// ===============================
//  SISTEMA DE RESERVAS DRIVEPIZZA CON ROLES
// ===============================

// ===============================
// 🔐 VERIFICAR LOGIN
// ===============================
const rolUsuario = localStorage.getItem("rolUsuario");

// Si no hay sesión → volver al login
if (!rolUsuario) {
    window.location.href = "login.html";
}

// ===============================
//  OBTENER ELEMENTOS
// ===============================
const form = document.getElementById("formReserva");
const tablaBody = document.querySelector("#tablaReservas tbody");

// Dashboard
const totalReservasTXT = document.getElementById("totalReservas");
const canaveralTXT = document.getElementById("reservasCanaveral");
const piedecuestaTXT = document.getElementById("reservasPiedecuesta");
const cabeceraTXT = document.getElementById("reservasCabecera");
const proximosClientesList = document.getElementById("proximosClientes");

// Mostrar el rol en pantalla


// ===============================
// BLOQUEAR SEDE SEGÚN ROL
// ===============================
if (rolUsuario !== "administrador") {
    const sedeInput = document.getElementById("sede");

    sedeInput.value = capitalizar(rolUsuario);
    sedeInput.disabled = true;
}

// ===============================
//  CARGAR RESERVAS AL INICIAR
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    cargarReservas();
    actualizarDashboard();
});

let idEdicion = null;

// ===============================
// GUARDAR O EDITAR RESERVA
// ===============================
function guardarReserva(reserva) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];

    reserva.estado = "pendiente"; // 🔥 estado inicial

    reservas.push(reserva);
    localStorage.setItem("reservasDrivePizza", JSON.stringify(reservas));
}

function actualizarReserva(reservaActualizada) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];

    reservas = reservas.map(r => 
        r.id === reservaActualizada.id 
        ? { ...reservaActualizada, estado: r.estado } 
        : r
    );

    localStorage.setItem("reservasDrivePizza", JSON.stringify(reservas));
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const reserva = {
        id: idEdicion ? idEdicion : Date.now(),
        sede: document.getElementById("sede").value,
        nombre: document.getElementById("nombre").value,
        dia: document.getElementById("dia").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        personas: document.getElementById("personas").value,
        contacto: document.getElementById("contacto").value
    };

    // Validar duplicados
    if (!idEdicion && reservaDuplicada(reserva)) {
        alert("❌ Ya existe una reserva en esa sede, fecha y hora.");
        return;
    }

    if (idEdicion) {
        actualizarReserva(reserva);
        idEdicion = null;
        alert("✔️ Reserva editada.");
    } else {
        guardarReserva(reserva);
        alert("✔️ Reserva creada.");
    }

    limpiarTabla();
    cargarReservas();
    actualizarDashboard();
    form.reset();

    if (rolUsuario !== "administrador") {
        document.getElementById("sede").value = capitalizar(rolUsuario);
    }
});

// ===============================
// FUNCIONES CRUD
// ===============================
function reservaDuplicada(reservaNueva) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];

    return reservas.some(r =>
        r.sede === reservaNueva.sede &&
        r.fecha === reservaNueva.fecha &&
        r.hora === reservaNueva.hora
    );
}

function guardarReserva(reserva) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservasDrivePizza", JSON.stringify(reservas));
}

function actualizarReserva(reservaActualizada) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];
    reservas = reservas.map(r => r.id === reservaActualizada.id ? reservaActualizada : r);
    localStorage.setItem("reservasDrivePizza", JSON.stringify(reservas));
}

function cargarReservas() {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];

    reservas.forEach(r => {
        if (rolUsuario !== "administrador" && r.sede.toLowerCase() !== rolUsuario) {
            return;
        }
        agregarFilaTabla(r);
    });
}

function limpiarTabla() {
    tablaBody.innerHTML = "";
}

function agregarFilaTabla(reserva) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${reserva.sede}</td>
        <td>${reserva.nombre}</td>
        <td>${reserva.fecha}</td>
        <td>${reserva.hora}</td>
        <td>${reserva.personas}</td>
        <td>${reserva.contacto}</td>
        <td>
            <button class="btnEditar" onclick="editarReserva(${reserva.id})">✏️</button>
            <button class="btnEliminar" onclick="eliminarReserva(${reserva.id})">🗑️</button>
        </td>
    `;

    tablaBody.appendChild(fila);
}

function eliminarReserva(id) {
    if (confirm("¿Eliminar reserva?")) {
        let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];
        reservas = reservas.filter(r => r.id !== id);
        localStorage.setItem("reservasDrivePizza", JSON.stringify(reservas));

        limpiarTabla();
        cargarReservas();
        actualizarDashboard();

        alert("🗑️ Reserva eliminada.");
    }
}

function editarReserva(id) {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];
    const reserva = reservas.find(r => r.id === id);

    document.getElementById("sede").value = reserva.sede;
    document.getElementById("nombre").value = reserva.nombre;
    document.getElementById("dia").value = reserva.dia;
    document.getElementById("fecha").value = reserva.fecha;
    document.getElementById("hora").value = reserva.hora;
    document.getElementById("personas").value = reserva.personas;
    document.getElementById("contacto").value = reserva.contacto;

    idEdicion = id;

    alert("✏️ Editando reserva...");
}

// ===============================
// 🟦 DASHBOARD
// ===============================
function actualizarDashboard() {
    let reservas = JSON.parse(localStorage.getItem("reservasDrivePizza")) || [];

    let visibles = rolUsuario === "administrador"
        ? reservas
        : reservas.filter(r => r.sede.toLowerCase() === rolUsuario);

    totalReservasTXT.textContent = visibles.length;

    canaveralTXT.textContent = visibles.filter(r => r.sede === "Cañaveral").length;
    piedecuestaTXT.textContent = visibles.filter(r => r.sede === "Piedecuesta").length;
    cabeceraTXT.textContent = visibles.filter(r => r.sede === "Cabecera").length;

    actualizarProximos(visibles);
}

function actualizarProximos(reservas) {
    proximosClientesList.innerHTML = "";

    let ordenados = reservas.sort((a, b) =>
        new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora)
    );

    ordenados.slice(0, 5).forEach(r => {
        let li = document.createElement("li");
        li.textContent = `${r.nombre} - ${r.sede} | ${r.fecha} ${r.hora}`;
        proximosClientesList.appendChild(li);
    });
}

// ===============================
// CERRAR SESIÓN
// ===============================
function cerrarSesion() {
    localStorage.removeItem("rolUsuario");
    window.location.href = "login.html";
}

// ===============================
// UTILIDAD
// ===============================
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ===============================
// OCULTAR CARDS SEGÚN ROL
// ===============================
if (rolUsuario !== "administrador") {

    // Ocultar totales de sedes que NO sean la del usuario
    if (rolUsuario !== "cañaveral") {
        document.querySelector(".sede-canaveral").style.display = "none";
    }

    if (rolUsuario !== "piedecuesta") {
        document.querySelector(".sede-piedecuesta").style.display = "none";
    }

    if (rolUsuario !== "cabecera") {
        document.querySelector(".sede-cabecera").style.display = "none";
    }

    // Ocultar total general (solo admin lo ve)
    document.querySelector(".total-general").style.display = "none";
}

