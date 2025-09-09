import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { TopMenuComponent } from "./country/components/top-menu/top-menu.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, TopMenuComponent],
  templateUrl: './app.html',
//  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('country-app');
}
