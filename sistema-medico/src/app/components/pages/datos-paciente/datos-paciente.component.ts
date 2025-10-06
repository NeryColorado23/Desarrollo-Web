import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { PacienteService, Paciente } from '../../../services/paciente.service';
import { HistorialMedicoService, RegistroMedico } from '../../../services/historial-medico.service';

@Component({
  selector: 'app-datos-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './datos-paciente.component.html',
  styleUrls: ['./datos-paciente.component.scss']
})
export class DatosPacienteComponent implements OnInit {
  pacienteControl = new FormControl('');
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  historialMedico: RegistroMedico[] = [];

  constructor(
    private pacienteService: PacienteService,
    private historialService: HistorialMedicoService
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacientes = this.pacienteService.getPacientes();
  }

  onPacienteChange(event: any): void {
    const nombreCompleto = event.value;
    const paciente = this.pacienteService.getPacientePorNombre(nombreCompleto);

    this.pacienteSeleccionado = paciente || null;

    if (this.pacienteSeleccionado) {
      this.historialMedico = this.historialService.getRegistrosPorPaciente(this.pacienteSeleccionado.id);
    } else {
      this.historialMedico = [];
    }
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  calcularIMC(peso?: number, altura?: number): string {
    if (!peso || !altura) return 'N/A';
    const imc = peso / Math.pow(altura / 100, 2);
    return imc.toFixed(1);
  }

  obtenerCategoriaIMC(peso?: number, altura?: number): string {
    if (!peso || !altura) return '';
    const imc = peso / Math.pow(altura / 100, 2);

    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  limpiarSeleccion(): void {
    this.pacienteControl.setValue('');
    this.pacienteSeleccionado = null;
    this.historialMedico = [];
  }

  exportarHistorial(): void {
    if (!this.pacienteSeleccionado) return;

    // Aquí puedes implementar la lógica para exportar a PDF o imprimir
    window.print();
  }
}
