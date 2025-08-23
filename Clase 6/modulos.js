/*
//funcion para validar dpi
//comparar string y numero con dos "1"== 1
//=== compara valor con tipo de dato "1"===1 
function dpiValido(dpi){
   if(dpi.lengt ===13 ){
    console.log(dpi, 'Valido')
   }else{
    console.log(dpi,'invalido')
   }
}

//dpiValido("123");
//dpiValido("111111111111");


function esMayor(edad){
    return(edad >= 18)
    }


//para poder llamar varias funciones, esta es la version de antes clasica 
module.exports = {dpiValido, esMayor};


*/


//nueva version cambiando type en package json module
export function dpiValido(dpi){
   if(dpi.lengt ===13 ){
    console.log(dpi, 'Valido')
   }else{
    console.log(dpi,'invalido')
   }
}

//dpiValido("123");
//dpiValido("111111111111");


export function esMayor(edad){
    return(edad >= 18)
    }


