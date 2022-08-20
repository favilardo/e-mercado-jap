//Armamos la URL de la categoria deseada
const SPECIFIC_PRODUCTS_URL = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

//Siguiendo logica de Products.js iniciamos un array vacio donde luego guardaremos el array con todos los productos, y dejamos filtros indefinidos
let currentProductsArray = [];
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//En mismo plan, preparamos la informacion para pasarle el id del producto a la pagina product-info.html mediante localStorage
function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

//Tambien, preparamos mismos filtros
function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

//Mostramos los productos siguiendo estilo y logica de Products
function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        //Paso extra respecto a Products.js ya que el objeto obtenido tiene otra info, por lo que el array esta en la propiedad ".products" del objeto
        let product = currentProductsArray[i];
        
        //Definimos el simbolo de moneda a mostrar
        let currencySymbol = "";
        if (product.currency === "UYU") {
            currencySymbol = "$";
        } else {
            currencySymbol = "USD";
        }

        //separamos los miles con puntos usando expresiones regulares
        let separatedPrice = product.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.soldCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.soldCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${currencySymbol} ${separatedPrice}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductsList();
}

//Obtenemos el JSON mediante la funcion getJSONData de init.js y declaramos eventos para el filtro en productos
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(SPECIFIC_PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products;
            console.log(resultObj.data);

            //Mostramos el nombre de la categoria
            let catTitle = document.getElementById("cat-title");
            catTitle.innerHTML += resultObj.data.catName;

            //mostramos listado
            showProductsList();
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList();
    });

});