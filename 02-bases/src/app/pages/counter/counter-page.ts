//componente o archivo .component
import { Component } from "@angular/core";

//cree un componente
@Component({
  templateUrl: './counter-page.html',

  styles:
  `button{
    padding: 5px;
    margin: 5px 10px;
    with: 75px;
  }
  `
})

export class CounterPageComponent{
 counter = 15;

 //cree metodo
 increaseBy(value: number){
  //uso this para hacer referencia a la propiedad counter
  this.counter = this.counter + value;
 }
 resetCounter(){
  this.counter = 10;
 }

}
