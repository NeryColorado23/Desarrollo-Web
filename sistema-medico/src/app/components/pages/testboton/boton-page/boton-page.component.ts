import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { MenuService } from '../../../../services/menu.service';
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
    { label: 'Home', link: '' },
    { label: 'Registro', link: '/registro-paciente' },
    { label: 'Citas', link: '/registro-cita' },
    { label: 'Doctores', link: '/info-doctores' },
    { label: 'Reportes', link: '/reportes' },
  ];

  seleccionado: string | null = null;
  mostrarMenu = false;
  private subscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.menuService.menuVisible$.subscribe(visible => {
      this.mostrarMenu = visible;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  seleccionar(btn: { label: string; link: string }) {
    this.seleccionado = btn.label;
    // Cerrar el menú después de seleccionar
    setTimeout(() => {
      this.menuService.closeMenu();
    }, 300);
  }

  cerrarMenu() {
    this.menuService.closeMenu();
  }
}
