import { DatePipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-basic-page',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './basic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BasicPageComponent {
  namelower = signal('nery')
  nameUpper = signal('COLORADO')
  fullname = signal('NEry ColoRADO');

  customDate = signal(new Date());

  tckingDateEffect = effect((onCleanUp) => {
    const interval = setInterval(() => {
      this.customDate.set(new Date())
      console.log('tick')
    }, 1000);

    onCleanUp((() => {
      clearInterval(interval)
    }))
  })
}
