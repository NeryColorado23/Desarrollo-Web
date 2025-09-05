//componente o archivo .component
import { Component } from "@angular/core";

//cree un componente
@Component({
  template: `
  <h1>Counter {{counter}}</h1>
  <button (click)="increaseBy(1)">+1</button>
  <h2>Counter Component Page</h2>
  `
})

export class CounterPageComponent{
 counter = 15;

 //cree metodo
 increaseBy(value: number){
  //uso this para hacer referencia a la propiedad counter
  this.counter = this.counter + value;
 }
}
