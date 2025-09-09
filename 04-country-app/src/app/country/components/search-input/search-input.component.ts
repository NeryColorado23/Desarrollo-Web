import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',


})
export class SearchInputComponent {

  placeholder =  input('Buscar');
  value = output<string>();
}
