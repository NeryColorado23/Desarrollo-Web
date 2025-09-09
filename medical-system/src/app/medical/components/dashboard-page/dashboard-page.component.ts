import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent { }
