import { DatePipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { AvailableLocale, LocalService } from '../../services/locale.service';

@Component({
  selector: 'app-basic-page',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './basic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BasicPageComponent {
  localeService = inject(LocalService)
  currentLocale = signal(inject(LOCALE_ID))

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

  changeLocale(locale: AvailableLocale){
    console.log({locale})
    this.localeService.changeLocale(locale)
  }
}
