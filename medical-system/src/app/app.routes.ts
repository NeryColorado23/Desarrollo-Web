import { Routes } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomePageComponent } from '../../../04-country-app/src/app/shared/pages/home-page/home-page.component';
import { LoginPageComponent } from './medical/components/login-page/login-page.component';
import { DashboardPageComponent } from './medical/components/Dashboard-Page/Dashboard-Page.component';

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
    path: '**',
    redirectTo: ''
  }

];
