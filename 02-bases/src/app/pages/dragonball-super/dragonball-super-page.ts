import { Component, inject } from '@angular/core';
import { CharacterListComponent } from "../../components/dragonball/character-list/character-list";
import { CharacteAddComponent } from "../../components/dragonball/character-add/character-add";
import { DragonballService } from '../../services/dragonball.service';



@Component({
  templateUrl: './dragonball-super-page.html',
  selector: 'dragonball-super',
  imports: [CharacterListComponent, CharacteAddComponent]
})

//creacion de señal

export class DragonballSuperPageComponent{
  //inyectar servicion dragonball
  public dragonballServie = inject(DragonballService)


}
