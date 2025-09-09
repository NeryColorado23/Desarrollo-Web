import { Routes } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomePageComponent } from '../../../04-country-app/src/app/shared/pages/home-page/home-page.component';
import { DashboardPageComponent } from './medical/components/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component:  DashboardPageComponent,
  },

];
