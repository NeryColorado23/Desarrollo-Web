interface AudioPlayer{
    audioVolume: number;
    songDuration: number;
    song: string;
    details: Details;
}

interface Details{
    author: string;
    year: number;
}

const audioPlayer: AudioPlayer = {
    audioVolume: 90,
    songDuration: 3,
    song: "Waka",
    details: {
        author: 'Yo',
        year: 2022
    }
}
const song = 'New Song';

//const {song:anotherSong,songDuration:duration } = audioPlayer;
//const {author} = details;


const[p1,p2,trunks]: string[] = ['goku', 'vegeta', 'trunks'];
console.log('Personaje 3 ', trunks); 


export{};