import { effect, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character';


//leer de local storage
const LoadFromLocalStorage = (): Character[] => {
  const characters = localStorage.getItem('characters');
  return characters ? JSON.parse(characters): []
}

@Injectable({providedIn: 'root'})
export class DragonballService {
      characters = signal<Character[]>(LoadFromLocalStorage());

  //efectos y local storage
  saveToLocalStorage = effect(() => {
    //console.log(`Character count ${this.characters().length}`)
    localStorage.setItem('characters', JSON.stringify(this.characters()))

  })

  addCharacter(character: Character) {
    this.characters.update(
      list => [...list, character]
    )
 }

}
