import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar';
import { Component} from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  //styleUrl: './app.css'
})
export class App {
    title: string = 'bases';
}
