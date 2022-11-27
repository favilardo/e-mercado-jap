document.addEventListener('submit', function(evento){
    evento.preventDefault();

    let mail = document.getElementById("email");
    let contrasena = document.getElementById("password");

    if (mail.value.length >= 1 && contrasena.value.length >= 1) {
        let infoUser = {
            firstName: '',
            secondName: '',
            lastName: '',
            secondLastName: '',
            email: mail.value,
            phoneNumber: '',
            profilePic: ''
        }
        localStorage.setItem("usuario", JSON.stringify(infoUser));
        window.location.href = "index.html";
    } else {
        alert("Alguno de los campos estaba vacio. Completa ambos campos para continuar.");
    }
    
})

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}