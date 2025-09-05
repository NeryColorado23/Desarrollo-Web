/*
    ===== Código de TypeScript =====
*/

//---crear interface
interface SuperHero{
    name: string;
    age: number;
    address: Address; //llame a la interface address de abajo
    showAddress: () => string; 
}
interface Address{
        street: string;
        country: string;
        city: string;
}

//--


const superHeroe: SuperHero = {
    name: 'Spiderman',
    age: 30,
    address: {
        street: 'Main St',
        country: 'USA',
        city: 'NY'
    },
    showAddress() {
        return this.name + ', ' + this.address.city + ', ' + this.address.country;
    }
}


const address = superHeroe.showAddress();
console.log( address );




export {};