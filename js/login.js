document.addEventListener('submit', function(evento){
    evento.preventDefault();

    let mail = document.getElementById("email");
    let contrasena = document.getElementById("password");

    if (mail.value.length >= 1 && contrasena.value.length >= 1) {
        localStorage.setItem("logIn", true);
        window.location.href = "index.html";
    } else {
        alert("Alguno de los campos estaba vacio. Completa ambos campos para continuar.");
    }
    
})