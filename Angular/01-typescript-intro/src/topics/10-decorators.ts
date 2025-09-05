//una funcion no es mas que un simple decorador 

export class SuperClass {

    public myProperty: string = 'Abc123';
    print(){
        console.log('Hola Mundo')
    }
    
}

console.log(SuperClass);

const myClass = new SuperClass();
console.log(myClass);