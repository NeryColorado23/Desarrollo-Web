let skills: string[] = ['Bash', 'Counter', 'Healing'];


interface Character {
    name: string,
    hp: number,
    skills: string[],
    hometown?: string

}

const strider = {
    name: 'Strider',
    hp: 100,
    skills: ['Bash', 'Counter']
}

strider.name = 'Nery';
console.table(strider);

export{};
