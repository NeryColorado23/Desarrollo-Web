import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [ɵEmptyOutletComponent],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  title = input.required()
}
