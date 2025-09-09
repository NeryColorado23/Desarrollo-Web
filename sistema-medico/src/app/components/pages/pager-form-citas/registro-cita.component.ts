import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

// Importar el servicio - AJUSTA ESTA RUTA SEGÚN TU ESTRUCTURA
import { Paciente, PacienteService } from '../../../services/paciente.service';

export interface Cita {
  id: string;
  pacienteId: string; // ID para referenciar al paciente
  paciente: string;   // Nombre para mostrar
  doctor: string;
  especialidad: string;
  fecha: Date;
  hora: string;
  tipoConsulta: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  motivoConsulta?: string;
  observaciones?: string;
  fechaCreacion: Date;
}

export interface Doctor {
  nombre: string;
  especialidad: string;
  horarios: string[];
}

@Component({
  selector: 'app-registro-cita',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './registro-cita.component.html',
  styleUrls: ['./registro-cita.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroCitaComponent implements OnInit {
  // Formulario y estado del modal
  citaForm!: FormGroup;
  mostrarModal = false;
  mostrarDetalles = false;
  modalTipo: 'crear' | 'editar' = 'crear';
  citaSeleccionada: Cita | null = null;

  // Filtros
  filtro = '';
  filtroEstado = '';

  // Datos
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];

  // Obtener pacientes del servicio
  get pacientes(): string[] {
    return this.pacienteService.getNombresPacientes();
  }

  doctores: Doctor[] = [
    { nombre: 'Dr. Antonio Méndez', especialidad: 'Cardiología', horarios: ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00'] },
    { nombre: 'Dra. Isabel Romero', especialidad: 'Pediatría', horarios: ['08:30', '09:30', '10:30', '11:30', '15:30', '16:30'] },
    { nombre: 'Dr. Miguel Herrera', especialidad: 'Traumatología', horarios: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'] },
    { nombre: 'Dra. Carmen Silva', especialidad: 'Ginecología', horarios: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'] },
    { nombre: 'Dr. Roberto Vega', especialidad: 'Medicina General', horarios: ['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'] }
  ];

  horasDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.cargarCitasEjemplo();
    this.filtrarCitas();

    // Suscribirse a cambios en pacientes
    this.pacienteService.pacientes$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  private initializeForm(): void {
    this.citaForm = this.fb.group({
      paciente: ['', Validators.required],
      doctor: ['', Validators.required],
      especialidad: [''],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      tipoConsulta: ['', Validators.required],
      estado: ['pendiente'],
      motivoConsulta: [''],
      observaciones: ['']
    });
  }

  private cargarCitasEjemplo(): void {
    // Obtener algunos pacientes para las citas de ejemplo
    const pacientesDisponibles = this.pacienteService.getPacientes();

    if (pacientesDisponibles.length > 0) {
      this.citas = [
        {
          id: '1',
          pacienteId: pacientesDisponibles[0].id,
          paciente: pacientesDisponibles[0].nombreCompleto,
          doctor: 'Dr. Antonio Méndez',
          especialidad: 'Cardiología',
          fecha: new Date(2024, 11, 15),
          hora: '09:00',
          tipoConsulta: 'control',
          estado: 'confirmada',
          motivoConsulta: 'Revisión rutinaria de presión arterial',
          observaciones: 'Paciente con historial de hipertensión',
          fechaCreacion: new Date()
        },
        {
          id: '2',
          pacienteId: pacientesDisponibles[1]?.id || '2',
          paciente: pacientesDisponibles[1]?.nombreCompleto || 'Paciente Ejemplo',
          doctor: 'Dra. Isabel Romero',
          especialidad: 'Pediatría',
          fecha: new Date(2024, 11, 16),
          hora: '10:30',
          tipoConsulta: 'primera-vez',
          estado: 'pendiente',
          motivoConsulta: 'Consulta por fiebre y malestar general',
          fechaCreacion: new Date()
        }
      ];
    }
  }

  // Gestión del modal
  abrirModalCita(tipo: 'crear' | 'editar', cita?: Cita): void {
    this.modalTipo = tipo;
    this.mostrarModal = true;

    if (tipo === 'editar' && cita) {
      this.citaSeleccionada = cita;
      this.citaForm.patchValue({
        paciente: cita.paciente,
        doctor: cita.doctor,
        especialidad: cita.especialidad,
        fecha: cita.fecha,
        hora: cita.hora,
        tipoConsulta: cita.tipoConsulta,
        estado: cita.estado,
        motivoConsulta: cita.motivoConsulta,
        observaciones: cita.observaciones
      });
      this.actualizarHorasDisponibles(cita.doctor);
    } else {
      this.citaForm.reset();
      this.citaForm.patchValue({ estado: 'pendiente' });
      this.citaSeleccionada = null;
    }

    this.mostrarDetalles = false;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.citaForm.reset();
    this.citaSeleccionada = null;
    this.cdr.detectChanges();
  }

  // Gestión de detalles
  verDetallesCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.mostrarDetalles = true;
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
    this.citaSeleccionada = null;
    this.cdr.detectChanges();
  }

  // Operaciones CRUD
  guardarCita(): void {
    if (this.citaForm.valid) {
      const formData = this.citaForm.value;
      const pacienteSeleccionado = this.pacienteService.getPacientePorNombre(formData.paciente);

      if (this.modalTipo === 'crear') {
        const nuevaCita: Cita = {
          id: this.generateId(),
          pacienteId: pacienteSeleccionado?.id || '',
          paciente: formData.paciente,
          doctor: formData.doctor,
          especialidad: formData.especialidad,
          fecha: formData.fecha,
          hora: formData.hora,
          tipoConsulta: formData.tipoConsulta,
          estado: formData.estado,
          motivoConsulta: formData.motivoConsulta,
          observaciones: formData.observaciones,
          fechaCreacion: new Date()
        };
        this.citas.push(nuevaCita);
      } else if (this.modalTipo === 'editar' && this.citaSeleccionada) {
        const index = this.citas.findIndex(c => c.id === this.citaSeleccionada!.id);
        if (index !== -1) {
          this.citas[index] = {
            ...this.citaSeleccionada,
            pacienteId: pacienteSeleccionado?.id || this.citaSeleccionada.pacienteId,
            paciente: formData.paciente,
            doctor: formData.doctor,
            especialidad: formData.especialidad,
            fecha: formData.fecha,
            hora: formData.hora,
            tipoConsulta: formData.tipoConsulta,
            estado: formData.estado,
            motivoConsulta: formData.motivoConsulta,
            observaciones: formData.observaciones
          };
        }
      }

      this.filtrarCitas();
      this.cerrarModal();
      this.cdr.detectChanges();
    }
  }

  cancelarCita(cita: Cita): void {
    if (confirm(`¿Está seguro de que desea cancelar la cita de ${cita.paciente}?`)) {
      const index = this.citas.findIndex(c => c.id === cita.id);
      if (index !== -1) {
        this.citas[index].estado = 'cancelada';
        this.citas[index].observaciones = (this.citas[index].observaciones || '') +
          ` \n[${new Date().toLocaleDateString()}] Cita cancelada por el usuario.`;
        this.filtrarCitas();
        this.cdr.detectChanges();
      }
    }
  }

  // Filtros y búsqueda
  filtrarCitas(): void {
    let citasFiltradas = [...this.citas];

    // Filtro por texto
    if (this.filtro.trim()) {
      const filtroLower = this.filtro.toLowerCase();
      citasFiltradas = citasFiltradas.filter(cita =>
        cita.paciente.toLowerCase().includes(filtroLower) ||
        cita.doctor.toLowerCase().includes(filtroLower) ||
        cita.especialidad.toLowerCase().includes(filtroLower) ||
        this.formatearFecha(cita.fecha).toLowerCase().includes(filtroLower)
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === this.filtroEstado);
    }

    // Ordenar por fecha más reciente
    citasFiltradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    this.citasFiltradas = citasFiltradas;
    this.cdr.detectChanges();
  }

  // Eventos del formulario
  onDoctorChange(event: any): void {
    const doctorNombre = event.value;
    const doctor = this.doctores.find(d => d.nombre === doctorNombre);

    if (doctor) {
      this.citaForm.patchValue({ especialidad: doctor.especialidad });
      this.actualizarHorasDisponibles(doctorNombre);
    }
  }

  private actualizarHorasDisponibles(doctorNombre: string): void {
    const doctor = this.doctores.find(d => d.nombre === doctorNombre);
    this.horasDisponibles = doctor ? doctor.horarios : [];
    this.cdr.detectChanges();
  }

  // Utilidades
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPacienteCompleto(pacienteId: string): Paciente | undefined {
    return this.pacienteService.getPacientePorId(pacienteId);
  }

  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado] || estado;
  }

  getIconoEstado(estado: string): string {
    const iconos: { [key: string]: string } = {
      'pendiente': 'schedule',
      'confirmada': 'check_circle',
      'completada': 'task_alt',
      'cancelada': 'cancel'
    };
    return iconos[estado] || 'help';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
