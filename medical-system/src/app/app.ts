import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderNavComponent } from "./shared/components/header-nav/header-nav.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('medical-system');
}
