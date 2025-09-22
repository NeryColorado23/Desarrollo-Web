import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { MenuService } from '../../../../services/menu.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-boton-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    MatIconModule
],
  templateUrl: './boton-page.component.html',
  styleUrls: ['./boton-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonPageComponent implements OnInit, OnDestroy {
  botones = [
    { label: 'Home', link: '/home' },
    { label: 'Registro', link: '/registro-paciente' },
    { label: 'Citas', link: '/registro-cita' },
    { label: 'Doctores', link: '/info-doctores' },
    { label: 'Reportes', link: '/reportes' },
  ];

  seleccionado: string | null = null;
  mostrarMenu = false;
  isAuthenticated = false;

  private menuSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Suscribirse al estado del menú
    this.menuSubscription = this.menuService.menuVisible$.subscribe(visible => {
      this.mostrarMenu = visible;
      this.cdr.markForCheck();
    });

    // Suscribirse al estado de autenticación
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      // Si no está autenticado, cerrar el menú
      if (!isAuth) {
        this.mostrarMenu = false;
        this.menuService.closeMenu();
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  seleccionar(btn: { label: string; link: string }) {
    if (this.isAuthenticated) {
      this.seleccionado = btn.label;
      // Cerrar el menú después de seleccionar
      setTimeout(() => {
        this.menuService.closeMenu();
      }, 300);
    }
  }

  cerrarMenu() {
    if (this.isAuthenticated) {
      this.menuService.closeMenu();
    }
  }
}
