import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

import localES from '@angular/common/locales/es-GT';
import localFr from '@angular/common/locales/Fr';
import { LocalService } from './services/locale.service';

registerLocaleData(localES, 'es')
registerLocaleData(localFr, 'fr')

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide:LOCALE_ID,
      //useValue: 'fr'
      deps: [LocalService],
      useFactory: (LocalService: LocalService) => LocalService.getLocale,
    }
  ],
};
