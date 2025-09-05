import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter-page';

//aqui puedo utilizar rutas para mostar mis html
export const routes: Routes = [
  {
    path: '',
    component: CounterPageComponent
  }
];
