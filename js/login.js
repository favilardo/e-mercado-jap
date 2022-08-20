document.addEventListener('submit', function(evento){
    evento.preventDefault();
    localStorage.setItem("logIn", true);
    window.location.href = "index.html";
})