import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
        {
      provide: DateAdapter,
      useClass: LuxonDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'dd/MM/yyyy',
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'LLLL yyyy',
        }
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ]
};
