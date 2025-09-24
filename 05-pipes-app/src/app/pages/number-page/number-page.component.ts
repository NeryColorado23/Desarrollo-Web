import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-number-page',
  imports: [],
  templateUrl: './number-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NumberPageComponent { }
