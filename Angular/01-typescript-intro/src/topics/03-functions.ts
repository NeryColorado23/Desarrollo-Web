//funciones basicas

function AddNumbers(a: number, b: number){
    return a+b;
}

//funcion flecha
const AddNumbersArrow = (a:number, b:number) => {
    return a+b;
}

function multiply (firstNumber: number, secondNumber?: number, base:number = 2){
    return firstNumber * base;

}

//const result:number = AddNumbers(1,2);
//const result2: number = AddNumbers(2,2);
//const result3: number = multiply(5);
//console.log({result});
//console.log({result2});
//console.log({result3});

//-------------------------

interface character {
    name: string,
    hp:number,
    showHP: () => void 
}

const healCharacter =  (character, amount) => {
    character.hp += amount;
}

const strider: Character = {
    name: 'Strider',
    hp:50,
    showHP(){
        console.log(`Puntos de vida ${this.hp}`);
    }
}

healCharacter(strider, 10);
healCharacter(strider, 10);
strider.showHP();

export{};