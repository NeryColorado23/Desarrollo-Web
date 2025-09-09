import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from "./components/pages/footer-page/footer-page.component";
import { HeaderPageComponent } from "./components/pages/header-page/header-page.component";

@Component({
  selector: 'app-root',
  imports: [FooterPageComponent, HeaderPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema-medico');
}
