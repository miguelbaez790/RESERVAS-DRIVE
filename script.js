// script.js
import { db } from "./firebase.js";
import { ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const normalizarSede = s => s.toLowerCase().replace(/ñ/g, "n");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReserva");
  const tabla = document.querySelector("#tablaReservas tbody");

  const totalReservas = document.getElementById("totalReservas");
  const reservasCabecera = document.getElementById("reservasCabecera");
  const reservascanaveral = document.getElementById("reservascanaveral");
  const reservasPiedecuesta = document.getElementById("reservasPiedecuesta");

  // ----------------------
  // REGISTRAR RESERVA
  // ----------------------
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const sede = normalizarSede(form.sede.value);
    const nombre = form.nombre.value;
    const dia = form.dia.value;
    const fecha = form.fecha.value;
    const hora = form.hora.value;
    const personas = form.personas.value;
    const contacto = form.contacto.value;
    const responsable = form.responsable?.value || "";
    const observacion = form.observacion?.value || "";

    if (!sede || !nombre || !fecha || !hora || !personas || !contacto) {
      alert("⚠️ Complete todos los campos");
      return;
    }

    try {
      const nuevaReservaRef = push(ref(db, `reservas/${sede}`));
      await set(nuevaReservaRef, {
        id: nuevaReservaRef.key,
        sede,
        nombre,
        dia,
        fecha,
        hora,
        personas,
        contacto,
        responsable,
        observacion,
        estado: "pendiente" // <-- usamos string para controlar mejor
      });
      alert("✅ Reserva registrada correctamente");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar la reserva");
    }
  });

  // ----------------------
  // LEER RESERVAS Y ACTUALIZAR TABLA
  // ----------------------
  onValue(ref(db, "reservas"), snapshot => {
    tabla.innerHTML = "";
    let total = 0, cab = 0, can = 0, pie = 0;

    snapshot.forEach(sedeSnap => {
      sedeSnap.forEach(reservaSnap => {
        const r = reservaSnap.val();
        if (!r.fecha) return;

        total++;
        const sedeNormalizada = normalizarSede(r.sede);
        if (sedeNormalizada === "cabecera") cab++;
        if (sedeNormalizada === "canaveral") can++;
        if (sedeNormalizada === "piedecuesta") pie++;

        const tr = document.createElement("tr");
        tr.style.background = r.estado === "aceptada" ? "#d4edda" : ""; // verde si aceptada

        tr.innerHTML = `
          <td>${r.sede}</td>
          <td>${r.nombre}</td>
          <td>${r.fecha}</td>
          <td>${r.hora}</td>
          <td>${r.personas}</td>
          <td>${r.contacto}</td>
          <td>${r.responsable || ""}</td>
          <td>${r.observacion || ""}</td>
          <td>${r.estado}</td>
          <td></td>
        `;
        tabla.appendChild(tr);

        const accionesTd = tr.querySelector("td:last-child");

        // Botón aceptar solo si está pendiente
        if (r.estado === "pendiente") {
          const btnAceptar = document.createElement("button");
          btnAceptar.textContent = "✅ Aceptar";
          btnAceptar.addEventListener("click", async () => {
            await update(ref(db, `reservas/${sedeNormalizada}/${r.id}`), { estado: "aceptada" });
          });
          accionesTd.appendChild(btnAceptar);
        }

        // Botón cancelar
        const btnCancelar = document.createElement("button");
        btnCancelar.textContent = "❌ Cancelar";
        btnCancelar.addEventListener("click", async () => {
          await update(ref(db, `reservas/${sedeNormalizada}/${r.id}`), { estado: "cancelada" });
        });
        accionesTd.appendChild(btnCancelar);

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "🗑 Eliminar";
        btnEliminar.addEventListener("click", async () => {
          if (confirm("¿Eliminar esta reserva?")) {
            await remove(ref(db, `reservas/${sedeNormalizada}/${r.id}`));
          }
        });
        accionesTd.appendChild(btnEliminar);
      });
    });

    totalReservas.textContent = total;
    reservasCabecera.textContent = cab;
    reservascanaveral.textContent = can;
    reservasPiedecuesta.textContent = pie;
  });
});
