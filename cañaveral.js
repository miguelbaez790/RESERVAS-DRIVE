// cañaveral.js
import { db } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configura la sede
const sedeActual = "canaveral";

// Elementos del DOM
const diasContainer = document.getElementById("dias");
const reservasPanel = document.getElementById("reservasPanel");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

// Variables de fecha
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// ----------------------
// GENERAR CALENDARIO
// ----------------------
function generarCalendario(month, year) {
    diasContainer.innerHTML = "";
    monthYear.textContent = `${year}-${month + 1}`;

    const firstDay = new Date(year, month, 1).getDay();
    const diasMes = new Date(year, month + 1, 0).getDate();

    // Espacios en blanco iniciales
    for (let i = 0; i < firstDay; i++) {
        diasContainer.appendChild(document.createElement("div"));
    }

    // Crear días del mes
    for (let d = 1; d <= diasMes; d++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = d;
        dayDiv.dataset.dia = d;

        dayDiv.addEventListener("click", () => mostrarReservas(d, month, year));

        diasContainer.appendChild(dayDiv);
    }

    marcarDiasConReservas(month, year);
}

// ----------------------
// MOSTRAR RESERVAS DE UN DÍA
// ----------------------
function mostrarReservas(dia, month, year) {
    reservasPanel.innerHTML = `<h3>Reservas del día ${dia}/${month + 1}/${year}</h3>`;

    const reservasRef = ref(db, `reservas/${sedeActual}`);
    onValue(reservasRef, snapshot => {
        let hayReservas = false;

        snapshot.forEach(reservaSnap => {
            const r = reservaSnap.val();
            if (!r.fecha) return;

            const fechaReserva = new Date(r.fecha + "T00:00:00");

            if (fechaReserva.getDate() === dia &&
                fechaReserva.getMonth() === month &&
                fechaReserva.getFullYear() === year) {

                hayReservas = true;

                // Crear contenedor de reserva
                const div = document.createElement("div");
                div.classList.add("reserva-item");

                // Información de la reserva
                div.innerHTML = `
                    <h4>${r.nombre}</h4>
                    <p><strong>Personas:</strong> ${r.personas}</p>
                    <p><strong>Fecha:</strong> ${r.fecha}</p>
                    <p><strong>Hora:</strong> ${r.hora}</p>
                    <p><strong>Sede:</strong> ${r.sede}</p>
                    <p><strong>Observación:</strong> ${r.observacion || '-'}</p>
                    <p><strong>Responsable:</strong> ${r.responsable || '-'}</p>
                `;

                // BOTÓN aceptar solo si no está aceptada
                if (r.estado !== "aceptada") {
                    const btn = document.createElement("button");
                    btn.textContent = "Aceptar Reserva";
                    btn.classList.add("aceptar-btn");
                    btn.addEventListener("click", () => {
                        update(ref(db, `reservas/${sedeActual}/${reservaSnap.key}`), { estado: "aceptada" });
                        alert(`Reserva de ${r.nombre} aceptada`);
                        // Cambiar visualmente el botón
                        btn.textContent = "✅ Aceptada";
                        btn.disabled = true;
                        div.style.opacity = "0.7";
                    });
                    div.appendChild(btn);
                } else {
                    const acceptedLabel = document.createElement("p");
                    acceptedLabel.textContent = "✅ Reserva aceptada";
                    div.appendChild(acceptedLabel);
                    div.style.opacity = "0.7";
                }

                reservasPanel.appendChild(div);
            }
        });

        if (!hayReservas) reservasPanel.innerHTML += "<p>No hay reservas para este día.</p>";
    }, { onlyOnce: true });
}

// ----------------------
// MARCAR DÍAS CON RESERVAS
// ----------------------
function marcarDiasConReservas(month, year) {
    const reservasRef = ref(db, `reservas/${sedeActual}`);
    onValue(reservasRef, snapshot => {
        const diasConReserva = new Set();

        snapshot.forEach(reservaSnap => {
            const r = reservaSnap.val();
            if (!r.fecha) return;

            const fecha = new Date(r.fecha + "T00:00:00");
            if (fecha.getMonth() === month && fecha.getFullYear() === year) {
                diasConReserva.add(fecha.getDate());
            }
        });

        document.querySelectorAll(".day").forEach(dayDiv => {
            const dia = parseInt(dayDiv.dataset.dia);
            if (diasConReserva.has(dia)) dayDiv.classList.add("reservado");
            else dayDiv.classList.remove("reservado");
        });
    }, { onlyOnce: true });
}

// ----------------------
// NAVEGACIÓN DE MESES
// ----------------------
prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    generarCalendario(currentMonth, currentYear);
});
nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    generarCalendario(currentMonth, currentYear);
});

// Inicializar calendario
generarCalendario(currentMonth, currentYear);
