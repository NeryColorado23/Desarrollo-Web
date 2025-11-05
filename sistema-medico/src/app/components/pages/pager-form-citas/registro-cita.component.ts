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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatChipsModule,
    MatSnackBarModule
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
  horasOcupadas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private pacienteService: PacienteService,
    private doctorService: DoctorService,
    private citaService: CitaService,
    private snackBar: MatSnackBar
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

    // Escuchar cambios en la fecha para actualizar horas disponibles
    this.citaForm.get('fecha')?.valueChanges.subscribe(() => {
      this.actualizarHorasDisponiblesConValidacion();
    });

    // Escuchar cambios en el doctor para actualizar horas disponibles
    this.citaForm.get('doctor')?.valueChanges.subscribe(() => {
      this.actualizarHorasDisponiblesConValidacion();
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
        this.actualizarHorasDisponiblesConValidacion();
      }
    } else {
      this.citaForm.reset();
      this.citaForm.patchValue({ estado: 'pendiente' });
      this.citaSeleccionada = null;
      this.horasDisponibles = [];
      this.horasOcupadas = [];
    }

    this.mostrarDetalles = false;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.citaForm.reset();
    this.citaSeleccionada = null;
    this.horasDisponibles = [];
    this.horasOcupadas = [];
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
        // Usar el servicio centralizado para agregar la cita CON VALIDACIÓN
        const resultado = this.citaService.agregarCita({
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

        if (resultado.exito) {
          this.mostrarNotificacion('✅ ' + resultado.mensaje, 'success');
          this.cerrarModal();
        } else {
          this.mostrarNotificacion('❌ ' + resultado.mensaje, 'error');
        }
      } else if (this.modalTipo === 'editar' && this.citaSeleccionada) {
        // Usar el servicio centralizado para actualizar la cita CON VALIDACIÓN
        const resultado = this.citaService.actualizarCita(this.citaSeleccionada.id, {
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

        if (resultado.exito) {
          this.mostrarNotificacion('✅ ' + resultado.mensaje, 'success');
          this.cerrarModal();
        } else {
          this.mostrarNotificacion('❌ ' + resultado.mensaje, 'error');
        }
      }
    } else {
      this.mostrarNotificacion('⚠️ Por favor complete todos los campos requeridos', 'warning');
    }
  }

  cancelarCita(cita: Cita): void {
    if (confirm(`¿Está seguro de que desea cancelar la cita de ${cita.paciente}?`)) {
      this.citaService.cancelarCita(cita.id, 'Cancelada por el usuario');
      this.mostrarNotificacion('Cita cancelada exitosamente', 'success');
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
      this.actualizarHorasDisponiblesConValidacion();
    }
  }

  private actualizarHorasDisponibles(doctor: Doctor): void {
    this.horasDisponibles = doctor.horasDisponibles || [];
    this.cdr.detectChanges();
  }

  private actualizarHorasDisponiblesConValidacion(): void {
    const fecha = this.citaForm.get('fecha')?.value;
    const doctor = this.citaForm.get('doctor')?.value;

    if (fecha && doctor) {
      // Obtener las horas ocupadas para este doctor en esta fecha
      this.horasOcupadas = this.citaService.getHorasOcupadas(
        fecha,
        doctor,
        this.citaSeleccionada?.id // Excluir la cita actual si estamos editando
      );
      this.cdr.detectChanges();
    } else {
      this.horasOcupadas = [];
    }
  }

  isHoraOcupada(hora: string): boolean {
    return this.horasOcupadas.includes(hora);
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

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    const config = {
      duration: 5000,
      horizontalPosition: 'center' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${tipo}`]
    };

    this.snackBar.open(mensaje, 'Cerrar', config);
  }
}
