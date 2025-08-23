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

//usamos callback para que ejecute la funcion ya procesada. si solo usamos return despliega undefined
//callback es una funcion que se recibe por parametro y ejecutara cuando tenga los datos disponibles
//osea funcion dentro de otra funcion
export function getUsuario(usuario, callback){
    setTimeout(() => {
        callback({usuario}); 
    }, 100);

}


//funcion promesa, usando tipo flecha
export function getUsuariodos(usuario, callback){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        reject("Timeout")    
        resolve({usuario}); 
    }, 100);
    })
}
