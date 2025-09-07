import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Character } from '../../../interfaces/character';

@Component({
  selector: 'dragonball-character-app',
  templateUrl:'./character-add.html',

})
export class CharacteAddComponent {
name = signal('');
power = signal(0);


addCharacter() {
if(!this.name()|| !this.power() || this.power() <= 0){
      return;
    }
    const newCharacter: Character={
      id: 10000,
      name: this.name(),
      power: this.power()
    };

console.log({newCharacter});
this.resetFields()
}

resetFields(){
  this.name.set('');
  this.power.set(0);
}

}


