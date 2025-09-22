import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/pages/page-central/page-central.component').then(m => m.PageCentralComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'registro-paciente',
    loadComponent: () => import('./components/pages/page-form-paciente/page-form-paciente.component').then(m => m.PageFormPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'registro-cita',
    loadComponent: () => import('./components/pages/pager-form-citas/registro-cita.component').then(m => m.RegistroCitaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'info-doctores',
    loadComponent: () => import('./components/pages/page-form-doctores/info-doctores.component').then(m => m.InfoDoctoresComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes',
    loadComponent: () => import('./components/pages/page-reports/page-reports.component').then(m => m.PageReportsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'calendar',
    loadComponent: () => import('./components/pages/page-calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
