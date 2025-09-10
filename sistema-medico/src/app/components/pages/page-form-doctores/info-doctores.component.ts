import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

// Definir interfaz local
interface Doctor {
  id: string;
  nombreCompleto: string;
  cedula: string;
  especialidad: string;
  subespecialidad?: string;
  tiempoExperiencia: number;
  email: string;
  telefono: string;
  direccionConsultorio?: string;
  numeroLicencia: string;
  universidad: string;
  fechaGraduacion: Date;
  horarios: {
    lunes: { inicio: string; fin: string; activo: boolean };
    martes: { inicio: string; fin: string; activo: boolean };
    miercoles: { inicio: string; fin: string; activo: boolean };
    jueves: { inicio: string; fin: string; activo: boolean };
    viernes: { inicio: string; fin: string; activo: boolean };
    sabado: { inicio: string; fin: string; activo: boolean };
    domingo: { inicio: string; fin: string; activo: boolean };
  };
  horasDisponibles: string[];
  estado: 'activo' | 'inactivo' | 'vacaciones';
  fechaRegistro: Date;
  observaciones?: string;
}

@Component({
  selector: 'app-info-doctores',
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
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './info-doctores.component.html',
  styleUrls: ['./info-doctores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoDoctoresComponent implements OnInit {
  // Formulario y estado de modales
  doctorForm!: FormGroup;
  mostrarModal = false;
  mostrarDetalles = false;
  mostrarHorarios = false;
  modalTipo: 'crear' | 'editar' = 'crear';
  doctorSeleccionado: Doctor | null = null;

  // Filtros
  filtro = '';
  filtroEspecialidad = '';
  filtroEstado = '';

  // Datos
  doctores: Doctor[] = [];
  doctoresFiltrados: Doctor[] = [];

  // Datos de referencia locales
  especialidades = [
    'Medicina General',
    'Cardiología',
    'Dermatología',
    'Endocrinología',
    'Gastroenterología',
    'Ginecología',
    'Neurología',
    'Oftalmología',
    'Ortopedia',
    'Pediatría',
    'Psiquiatría',
    'Radiología',
    'Traumatología',
    'Urología',
    'Anestesiología',
    'Cirugía General',
    'Medicina Interna',
    'Neumología',
    'Oncología',
    'Otorrinolaringología'
  ];

  diasSemana = [
    { key: 'lunes', nombre: 'Lunes' },
    { key: 'martes', nombre: 'Martes' },
    { key: 'miercoles', nombre: 'Miércoles' },
    { key: 'jueves', nombre: 'Jueves' },
    { key: 'viernes', nombre: 'Viernes' },
    { key: 'sabado', nombre: 'Sábado' },
    { key: 'domingo', nombre: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.cargarDoctoresEjemplo();
    this.filtrarDoctores();
  }

  private initializeForm(): void {
    this.doctorForm = this.fb.group({
      // Información personal
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cedula: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{4}$/)]],

      // Información profesional
      especialidad: ['', Validators.required],
      subespecialidad: [''],
      tiempoExperiencia: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      numeroLicencia: ['', [Validators.required, Validators.minLength(3)]],
      universidad: ['', Validators.required],
      fechaGraduacion: ['', Validators.required],
      estado: ['activo'],
      direccionConsultorio: [''],
      observaciones: [''],

      // Horarios
      horarios: this.fb.group({
        lunes: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['17:00']
        }),
        martes: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['17:00']
        }),
        miercoles: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['17:00']
        }),
        jueves: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['17:00']
        }),
        viernes: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['17:00']
        }),
        sabado: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['12:00']
        }),
        domingo: this.fb.group({
          activo: [false],
          inicio: ['08:00'],
          fin: ['12:00']
        })
      })
    });
  }

  private cargarDoctoresEjemplo(): void {
    this.doctores = [
      {
        id: '1',
        nombreCompleto: 'Dr. Antonio Méndez',
        cedula: 'DOC001',
        especialidad: 'Cardiología',
        subespecialidad: 'Electrofisiología',
        tiempoExperiencia: 15,
        email: 'antonio.mendez@hospital.com',
        telefono: '555-1001',
        direccionConsultorio: 'Consultorio 201, Edificio Médico Central',
        numeroLicencia: 'MED-12345',
        universidad: 'Universidad Central de Medicina',
        fechaGraduacion: new Date(2009, 5, 20),
        horarios: {
          lunes: { inicio: '08:00', fin: '17:00', activo: true },
          martes: { inicio: '08:00', fin: '17:00', activo: true },
          miercoles: { inicio: '08:00', fin: '17:00', activo: true },
          jueves: { inicio: '08:00', fin: '17:00', activo: true },
          viernes: { inicio: '08:00', fin: '15:00', activo: true },
          sabado: { inicio: '08:00', fin: '12:00', activo: false },
          domingo: { inicio: '00:00', fin: '00:00', activo: false }
        },
        horasDisponibles: ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00'],
        estado: 'activo',
        fechaRegistro: new Date(2024, 0, 15),
        observaciones: 'Especialista en arritmias cardíacas'
      },
      {
        id: '2',
        nombreCompleto: 'Dra. Isabel Romero',
        cedula: 'DOC002',
        especialidad: 'Pediatría',
        subespecialidad: 'Neonatología',
        tiempoExperiencia: 12,
        email: 'isabel.romero@hospital.com',
        telefono: '555-1002',
        direccionConsultorio: 'Consultorio 305, Ala Pediátrica',
        numeroLicencia: 'MED-12346',
        universidad: 'Instituto de Ciencias Médicas',
        fechaGraduacion: new Date(2012, 8, 15),
        horarios: {
          lunes: { inicio: '08:30', fin: '16:30', activo: true },
          martes: { inicio: '08:30', fin: '16:30', activo: true },
          miercoles: { inicio: '08:30', fin: '16:30', activo: true },
          jueves: { inicio: '08:30', fin: '16:30', activo: true },
          viernes: { inicio: '08:30', fin: '14:30', activo: true },
          sabado: { inicio: '00:00', fin: '00:00', activo: false },
          domingo: { inicio: '00:00', fin: '00:00', activo: false }
        },
        horasDisponibles: ['08:30', '09:30', '10:30', '11:30', '15:30', '16:30'],
        estado: 'activo',
        fechaRegistro: new Date(2024, 1, 10),
        observaciones: 'Especialista en cuidados intensivos neonatales'
      }
    ];
  }

  // Gestión del modal principal
  abrirModalDoctor(tipo: 'crear' | 'editar', doctor?: Doctor | null): void {
    this.modalTipo = tipo;
    this.mostrarModal = true;

    if (tipo === 'editar' && doctor) {
      this.doctorSeleccionado = doctor;
      this.doctorForm.patchValue({
        nombreCompleto: doctor.nombreCompleto,
        cedula: doctor.cedula,
        email: doctor.email,
        telefono: doctor.telefono,
        especialidad: doctor.especialidad,
        subespecialidad: doctor.subespecialidad,
        tiempoExperiencia: doctor.tiempoExperiencia,
        numeroLicencia: doctor.numeroLicencia,
        universidad: doctor.universidad,
        fechaGraduacion: doctor.fechaGraduacion,
        estado: doctor.estado,
        direccionConsultorio: doctor.direccionConsultorio,
        observaciones: doctor.observaciones,
        horarios: doctor.horarios
      });
    } else {
      this.doctorForm.reset();
      this.doctorForm.patchValue({ estado: 'activo' });
      this.doctorSeleccionado = null;
    }

    this.mostrarDetalles = false;
    this.mostrarHorarios = false;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.doctorForm.reset();
    this.doctorSeleccionado = null;
    this.cdr.detectChanges();
  }

  // Gestión de detalles
  verDetallesDoctor(doctor: Doctor): void {
    this.doctorSeleccionado = doctor;
    this.mostrarDetalles = true;
    this.mostrarModal = false;
    this.mostrarHorarios = false;
    this.cdr.detectChanges();
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
    this.doctorSeleccionado = null;
    this.cdr.detectChanges();
  }

  // Gestión de horarios
  verHorarios(doctor: Doctor): void {
    this.doctorSeleccionado = doctor;
    this.mostrarHorarios = true;
    this.mostrarModal = false;
    this.mostrarDetalles = false;
    this.cdr.detectChanges();
  }

  cerrarHorarios(): void {
    this.mostrarHorarios = false;
    this.doctorSeleccionado = null;
    this.cdr.detectChanges();
  }

  // Operaciones CRUD
  guardarDoctor(): void {
    if (this.doctorForm.valid) {
      const formData = this.doctorForm.value;
      const horasDisponibles = this.generarHorasDisponibles(formData.horarios);

      if (this.modalTipo === 'crear') {
        const nuevoDoctor: Doctor = {
          id: this.generateId(),
          ...formData,
          horasDisponibles,
          fechaRegistro: new Date()
        };
        this.doctores.push(nuevoDoctor);
      } else if (this.modalTipo === 'editar' && this.doctorSeleccionado) {
        const index = this.doctores.findIndex(d => d.id === this.doctorSeleccionado!.id);
        if (index !== -1) {
          this.doctores[index] = {
            ...this.doctorSeleccionado,
            ...formData,
            horasDisponibles
          };
        }
      }

      this.filtrarDoctores();
      this.cerrarModal();
      this.cdr.detectChanges();
    } else {
      this.marcarCamposComoTocados();
    }
  }

  cambiarEstado(doctor: Doctor): void {
    const nuevoEstado = doctor.estado === 'activo' ? 'inactivo' : 'activo';
    const mensaje = nuevoEstado === 'activo' ? 'activar' : 'inactivar';

    if (confirm(`¿Está seguro de que desea ${mensaje} al Dr. ${doctor.nombreCompleto}?`)) {
      const index = this.doctores.findIndex(d => d.id === doctor.id);
      if (index !== -1) {
        this.doctores[index].estado = nuevoEstado;
        this.filtrarDoctores();
        this.cdr.detectChanges();
      }
    }
  }

  // Filtros y búsqueda
  filtrarDoctores(): void {
    let doctoresFiltrados = [...this.doctores];

    if (this.filtro.trim()) {
      const filtroLower = this.filtro.toLowerCase();
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor.nombreCompleto.toLowerCase().includes(filtroLower) ||
        doctor.especialidad.toLowerCase().includes(filtroLower) ||
        doctor.email.toLowerCase().includes(filtroLower) ||
        doctor.numeroLicencia.toLowerCase().includes(filtroLower)
      );
    }

    if (this.filtroEspecialidad) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor.especialidad === this.filtroEspecialidad);
    }

    if (this.filtroEstado) {
      doctoresFiltrados = doctoresFiltrados.filter(doctor =>
        doctor.estado === this.filtroEstado);
    }

    doctoresFiltrados.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
    this.doctoresFiltrados = doctoresFiltrados;
    this.cdr.detectChanges();
  }

  // Utilidades
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'vacaciones': 'Vacaciones'
    };
    return estados[estado] || estado;
  }

  getDiasActivos(doctor: Doctor): string[] {
    const diasActivos: string[] = [];

    if (doctor && doctor.horarios) {
      if (doctor.horarios.lunes.activo) diasActivos.push('Lun');
      if (doctor.horarios.martes.activo) diasActivos.push('Mar');
      if (doctor.horarios.miercoles.activo) diasActivos.push('Mié');
      if (doctor.horarios.jueves.activo) diasActivos.push('Jue');
      if (doctor.horarios.viernes.activo) diasActivos.push('Vie');
      if (doctor.horarios.sabado.activo) diasActivos.push('Sáb');
      if (doctor.horarios.domingo.activo) diasActivos.push('Dom');
    }

    return diasActivos;
  }

  // Método helper para obtener horario de un día específico
  getHorarioDia(doctor: Doctor | null, dia: string): { inicio: string; fin: string; activo: boolean } | null {
    if (!doctor || !doctor.horarios) return null;

    type DiaKey = keyof typeof doctor.horarios;
    if (dia in doctor.horarios) {
      return doctor.horarios[dia as DiaKey];
    }
    return null;
  }

  getDiaControl(dia: string, campo: string): FormControl | null {
    const horariosGroup = this.doctorForm.get('horarios') as FormGroup;
    if (!horariosGroup) return null;

    const diaGroup = horariosGroup.get(dia) as FormGroup;
    if (!diaGroup) return null;

    return diaGroup.get(campo) as FormControl;
  }

  private generarHorasDisponibles(horarios: any): string[] {
    const horas: string[] = [];
    const horasBase = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                      '16:00', '16:30', '17:00', '17:30', '18:00'];

    if (horarios) {
      Object.keys(horarios).forEach(dia => {
        if (horarios[dia]?.activo) {
          horas.push(...horasBase.slice(0, 8));
        }
      });
    }

    return [...new Set(horas)].sort();
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      if (control) {
        control.markAsTouched();

        if (key === 'horarios' && control instanceof FormGroup) {
          Object.keys(control.controls).forEach(diaKey => {
            const diaControl = control.get(diaKey);
            if (diaControl instanceof FormGroup) {
              Object.keys(diaControl.controls).forEach(campoKey => {
                diaControl.get(campoKey)?.markAsTouched();
              });
            }
          });
        }
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.doctorForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }

    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']['requiredLength'];
      return `Mínimo ${requiredLength} caracteres`;
    }

    if (control?.hasError('pattern')) {
      return 'Formato inválido (use XXX-XXXX)';
    }

    if (control?.hasError('min') || control?.hasError('max')) {
      return 'Valor fuera del rango permitido';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombreCompleto': 'Nombre completo',
      'cedula': 'Cédula',
      'email': 'Email',
      'telefono': 'Teléfono',
      'especialidad': 'Especialidad',
      'tiempoExperiencia': 'Tiempo de experiencia',
      'numeroLicencia': 'Número de licencia',
      'universidad': 'Universidad',
      'fechaGraduacion': 'Fecha de graduación'
    };

    return labels[fieldName] || fieldName;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
