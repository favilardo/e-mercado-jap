const FIRST_NAME = document.getElementById("firstName");
const SECOND_NAME = document.getElementById("secondName");
const LAST_NAME = document.getElementById("lastName");
const SECOND_LAST_NAME = document.getElementById("secondLastName");
const EMAIL = document.getElementById("email");
const PHONE_NUMBER = document.getElementById("phoneNumber");
const DATA_FORM = document.getElementById("dataForm");
const PICTURELOAD = document.getElementById("profilePic");
const PROFILEPIC =  document.getElementById('profilePicLoad');

function saveData(){
  let infoUser

    if (localStorage.getItem('image-dropped') != null) {
      infoUser = {
          firstName: FIRST_NAME.value,
          secondName: SECOND_NAME.value,
          lastName: LAST_NAME.value,
          secondLastName: SECOND_LAST_NAME.value,
          email: EMAIL.value,
          phoneNumber: PHONE_NUMBER.value,
          profilePic: localStorage.getItem('image-dropped')
      }
    }else{
      infoUser = {
        firstName: FIRST_NAME.value,
        secondName: SECOND_NAME.value,
        lastName: LAST_NAME.value,
        secondLastName: SECOND_LAST_NAME.value,
        email: EMAIL.value,
        phoneNumber: PHONE_NUMBER.value,
        profilePic: ''
      }
    }

    
    localStorage.setItem("usuario", JSON.stringify(infoUser));
    localStorage.removeItem('image-dropped');
}

PICTURELOAD.addEventListener('change', function () {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localStorage.setItem("image-dropped", reader.result);
  });
  reader.readAsDataURL(this.files[0]);
})

DATA_FORM.addEventListener('submit', (event) =>{
    event.preventDefault();
    event.stopPropagation();
    saveData();
    var alert = document.querySelector('.alert');
    alert.classList.remove("fade");
    alert.classList.add("show");
    setTimeout(() => {
      alert.classList.remove("show");
      alert.classList.add("fade");
    }, 3000);
    let listadoNav = document.getElementsByTagName("li");
    let infoUser = JSON.parse(localStorage.getItem("usuario"));
    listadoNav[3].innerHTML = `<div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        ${infoUser.email}
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
      <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
      <li><a class="dropdown-item" href="#" onClick="logOut()">Cerrar sesion</a></li>
      </ul>
    </div> `;
    PROFILEPIC.setAttribute("src", infoUser.profilePic);
});

document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem('image-dropped');
    let infoUser = JSON.parse(localStorage.getItem("usuario"));
    FIRST_NAME.value = infoUser.firstName;
    SECOND_NAME.value = infoUser.secondName;
    LAST_NAME.value = infoUser.lastName;
    SECOND_LAST_NAME.value = infoUser.secondLastName;
    EMAIL.value = infoUser.email;
    PHONE_NUMBER.value = infoUser.phoneNumber;
    PROFILEPIC.setAttribute("src", infoUser.profilePic);


})