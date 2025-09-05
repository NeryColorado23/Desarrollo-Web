//componente o archivo .component
import { Component, signal } from "@angular/core";

//cree un componente
@Component({
  templateUrl: './counter-page.html',

  styles:
  `button{
    padding: 5px;
    margin: 5px 10px;
    width: 75px;
  }
  `
})

export class CounterPageComponent{
 counter = 15;

//señales
counterSignal = signal(10);

 //cree metodo
 increaseBy(value: number){
  //uso this para hacer referencia a la propiedad counter
  this.counter = this.counter + value;
  this.counterSignal.update(current => current + value)
 }
 resetCounter(){
  this.counter = 0;
  this.counterSignal.set(0);
 }

}
