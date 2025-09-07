import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import type { Character } from '../../../interfaces/character';

@Component({
  selector: 'dragonball-character-list',
  templateUrl: './character-list.html',
})

export class CharacterListComponent {
  characters = input.required<Character[]>();
  listname = input.required<string>();
}
