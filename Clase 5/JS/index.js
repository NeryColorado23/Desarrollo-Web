let parrafo = document.getElementById("parrafo");
console.log(parrafo)

parrafo.style.color="blue";
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

//texto

