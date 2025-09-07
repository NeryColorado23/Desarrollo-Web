import { Component, signal } from '@angular/core';
import { CharacterListComponent } from "../../components/dragonball/character-list/character-list";
import { CharacteAddComponent } from "../../components/dragonball/character-add/character-add";

interface Character{
  id: number;
  name: string;
  power: number;
}

@Component({
  templateUrl: './dragonball-super-page.html',
  selector: 'dragonball-super',
  imports: [CharacterListComponent, CharacteAddComponent]
})

//creacion de señal

export class DragonballSuperPageComponent{

  name = signal('');
  power = signal(0);


  characters = signal<Character[]>([
    {id: 1, name: 'Goku', power: 9001},
    {id: 2, name: 'Vegeta', power: 8000},
  ]);

  addCharacter(character: Character) {
    this.characters.update(
      list => [...list, character]
    )

}

resetFields(){
  this.name.set('');
  this.power.set(0);
}


}
