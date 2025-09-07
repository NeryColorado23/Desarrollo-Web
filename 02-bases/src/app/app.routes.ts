import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter-page';
import { HeroPageComponent } from './pages/hero/hero-page';
import { DragonballPageComponent } from './pages/dragonball/dragonball-page';
import {DragonballSuperPageComponent} from './pages/dragonball-super/dragonball-super-page'

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
  {
    path: 'dragonball',
    component: DragonballPageComponent
  },
  {
    path: 'dragonball-super',
    component: DragonballSuperPageComponent
  },
  //si no es ninguna ruta, regresa al directorio home
  {
    path: '**',
    redirectTo: '',
  }
];
