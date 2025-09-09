import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./gifs/pages/footer/footer.component";
import { HeaderNavComponent } from "./gifs/pages/header-nav/header-nav.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gifs-app';
}
