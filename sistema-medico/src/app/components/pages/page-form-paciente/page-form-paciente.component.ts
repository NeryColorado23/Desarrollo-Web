import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  historial: RegistroConsulta[];
}

export interface RegistroConsulta {
  fecha: Date;
  signosVitales: {
    presionArterial: string;
    temperatura: number;
    pulso: number;
    respiracion: number;
    peso: number;
    talla: number;
  };
  motivoCita: string;
  observaciones?: string;
}

@Component({
  selector: 'app-page-form-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './page-form-paciente.component.html',
  styleUrls: ['./page-form-paciente.component.scss']
})
export class PageFormPacienteComponent implements OnInit {

  registroForm: FormGroup;
  pacienteEncontrado: Paciente | null = null;
  pacientes: Paciente[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registroForm = this.createForm();
    this.loadPacientesFromStorage();
  }

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.fb.group({
      // Datos del paciente
      cedula: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email]],
      fechaNacimiento: [''],

      // Signos vitales
      presionArterial: ['', Validators.required],
      temperatura: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
      pulso: ['', [Validators.required, Validators.min(40), Validators.max(200)]],
      respiracion: ['', [Validators.required, Validators.min(10), Validators.max(40)]],
      peso: ['', [Validators.required, Validators.min(1)]],
      talla: ['', [Validators.required, Validators.min(50)]],

      // Motivo de la cita
      motivoCita: ['', Validators.required],
      observaciones: ['']
    });
  }

  buscarPaciente(): void {
    const cedula = this.registroForm.get('cedula')?.value;

    if (!cedula) {
      this.showMessage('Por favor ingrese una cédula');
      return;
    }

    this.pacienteEncontrado = this.pacientes.find(p => p.cedula === cedula) || null;

    if (this.pacienteEncontrado) {
      // Llenar datos del paciente existente
      this.registroForm.patchValue({
        nombre: this.pacienteEncontrado.nombre,
        apellido: this.pacienteEncontrado.apellido,
        telefono: this.pacienteEncontrado.telefono,
        email: this.pacienteEncontrado.email,
        fechaNacimiento: this.pacienteEncontrado.fechaNacimiento
      });

      // Deshabilitar campos de datos personales
      this.registroForm.get('nombre')?.disable();
      this.registroForm.get('apellido')?.disable();
      this.registroForm.get('telefono')?.disable();
      this.registroForm.get('email')?.disable();
      this.registroForm.get('fechaNacimiento')?.disable();

      this.showMessage('Paciente encontrado. Complete los signos vitales y motivo de la cita.', 'success');
    } else {
      // Habilitar todos los campos para nuevo paciente
      this.enableAllFields();
      this.showMessage('Paciente no encontrado. Complete todos los datos para crear nuevo registro.', 'info');
    }
  }

  enableAllFields(): void {
    this.registroForm.get('nombre')?.enable();
    this.registroForm.get('apellido')?.enable();
    this.registroForm.get('telefono')?.enable();
    this.registroForm.get('email')?.enable();
    this.registroForm.get('fechaNacimiento')?.enable();
  }

  limpiarFormulario(): void {
    this.registroForm.reset();
    this.pacienteEncontrado = null;
    this.enableAllFields();
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.showMessage('Por favor complete todos los campos requeridos');
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.registroForm.getRawValue();

    const nuevaConsulta: RegistroConsulta = {
      fecha: new Date(),
      signosVitales: {
        presionArterial: formValue.presionArterial,
        temperatura: formValue.temperatura,
        pulso: formValue.pulso,
        respiracion: formValue.respiracion,
        peso: formValue.peso,
        talla: formValue.talla
      },
      motivoCita: formValue.motivoCita,
      observaciones: formValue.observaciones
    };

    if (this.pacienteEncontrado) {
      // Agregar consulta al historial del paciente existente
      this.pacienteEncontrado.historial.push(nuevaConsulta);
      this.updatePaciente(this.pacienteEncontrado);
      this.showMessage('Registro agregado al historial del paciente exitosamente', 'success');
    } else {
      // Crear nuevo paciente
      const nuevoPaciente: Paciente = {
        id: this.generateId(),
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        cedula: formValue.cedula,
        telefono: formValue.telefono,
        email: formValue.email,
        fechaNacimiento: formValue.fechaNacimiento,
        historial: [nuevaConsulta]
      };

      this.pacientes.push(nuevoPaciente);
      this.savePacientesToStorage();
      this.showMessage('Nuevo paciente registrado exitosamente', 'success');
    }

    // Limpiar formulario después del registro
    setTimeout(() => {
      this.limpiarFormulario();
    }, 2000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private updatePaciente(paciente: Paciente): void {
    const index = this.pacientes.findIndex(p => p.id === paciente.id);
    if (index !== -1) {
      this.pacientes[index] = paciente;
      this.savePacientesToStorage();
    }
  }

  private savePacientesToStorage(): void {
    localStorage.setItem('pacientes', JSON.stringify(this.pacientes));
  }

  private loadPacientesFromStorage(): void {
    const stored = localStorage.getItem('pacientes');
    if (stored) {
      this.pacientes = JSON.parse(stored);
      // Convertir strings de fecha de vuelta a Date objects
      this.pacientes.forEach(paciente => {
        if (typeof paciente.fechaNacimiento === 'string') {
          paciente.fechaNacimiento = new Date(paciente.fechaNacimiento);
        }
        paciente.historial.forEach(consulta => {
          if (typeof consulta.fecha === 'string') {
            consulta.fecha = new Date(consulta.fecha);
          }
        });
      });
    }
  }

  private showMessage(message: string, type: string = 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  // Método para obtener mensajes de error
  getErrorMessage(fieldName: string): string {
    const field = this.registroForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `Valor mínimo: ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Valor máximo: ${field.errors?.['max'].max}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      cedula: 'La cédula',
      nombre: 'El nombre',
      apellido: 'El apellido',
      telefono: 'El teléfono',
      email: 'El email',
      presionArterial: 'La presión arterial',
      temperatura: 'La temperatura',
      pulso: 'El pulso',
      respiracion: 'La respiración',
      peso: 'El peso',
      talla: 'La talla',
      motivoCita: 'El motivo de la cita'
    };
    return labels[fieldName] || fieldName;
  }

  // Método adicional para validar campos específicos
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Método para mostrar información del paciente encontrado
  getPacienteInfo(): string {
    if (this.pacienteEncontrado) {
      return `${this.pacienteEncontrado.nombre} ${this.pacienteEncontrado.apellido} - Consultas anteriores: ${this.pacienteEncontrado.historial.length}`;
    }
    return '';
  }
}
