import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { FormularioSubscripcion } from "./pages/formulario-subscripcion/formulario-subscripcion";
import { Testimonial } from "./pages/testimonial/testimonial";

@Component({
  selector: 'app-root',
  standalone: true, // ⚡ OBLIGATORIO en Angular 20 si el componente es standalone
  imports: [
    CommonModule,      // ⚡ Necesario para *ngIf, *ngFor, etc.
    RouterOutlet, 
    Header, 
    Footer, 
    FormularioSubscripcion, 
    Testimonial
  ], 
  templateUrl: './app.html',
})
export class App {
  title: string = 'PAGINA MAMALONA';
  nombre: string = 'Parker';
  precio: number = 6;
  imagensnoopy: string = 'https://cdn.britannica.com/08/198008-050-46AA11CD/film-still-Boy-Named-Charlie-Brown-1969.jpg'; 

  getFecha(): string {
    return new Date().toString();
  }
}
