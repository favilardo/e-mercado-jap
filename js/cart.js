const PRE_LOADED_CART = CART_INFO_URL + "25801" + EXT_TYPE;

function loadPrices() {
    let subtotal = 0;
    let shipment = 0;
    let arraySubtotales = document.querySelectorAll(".item-subtotal");
    for (let itemSubtotal of arraySubtotales) {
        let wordsSubtotal = itemSubtotal.innerHTML.split(' ');
        if (wordsSubtotal[0] === "USD") {
            subtotal += +wordsSubtotal[1].replace(".","")
        } else {
            subtotal += +wordsSubtotal[1].replace(".","")/40;
        } 
    }
    document.getElementById("subtotal").innerHTML = `USD ${subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    if (document.getElementById("shipment1").checked) {
        shipment = subtotal*0.15;
        document.getElementById("shipping_ammount").innerHTML = `USD ${shipment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    } else if (document.getElementById("shipment2").checked) {
        shipment = subtotal*0.07;
        document.getElementById("shipping_ammount").innerHTML = `USD ${shipment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    } else {
        shipment = subtotal*0.05;
        document.getElementById("shipping_ammount").innerHTML = `USD ${shipment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }
    document.getElementById("cart_total").innerHTML = `USD ${(subtotal+shipment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function validatePayment() {
    let creditCheck = document.getElementById("creditCard");
    let transferCheck = document.getElementById("transfer");
    let cardNumber = document.getElementById("cardNumber");
    let cardCVV = document.getElementById("cardCVV");
    let expiration = document.getElementById("expiration");
    let bankAccountNumber = document.getElementById("bankAccountNumber");

    if((!(creditCheck.checked || transferCheck.checked)) || (creditCheck.checked && (!cardNumber.checkValidity() || !cardCVV.checkValidity() || !expiration.checkValidity())) || (transferCheck.checked && !bankAccountNumber.checkValidity())){
        document.getElementById("botonTerminos").classList.add("is-invalid");
        document.getElementById("botonTerminos").classList.remove("is-valid");
    }else{
        document.getElementById("botonTerminos").classList.remove("is-invalid");
        document.getElementById("botonTerminos").classList.add("is-valid");
    }
}

document.getElementById("shipment1").addEventListener("click", loadPrices);
document.getElementById("shipment2").addEventListener("click", loadPrices);
document.getElementById("shipment3").addEventListener("click", loadPrices);

document.getElementById("creditCard").addEventListener("click", function(params) {
    document.getElementById("bankAccountNumber").disabled = true;
    document.getElementById("bankAccountNumber").required = false;
    for (let inputToEnable of document.querySelectorAll(".credit")) {
        inputToEnable.disabled = false;
        inputToEnable.required = true;
    }
    document.getElementById("paymentMethod").innerHTML = `Tarjeta de crédito`;
});

document.getElementById("transfer").addEventListener("click", function(params) {
    for (let inputToDisable of document.querySelectorAll(".credit")) {
        inputToDisable.disabled = true;
        inputToDisable.required = false;
    }
    document.getElementById("bankAccountNumber").disabled = false;
    document.getElementById("bankAccountNumber").required = true;
    document.getElementById("paymentMethod").innerHTML = `Transferencia`;
});

let paymentForm = document.getElementById("checkout");

paymentForm.addEventListener("submit", function(event) {
    validatePayment();
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("checkout").classList.add('was-validated');
    if (paymentForm.checkValidity()) {
        document.getElementById("alert").setAttribute('class', 'alert alert-success alert-dismissible fade show');        
    }
}, false)

document.addEventListener("DOMContentLoaded", function(){
    getJSONData(PRE_LOADED_CART).then(function(resultObj){
        if (resultObj.status === "ok"){

            let cartDataToAppend = ``;

            for (let product of resultObj.data.articles) {

                //cambio el símbolo para la moneda.
                let currencySymbol = "";
                if (product.currency === "UYU") {
                    currencySymbol = "$";
                } else {
                    currencySymbol = "USD";
                }

                //regex para precio separado por decimales.
                let separatedPrice = product.unitCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

                //cargo data a la variable

                cartDataToAppend += `<tr id="${product.id}">
                    <td><img src="${product.image}" class="img-cart"></td>
                    <td>${product.name}</td>
                    <td id="cost-count-${product.id}">${currencySymbol} ${separatedPrice}</td>
                    <td><input id="count-${product.id}" class="cart-count" type="number" min="1" value="${product.count}"></td>
                    <td id="subtotal-count-${product.id}" class="item-subtotal">${currencySymbol} ${product.unitCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                </tr>
                `;
            }
            
            //Lo sumo al DOM con innerHTML
            document.getElementById("cartTableBody").innerHTML = cartDataToAppend;
           
            //Obtengo todos los inputs y les cargo evento para cuando cambia el número
            let arrayInputs = document.querySelectorAll(".cart-count");
            for (let inputParticular of arrayInputs) {
                inputParticular.addEventListener("change", function(){
                    if (inputParticular.value < 1) {
                        inputParticular.value = 1;
                    }
                    let arrayStringUnitPrice = document.getElementById("cost-"+inputParticular.id).innerHTML.split(' ');
                    document.getElementById("subtotal-"+inputParticular.id).innerHTML = arrayStringUnitPrice[0] + ' ' +  (arrayStringUnitPrice[1].replace(".","") * inputParticular.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    loadPrices();
                });
            }  
            loadPrices();
        }
    });
});
