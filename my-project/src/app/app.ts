import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [], //borrar lo de llave
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //protected readonly title = signal('prueba');
  title = 'Nery Colorado';
  nombre = 'Parker'
  precio = 5;
}
