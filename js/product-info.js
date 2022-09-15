//Armamos la URL de la categoria deseada con la constante de Productos "https://japceibal.github.io/emercado-api/cats_products/", su número guardado en localhost y el ".json" de EXT_TYPE
const SPECIFIC_PRODUCT_INFO_URL = PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE;
const SPECIFIC_PRODUCT_INFO_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE;



document.addEventListener("DOMContentLoaded", function(){
    getJSONData(SPECIFIC_PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            console.log(resultObj.data);

            let currencySymbol = "";
            if (resultObj.data.currency === "UYU") {
                currencySymbol = "$";
            } else {
                currencySymbol = "USD";
            }

            let separatedPrice = resultObj.data.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            let productDataToAppend = `<h1 class="text-left p-4">${resultObj.data.name}</h1>
            <hr>
            <h2>Precio</h2>
            <p>${currencySymbol} ${separatedPrice}</p>
            <h2>Descripción</h2>
            <p>${resultObj.data.description}</p>
            <h2>Categoría</h2>
            <p>${resultObj.data.category}</p>
            <h2>Cantidad de vendidos</h2>
            <p>${resultObj.data.soldCount}</p>
            <h2>Imágenes ilustrativas</h2>
            <div class="images-row">
            `;
            for(foto of resultObj.data.images){
                productDataToAppend += `<div class="images-column">
                    <img src="${foto}" class="img-fluid">
                </div>
            `;
            }
            productDataToAppend += "</div>";

            document.getElementById('product-load').innerHTML = productDataToAppend;

            //mostramos listado
        }
    });
    getJSONData(SPECIFIC_PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            console.log(resultObj.data);

            let commentDataToAppend = `<h2 class="py-4">Comentarios</h2>`;

            if (resultObj.data.length === 0) {
                commentDataToAppend += `<div class="comment-box">
                <p class="text-center">No hay comentarios aún</p>
                </div>`;
            } else {
                for (let comment of resultObj.data) {
                    commentDataToAppend += `<div class="comment-box">
                        <p><strong>${comment.user}</strong> - ${comment.dateTime} - `;
                    for (let contador = 1; contador <= 5; contador++){
                        if (contador <= comment.score) {
                            commentDataToAppend += `<span class="fa fa-star checked"></span>`;
                        } else {
                            commentDataToAppend += `<span class="fa fa-star"></span>`;
                        }
                    }
                    
                    commentDataToAppend += `</p>
                    <p>${comment.description}</p>
                        </div>
                    `;
                }
            }

            document.getElementById('comments-load').innerHTML = commentDataToAppend;
        }
    });
});

//<p class="font-weight-normal text-end my-2">Cant.</p>