import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { FormularioSubscripcion } from "./pages/formulario-subscripcion/formulario-subscripcion";
import { Testimonial } from "./pages/testimonial/testimonial";

@Component({
  selector: 'app-root',
  imports: [Header, Footer, FormularioSubscripcion, Testimonial], 
  templateUrl: './app.html',
})
export class App {
  //protected readonly title = signal('prueba');
  title: String = 'PAGINA MAMALONA';
  nombre: String = 'Parker'
  precio: number = 6;
  imagensnoopy: string = 'https://cdn.britannica.com/08/198008-050-46AA11CD/film-still-Boy-Named-Charlie-Brown-1969.jpg'; 

  //funciones
  getFecha(): String{
    return new Date().toString();
  }
}
