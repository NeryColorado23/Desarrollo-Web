import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-boton-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './boton-page.component.html',
  styleUrls: ['./boton-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonPageComponent {
  botones = [
    { label: 'Registro', link: '/registro-paciente' },
    { label: 'Citas', link: '/registro-cita' },
    { label: 'Doctores', link: '/info-doctores' },
    { label: 'Gestion', link: '/otra-vista' },
  ];

  seleccionado: string | null = null;

  seleccionar(btn: { label: string; link: string }) {
    this.seleccionado = btn.label;
  }
}
