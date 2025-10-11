import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    //llame ruta de mi store front que tiene su propio archivo de ruta
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  }
];
