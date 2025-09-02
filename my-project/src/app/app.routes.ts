import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FormularioSubscripcion } from './pages/formulario-subscripcion/formulario-subscripcion';
import { Testimonial } from './pages/testimonial/testimonial';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Página inicial
  { path: 'dashboard', component: DashboardComponent },
  { path: 'subscripcion', component: FormularioSubscripcion },
  { path: 'testimoniales', component: Testimonial }
];
