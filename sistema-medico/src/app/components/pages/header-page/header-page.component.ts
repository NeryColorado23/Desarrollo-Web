import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [],
  templateUrl: './header-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderPageComponent {
  constructor(private menuService: MenuService) {}

  toggleMenu() {
    this.menuService.toggleMenu();
  }
}
