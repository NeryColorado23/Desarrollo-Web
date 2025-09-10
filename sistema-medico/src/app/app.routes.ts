import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pages/testboton/boton-page/boton-page.component').then(m => m.BotonPageComponent)
  },
  {
    path: 'registro-paciente',
    loadComponent: () => import('./components/pages/page-form-paciente/page-form-paciente.component').then(m => m.PageFormPacienteComponent)
  },
  {
    path: 'registro-cita',
    loadComponent: () => import('./components/pages/pager-form-citas/registro-cita.component').then(m => m.RegistroCitaComponent)
  },
  {
    path: 'info-doctores',
    loadComponent: () => import('./components/pages/page-form-doctores/info-doctores.component').then(m => m.InfoDoctoresComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
