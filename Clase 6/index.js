/*
//console.log("hola mundo");
//console.log(process);

const {dpiValido, esMayor} = require('./modulos.js');

dpiValido("1227777777777");
console.log("Sergio es mayor ", esMayor(23));

*/

//nueva forma cambiando el packaje json de type modulo
import { dpiValido, esMayor, getUsuario, getUsuariodos } from "./modulos.js";

dpiValido("122777777777");
console.log("Sergio es mayor ", esMayor(23));


//EXISTES EXTENSIONES .mjs y .cjs


//get usuario
console.log("Inicion consulta");
//enviamos funcion por parametro callback de modulos.js aque esta tipo flecha
getUsuario("Henry", (mensaje) => {console.log(mensaje)});
console.log("fin consulta");



//funcion promesa de modulos.js aqui en index
//get usuario
console.log("Inicion consulta");
//enviamos funcion por parametro callback de modulos.js aque esta tipo flecha
getUsuariodos("Juan").then((resultado) => {
    console.log(resultado)
}) .catch((err) => {
    console.log("Error", err)
})

console.log("fin consulta");

//constante facil usando usuario dos, solo funciona asincrona
const nery = await getUsuariodos("nery");
console.log(nery);