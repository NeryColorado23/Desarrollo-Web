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

// Importar servicios
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { DoctorService, Doctor } from '../../../services/doctor.service';
import { CitaService, Cita } from '../../../services/cita.service';

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
  citasFiltradas: Cita[] = [];

  // Obtener pacientes del servicio
  get pacientes(): string[] {
    return this.pacienteService.getNombresPacientes();
  }

  // Obtener doctores del servicio
  get doctores(): Doctor[] {
    return this.doctorService.getDoctoresActivos();
  }

  horasDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private pacienteService: PacienteService,
    private doctorService: DoctorService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.filtrarCitas();

    // Suscribirse a cambios en citas
    this.citaService.citas$.subscribe(() => {
      this.filtrarCitas();
      this.cdr.detectChanges();
    });

    // Suscribirse a cambios en pacientes
    this.pacienteService.pacientes$.subscribe(() => {
      this.cdr.detectChanges();
    });

    // Suscribirse a cambios en doctores
    this.doctorService.doctores$.subscribe(() => {
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

      // Actualizar horas disponibles para el doctor seleccionado
      const doctor = this.doctorService.getDoctorPorNombre(cita.doctor);
      if (doctor) {
        this.actualizarHorasDisponibles(doctor);
      }
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
        // Usar el servicio centralizado para agregar la cita
        this.citaService.agregarCita({
          pacienteId: pacienteSeleccionado?.id || '',
          paciente: formData.paciente,
          doctor: formData.doctor,
          especialidad: formData.especialidad,
          fecha: formData.fecha,
          hora: formData.hora,
          tipoConsulta: formData.tipoConsulta,
          estado: formData.estado,
          motivoConsulta: formData.motivoConsulta,
          observaciones: formData.observaciones
        });
      } else if (this.modalTipo === 'editar' && this.citaSeleccionada) {
        // Usar el servicio centralizado para actualizar la cita
        this.citaService.actualizarCita(this.citaSeleccionada.id, {
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
        });
      }

      this.cerrarModal();
    }
  }

  cancelarCita(cita: Cita): void {
    if (confirm(`¿Está seguro de que desea cancelar la cita de ${cita.paciente}?`)) {
      this.citaService.cancelarCita(cita.id, 'Cancelada por el usuario');
    }
  }

  // Filtros y búsqueda
  filtrarCitas(): void {
    let citasFiltradas = this.citaService.getCitas();

    // Filtro por texto
    if (this.filtro.trim()) {
      const filtroLower = this.filtro.toLowerCase();
      citasFiltradas = citasFiltradas.filter((cita: Cita) =>
        cita.paciente.toLowerCase().includes(filtroLower) ||
        cita.doctor.toLowerCase().includes(filtroLower) ||
        cita.especialidad.toLowerCase().includes(filtroLower) ||
        this.formatearFecha(cita.fecha).toLowerCase().includes(filtroLower)
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      citasFiltradas = citasFiltradas.filter((cita: Cita) => cita.estado === this.filtroEstado);
    }

    // Ordenar por fecha más reciente
    citasFiltradas.sort((a: Cita, b: Cita) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    this.citasFiltradas = citasFiltradas;
    this.cdr.detectChanges();
  }

  // Eventos del formulario
  onDoctorChange(event: any): void {
    const doctorNombre = event.value;
    const doctor = this.doctorService.getDoctorPorNombre(doctorNombre);

    if (doctor) {
      this.citaForm.patchValue({ especialidad: doctor.especialidad });
      this.actualizarHorasDisponibles(doctor);
    }
  }

  private actualizarHorasDisponibles(doctor: Doctor): void {
    this.horasDisponibles = doctor.horasDisponibles || [];
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
}
