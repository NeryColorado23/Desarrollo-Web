import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter-page';
import { HeroPageComponent } from './pages/hero/hero-page';

//aqui puedo utilizar rutas para mostar mis html
export const routes: Routes = [
  {
    //ruta home
    path: '',
    component: CounterPageComponent
  },
  //aqui puedo agregar la ruta de la nueva pagina
  {
    path: 'hero',
    component: HeroPageComponent,
  },

  //si no es ninguna ruta, regresa al directorio home
  {
    path: '**',
    redirectTo: '',
  }
];
