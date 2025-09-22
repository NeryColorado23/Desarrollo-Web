import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../services/menu.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderPageComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    if (this.isAuthenticated) {
      this.menuService.toggleMenu();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
