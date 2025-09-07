import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character';

@Component({
  selector: 'dragonball-character-add',
  templateUrl:'./character-add.html',

})
export class CharacteAddComponent {
name = signal('');
power = signal(0);

newCharacter = output<Character>();


addCharacter() {
if(!this.name()|| !this.power() || this.power() <= 0){
      return;
    }
    const newCharacter: Character={
      id: Math.floor(Math.random() * 1000),
      name: this.name(),
      power: this.power()
    };

this.newCharacter.emit(newCharacter);
this.resetFields()
}

resetFields(){
  this.name.set('');
  this.power.set(0);
}

}


