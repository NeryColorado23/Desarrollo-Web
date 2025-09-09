import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { PacienteService } from '../../../services/paciente.service';

export interface PacienteRegistro {
  // Datos Personales
  nombreCompleto: string;
  cedula: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;

  // Signos Vitales
  temperatura?: number;
  peso?: number;
  altura?: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;

  // Motivo de Consulta
  motivoConsulta: string;
  sintomasAdicionales?: string;
  tipoConsulta: string;
  prioridad: string;
}

@Component({
  selector: 'app-page-form-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './page-form-paciente.component.html',
  styleUrls: ['./page-form-paciente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFormPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      // Datos Personales - Requeridos
      nombreCompleto: ['', [Validators.required, Validators.minLength(2)]],
      cedula: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],

      // Signos Vitales - Opcionales pero con validaciones
      temperatura: ['', [Validators.min(35), Validators.max(45)]],
      peso: ['', [Validators.min(1), Validators.max(300)]],
      altura: ['', [Validators.min(50), Validators.max(250)]],
      presionSistolica: ['', [Validators.min(60), Validators.max(250)]],
      presionDiastolica: ['', [Validators.min(40), Validators.max(150)]],
      frecuenciaCardiaca: ['', [Validators.min(40), Validators.max(200)]],
      frecuenciaRespiratoria: ['', [Validators.min(8), Validators.max(40)]],

      // Motivo de Consulta - Requeridos
      motivoConsulta: ['', [Validators.required, Validators.minLength(10)]],
      sintomasAdicionales: [''],
      tipoConsulta: ['', Validators.required],
      prioridad: ['', Validators.required]
    });
  }

  calcularIMC(): string {
    const peso = this.pacienteForm.get('peso')?.value;
    const altura = this.pacienteForm.get('altura')?.value;

    if (peso && altura && peso > 0 && altura > 0) {
      const alturaEnMetros = altura / 100;
      const imc = peso / (alturaEnMetros * alturaEnMetros);
      return imc.toFixed(1);
    }

    return '';
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      const pacienteData: PacienteRegistro = this.pacienteForm.value;

      // Aquí normalmente harías la llamada a tu servicio para guardar
      console.log('Datos del paciente a registrar:', pacienteData);

      // Simular guardado exitoso
      this.guardarPaciente(pacienteData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.marcarCamposComoTocados();
    }
  }

  private guardarPaciente(data: PacienteRegistro): void {
    // Usar el servicio para guardar el paciente
    this.pacienteService.agregarPaciente(data);

    this.mensajeExito = 'Paciente registrado exitosamente';

    // Opcional: Redirigir después de un tiempo
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.pacienteForm.controls).forEach(key => {
      const control = this.pacienteForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Método para obtener mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const control = this.pacienteForm.get(fieldName);

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
      return 'Formato inválido';
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
      'fechaNacimiento': 'Fecha de nacimiento',
      'genero': 'Género',
      'telefono': 'Teléfono',
      'email': 'Email',
      'direccion': 'Dirección',
      'motivoConsulta': 'Motivo de consulta',
      'tipoConsulta': 'Tipo de consulta',
      'prioridad': 'Prioridad'
    };

    return labels[fieldName] || fieldName;
  }
}
