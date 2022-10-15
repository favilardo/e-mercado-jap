const PRE_LOADED_CART = CART_INFO_URL + "25801" + EXT_TYPE;

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');
  
    if (indexOfSpace === -1) {
      return '';
    }
  
    return str.substring(indexOfSpace + 1);
  }

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
                    <td id="subtotal-count-${product.id}">${currencySymbol} ${product.unitCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                </tr>
                `;
            }
            
            //Lo sumo al DOM con innerHTML
            document.getElementById("cartTableBody").innerHTML = cartDataToAppend;
           
            //Obtengo todos los inputs y les cargo evento para cuando cambia el número
            let arrayInputs = document.querySelectorAll("input");
            for (let inputParticular of arrayInputs) {
                inputParticular.addEventListener("change", function(){
                    let arrayStringUnitPrice = document.getElementById("cost-"+inputParticular.id).innerHTML.split(' ');
                    document.getElementById("subtotal-"+inputParticular.id).innerHTML = arrayStringUnitPrice[0] + ' ' +  (arrayStringUnitPrice[1].replace(".","") * inputParticular.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                });
            }  
        }
    });
});
