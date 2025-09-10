import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuVisible = new BehaviorSubject<boolean>(false);
  menuVisible$ = this.menuVisible.asObservable();

  toggleMenu() {
    this.menuVisible.next(!this.menuVisible.value);
  }

  closeMenu() {
    this.menuVisible.next(false);
  }
}
