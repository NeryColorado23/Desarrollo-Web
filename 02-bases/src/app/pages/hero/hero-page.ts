import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './hero-page.html',
  imports: [UpperCasePipe]

})

export class HeroPageComponent {

  name = signal('Iron Man');
  age = signal(45);

  //señales de computadoras
  heroDescription = computed(()=> {
    const description = `${this.name()} - ${this.age()}`;
    return description;
  })

  capitalizedName = computed(() => this.name().toUpperCase())

  getHeroDescription(){
    return `${this.name()} - ${this.age()}`;
  }
  changeHero(){
    this.name.set('Spiderman');
    this.age.set(22);

  }
  resetForm(){
    this.name.set('IronMan');
    this.age.set(45);
  }
  changeAge() {
    this.age.set(60);
  }

}
