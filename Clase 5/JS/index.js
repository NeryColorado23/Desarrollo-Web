let parrafo = document.getElementById("parrafo");
console.log(parrafo)

parrafo.style.color="white";
console.log(parrafo)

//cambiar por etiqueta h1
let parrafos = document.getElementsByTagName("p")
console.log(parrafos)

//cambio de parrafos por uno o por ciclos
//parrafos[0].style.fontSize="50px";

for(let i = 0; i < parrafos.length; i++){
    parrafos[i].style.background="red";
}

//cambiar por clase h1
let contenido = document.getElementsByClassName("contenido");
console.log(contenido)
for(let i = 0; i < contenido.length; i++){
    contenido[i].style.background="green";
}

//cambio del primer elememto de p o dependiendo del selector que se desee

//cambio por etiqueta, solo hace el primero
//let otroparrafo = document.querySelector("div p");
//otroparrafo.style.display="none";

//cambio por id
//let otroparrafo = document.querySelector("#parrafo");
//otroparrafo.style.display="none";

//cambio por etiqueta, hace todos los que coincidan con todos las etiquetas
let otrosparrafos = document.querySelectorAll("div p");
for(let i = 0; i < otrosparrafos.length; i++){
    otrosparrafos[i].style.background="green";
}


//cambiar cosas de div p la primer linea
let otroparrafo = document.querySelector("div p");
otroparrafo.innerText="Cambio de texto";

//otroparrafo.innerHTML="<h1> innerhtml</h1>";
otroparrafo.outerHTML="<h1> outerHTML</h1>";

//lo mismo
//let texto = otroparrafo.innerText;
//let texto = otroparrafo.textContent;

//console.log(texto);


//generar eventos
let boton_eliminar = document.getElementById("eliminar");
boton_eliminar.addEventListener("click", function() { 
    //console.log("FUNCIONA EVENTO BUTTON");
    
    //let div = document.querySelector("div");
    //div.style.display="none";

    //interactuar con clases desde css aqui en js (en este caso borra div)
    //let div = document.querySelector("div");
    //div.classList.add("eliminar");

    //interactuar con clases desde css aqui en js (en este caso borra div pero aparece si se presiona otra vez)
    let div = document.querySelector("div");
    div.classList.toggle("eliminar");


});