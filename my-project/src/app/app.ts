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
  nombre: String = 'Parker'
  precio: number = 6;
  imagensnoopy: string = 'https://cdn.britannica.com/08/198008-050-46AA11CD/film-still-Boy-Named-Charlie-Brown-1969.jpg'; 

  //funciones
  getFecha(): String{
    return new Date().toString();
  }
}
