import { Component } from '@angular/core';

@Component({
  selector: 'app-header',   //  este nombre es el que usas en el HTML
  standalone: true,         //  muy importante
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class HeaderComponent {
  userName: String = 'Nery'; // Valor que se mostrará en la vista  
}
export class AppComponent {

}