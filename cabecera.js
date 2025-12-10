// cañaveral.js
import { db } from "./firebase.js";
import { ref, onValue, update, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Variables del calendario
let currentDate = new Date();
const monthYear = document.getElementById("monthYear");
const diasContainer = document.getElementById("dias");
const reservasPanel = document.getElementById("reservasPanel");

// Nombres de meses
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para renderizar calendario
function renderCalendar() {
    monthYear.textContent = `${meses[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    diasContainer.innerHTML = "";

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Espacios en blanco antes del primer día
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div");
        diasContainer.appendChild(emptyDay);
    }

    // Días del mes
    for (let d = 1; d <= lastDate; d++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = d;

        // Evento al hacer click en un día
        dayDiv.addEventListener("click", () => {
            const fechaSeleccionada = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            cargarReservas(fechaSeleccionada);
        });

        diasContainer.appendChild(dayDiv);
    }
}

// Botones mes anterior y siguiente
document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Función para cargar reservas desde Firebase
function cargarReservas(fecha) {
    reservasPanel.innerHTML = `<h3>Reservas para ${fecha}</h3>`;

    const reservasRef = ref(db, `sedes/cañaveral/reservas/${fecha}`);
    onValue(reservasRef, (snapshot) => {
        reservasPanel.innerHTML = `<h3>Reservas para ${fecha}</h3>`; // Reset panel

        const data = snapshot.val();
        if (data) {
            Object.entries(data).forEach(([key, reserva]) => {
                const reservaDiv = document.createElement("div");
                reservaDiv.classList.add("reserva-item");

                reservaDiv.innerHTML = `
                    <h4>${reserva.nombre}</h4>
                    <p>Hora: ${reserva.hora}</p>
                    <p>Personas: ${reserva.personas}</p>
                    <p>Observaciones: ${reserva.observaciones || "-"}</p>
                    <button class="aceptar-btn">Aceptar Reserva</button>
                `;

                // Botón aceptar reserva
                reservaDiv.querySelector(".aceptar-btn").addEventListener("click", () => {
                    // Marcar reserva como aceptada en Firebase
                    update(ref(db, `sedes/cañaveral/reservas/${fecha}/${key}`), { estado: "aceptada" })
                    .then(() => {
                        alert(`Reserva de ${reserva.nombre} aceptada`);
                        // Enviar notificación al admin
                        const notiRef = ref(db, `notificaciones`);
                        push(notiRef, {
                            mensaje: `Reserva de ${reserva.nombre} aceptada por Cañaveral`,
                            fecha: new Date().toISOString()
                        });
                    })
                    .catch((error) => {
                        console.error("Error al aceptar reserva:", error);
                    });
                });

                reservasPanel.appendChild(reservaDiv);
            });
        } else {
            reservasPanel.innerHTML += "<p>No hay reservas para este día.</p>";
        }
    }, { onlyOnce: true });
}

// Inicializar calendario
renderCalendar();
