//una funcion no es mas que un simple decorador 
function classDecorador <T extends {new (...args:any[]): {}}>(constructor:T){
    return class extends constructor{
        newProperty = 'New Property';
        hello = 'override';
    }
}

@classDecorador

export class SuperClass {
    public myProperty: string = 'Abc123';
    print(){
        console.log('Hola Mundo')
    }
    
}

console.log(SuperClass);

const myClass = new SuperClass();
console.log(myClass);