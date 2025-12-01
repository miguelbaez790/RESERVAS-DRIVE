// Usuarios permitidos y sus roles
const usuarios = {
    "admin": { pass: "1234", rol: "administrador" },
    "cabecera": { pass: "1111", rol: "cabecera" },
    "cañaveral": { pass: "2222", rol: "cañaveral" },
    "piedecuesta": { pass: "3333", rol: "piedecuesta" }
};

document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    const error = document.getElementById("loginError");

    if (usuarios[usuario] && usuarios[usuario].pass === password) {

        // Guardar rol en localStorage
        localStorage.setItem("rolUsuario", usuarios[usuario].rol);

        // Redirigir al sistema
        window.location.href = "index.html";

    } else {
        error.textContent = "Usuario o contraseña incorrectos.";
    }
});
