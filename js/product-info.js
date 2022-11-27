//Armamos las URLs de las APIS de producto y comentarios.
const SPECIFIC_PRODUCT_INFO_URL = PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE;
const SPECIFIC_PRODUCT_INFO_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE;

const COMMENT = document.getElementById("comment-description");
const RATING = document.getElementById("comment-score");
const FORM = document.getElementById("comment-form");

let commentsStorage;
let idObject = "id"+localStorage.getItem("prodID");
if (localStorage.getItem("comments") != null) {
    commentsStorage = JSON.parse(localStorage.getItem("comments"));
} else {
    commentsStorage = [];
}



function redirectToProductID(id){
    localStorage.setItem("prodID", id);
    window.location.href = "product-info.html";
}

function loadComments(obj, isItLoading){
    //Empiezo a cargar info a variable.
    let commentDataToAppend = ``;

    if (isItLoading) {
        //Creo condición por si hay o no hay comentarios.
        if (obj.length === 0 && commentsStorage[idObject] === undefined) {
            commentDataToAppend += `<div class="comment-box">
            <p class="text-center">No hay comentarios aún</p>
            </div>`;
        } else {

            //For para cargar cada comentario.
            for (let comment of obj) {
                commentDataToAppend += `<div class="comment-box">
                    <p><strong>${comment.user}</strong> - ${comment.dateTime} - `;

                //For para cargar estrellas
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
    } else {
        commentDataToAppend += `<div class="comment-box">
                <p><strong>${obj.user}</strong> - ${obj.dateTime} - `;

            //For para cargar estrellas
            for (let contador = 1; contador <= 5; contador++){
                if (contador <= obj.score) {
                    commentDataToAppend += `<span class="fa fa-star checked"></span>`;
                } else {
                    commentDataToAppend += `<span class="fa fa-star"></span>`;
                }
            }
            
            commentDataToAppend += `</p>
            <p>${obj.description}</p>
                </div>
            `;
        document.getElementById('comments-load').innerHTML += commentDataToAppend;
    }

   
       

}

function saveComment() {
    
    let infoUser = JSON.parse(localStorage.getItem("usuario"));
    var currentdate = new Date();

    if (commentsStorage[idObject] === undefined) {

        let comment = {
            product: localStorage.getItem("prodID"),
            score: RATING.value,
            description: COMMENT.value,
            user: infoUser.email,
            dateTime: currentdate.getFullYear()+"-"+currentdate.getMonth()+"-"+ currentdate.getDay()+" "+currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds()
        };

        commentsStorage = {
            ...commentsStorage,
            [idObject]: {
                comment1: comment
            }
        };
        loadComments(comment,false);
    } else {

        let idCommentNumber = Object.keys(commentsStorage[idObject]).length+1;
        let idComment = 'comment'+idCommentNumber;
        let comment = {
            product: localStorage.getItem("prodID"),
            score: RATING.value,
            description: COMMENT.value,
            user: infoUser.email,
            dateTime: currentdate.getFullYear()+"-"+currentdate.getMonth()+"-"+ currentdate.getDay()+" "+currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds()
        };

        commentsStorage[idObject] = {
            ...commentsStorage[idObject],
            [idComment]: comment
        }
        loadComments(comment,false);
    }
    alert('Comentario guardado');
    localStorage.setItem("comments", JSON.stringify(commentsStorage));
    RATING.value = 1;
    COMMENT.value = '';
}

FORM.addEventListener('submit', (event) =>{
    event.preventDefault();
    event.stopPropagation();
    if(COMMENT.value.length != 0){
        saveComment();
    }else{
        alert("El comentario está vacío");
    }
});


document.addEventListener("DOMContentLoaded", function(){

    //Fetch con getJSONData para la info del producto.
    getJSONData(SPECIFIC_PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){

            //cambio el símbolo para la moneda.
            let currencySymbol = "";
            if (resultObj.data.currency === "UYU") {
                currencySymbol = "$";
            } else {
                currencySymbol = "USD";
            }

            //regex para precio separado por decimales.
            let separatedPrice = resultObj.data.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            //Empiezo a cargar info en variable.
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

            //For para cargar fotos.
            for(foto of resultObj.data.images){
                productDataToAppend += `<div class="images-column">
                    <img src="${foto}" class="img-fluid">
                </div>
            `;
            }
            productDataToAppend += "</div>";

            //Cargo información al DOM.
            document.getElementById('product-load').innerHTML = productDataToAppend;

            //Comienzo a crear sección de relacionados
            let relatedAppend = `<h2 class="py-4">Productos relacionados</h2>
            <div class="row row-cols-1 row-cols-2">
                <div class="card-group">`;

            //Un For para cada artículo en el array de relacionados
            for (relacionado of resultObj.data.relatedProducts) {
                relatedAppend += `<div class="col mb-4">
                    <div class="card cursor-active" id="related${relacionado.id}" onClick='redirectToProductID(${relacionado.id})'>
                        <img src="${relacionado.image}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${relacionado.name}</p>
                        </div>
                    </div>
                </div>
                `;
            }
            relatedAppend += `</div>
            </div>`;

            //Cargo info al DOM
            document.getElementById('related-products-load').innerHTML = relatedAppend;
        }
    });

    //Cargo info al localStorage si es que no la hay ya

    //Fetch para info de comentarios.
    getJSONData(SPECIFIC_PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){

            loadComments(resultObj.data, true);
            console.log(Object.entries(commentsStorage[idObject]));
            for (const objeto of Object.entries(commentsStorage[idObject])) {
                console.log(objeto[1]);
                loadComments(objeto[1], false);
            }
        }
    });
});