import { Routes } from '@angular/router';
import { LoginPageComponent } from './medical/components/login-page/login-page.component';
import { DashboardPageComponent } from './medical/components/Dashboard-Page/Dashboard-Page.component';
import { CitasPageComponent } from './medical/components/citas-page/citas-page.component';
import { DoctoresPageComponent } from './medical/components/doctores-page/doctores-page.component';
import { InicioPageComponent } from './medical/components/inicio-page/inicio-page.component';
import { PacientePageComponent } from './medical/components/paciente-page/paciente-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component:  LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'citas',
    component: CitasPageComponent,
  },
  {
    path: 'doctores',
    component: DoctoresPageComponent,
  },
  {
    path: 'inicio',
    component: InicioPageComponent,
  },
  {
    path: 'paciente',
    component: PacientePageComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }

];
