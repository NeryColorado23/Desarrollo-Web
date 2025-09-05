export interface Passenger{
    name: string;
    children?: string[];
}

const passenger1: Passenger = {
    name: 'Nery',
}
const passenger2: Passenger = {
    name: 'Pedro',
    children: ['Natalia', 'Jose']
}

const printChildren = (passenger: Passenger) => {
    const howManyChildren = passenger.children?.length || 0;
    console.log(passenger.name, howManyChildren);
}

printChildren(passenger2);
printChildren(passenger1);