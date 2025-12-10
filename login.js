import { db } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("loginError");

    error.textContent = "";

    try {
        const userRef = ref(db, "USUARIOS/" + usuario);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            error.textContent = "❌ Usuario o contraseña incorrectos.";
            return;
        }

        const data = snapshot.val();

        if (String(data.password) === password) {

            const rol = data.rol;

            localStorage.setItem("rolUsuario", rol);

            // ✅ REDIRECCIÓN SEGÚN ROL
            if (rol === "administrador") {
                window.location.href = "index.html";
            } 
            
            else if (rol === "cabecera" || rol === "cabecera") {
                window.location.href = "cabecera.html";
            
            } 
            else if (rol === "cañaveral" || rol === "cañaveral") {
                window.location.href = "cañaveral.html";
            } 
            else if (rol === "piedecuesta") {
                window.location.href = "piedecuesta.html";
            } 
            else {
                error.textContent = "❌ Rol no reconocido.";
            }

        } else {
            error.textContent = "❌ Usuario o contraseña incorrectos.";
        }

    } catch (err) {
        console.error("ERROR FIREBASE:", err);
        error.textContent = "❌ Error al conectar con Firebase.";
    }
});
