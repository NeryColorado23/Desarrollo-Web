import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { HistorialMedicoService, RegistroMedico } from '../../../services/historial-medico.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './page-form-paciente.component.html',
  styleUrls: ['./page-form-paciente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFormPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  mensajeExito: string = '';

  // Nueva funcionalidad
  tipoPaciente: 'nuevo' | 'existente' = 'nuevo';
  pacientes: Paciente[] = [];
  pacientesFiltrados!: Observable<Paciente[]>;
  pacienteSeleccionado: Paciente | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private historialService: HistorialMedicoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.cargarPacientes();
    this.configurarAutocomplete();
  }

  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      // Campo para buscar paciente existente
      buscarPaciente: [''],

      // Datos Personales
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

    // Actualizar validaciones según el tipo de paciente
    this.actualizarValidaciones();
  }

  private cargarPacientes(): void {
    this.pacientes = this.pacienteService.getPacientes();
  }

  private configurarAutocomplete(): void {
    const buscarControl = this.pacienteForm.get('buscarPaciente');
    if (buscarControl) {
      this.pacientesFiltrados = buscarControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.nombreCompleto;
          return nombre ? this._filtrarPacientes(nombre) : this.pacientes.slice();
        })
      );
    }
  }

  private _filtrarPacientes(valor: string): Paciente[] {
    const filtro = valor.toLowerCase();
    return this.pacientes.filter(paciente =>
      paciente.nombreCompleto.toLowerCase().includes(filtro) ||
      paciente.cedula.includes(valor)
    );
  }

  displayPaciente(paciente: Paciente): string {
    return paciente ? `${paciente.nombreCompleto} - ${paciente.cedula}` : '';
  }

  onTipoPacienteChange(tipo: 'nuevo' | 'existente'): void {
    this.tipoPaciente = tipo;
    this.pacienteSeleccionado = null;
    this.pacienteForm.reset();
    this.actualizarValidaciones();
    this.cdr.markForCheck();
  }

  private actualizarValidaciones(): void {
    const camposDatosPersonales = [
      'nombreCompleto', 'cedula', 'fechaNacimiento',
      'genero', 'telefono', 'email', 'direccion'
    ];

    if (this.tipoPaciente === 'existente') {
      // Para pacientes existentes, solo requerir búsqueda y datos de consulta
      camposDatosPersonales.forEach(campo => {
        const control = this.pacienteForm.get(campo);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    } else {
      // Para pacientes nuevos, requerir todos los datos personales
      this.pacienteForm.get('nombreCompleto')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.pacienteForm.get('cedula')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.pacienteForm.get('fechaNacimiento')?.setValidators(Validators.required);
      this.pacienteForm.get('genero')?.setValidators(Validators.required);
      this.pacienteForm.get('telefono')?.setValidators([Validators.required, Validators.pattern(/^\d{8,15}$/)]);
      this.pacienteForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.pacienteForm.get('direccion')?.setValidators([Validators.required, Validators.minLength(10)]);

      camposDatosPersonales.forEach(campo => {
        this.pacienteForm.get(campo)?.updateValueAndValidity();
      });
    }
  }

  onPacienteSeleccionado(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;

    // Llenar los datos personales (solo lectura)
    this.pacienteForm.patchValue({
      nombreCompleto: paciente.nombreCompleto,
      cedula: paciente.cedula,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      email: paciente.email,
      direccion: paciente.direccion
    });

    // Deshabilitar campos de datos personales
    this.deshabilitarCamposDatosPersonales(true);
    this.cdr.markForCheck();
  }

  private deshabilitarCamposDatosPersonales(deshabilitar: boolean): void {
    const campos = ['nombreCompleto', 'cedula', 'fechaNacimiento', 'genero', 'telefono', 'email', 'direccion'];
    campos.forEach(campo => {
      const control = this.pacienteForm.get(campo);
      if (deshabilitar) {
        control?.disable();
      } else {
        control?.enable();
      }
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
    if (this.tipoPaciente === 'nuevo') {
      this.registrarPacienteNuevo();
    } else {
      this.registrarNuevaConsulta();
    }
  }

  private registrarPacienteNuevo(): void {
    if (this.pacienteForm.valid) {
      const pacienteData: PacienteRegistro = this.pacienteForm.value;

      // Agregar el paciente
      this.pacienteService.agregarPaciente(pacienteData);

      // Obtener el último paciente agregado (el que acabamos de crear)
      const pacientes = this.pacienteService.getPacientes();
      const pacienteCreado = pacientes[pacientes.length - 1];

      // Crear el primer registro médico
      this.crearRegistroMedico(pacienteCreado.id, pacienteData);

      this.mensajeExito = 'Paciente registrado exitosamente con su primera consulta';
      this.cdr.markForCheck();

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private registrarNuevaConsulta(): void {
    if (!this.pacienteSeleccionado) {
      alert('Por favor, seleccione un paciente de la lista');
      return;
    }

    // Validar solo los campos de signos vitales y motivo de consulta
    const motivoConsulta = this.pacienteForm.get('motivoConsulta');
    const tipoConsulta = this.pacienteForm.get('tipoConsulta');
    const prioridad = this.pacienteForm.get('prioridad');

    if (!motivoConsulta?.valid || !tipoConsulta?.valid || !prioridad?.valid) {
      this.marcarCamposComoTocados();
      alert('Por favor, complete los campos requeridos de la consulta');
      return;
    }

    const consultaData = {
      temperatura: this.pacienteForm.get('temperatura')?.value,
      peso: this.pacienteForm.get('peso')?.value,
      altura: this.pacienteForm.get('altura')?.value,
      presionSistolica: this.pacienteForm.get('presionSistolica')?.value,
      presionDiastolica: this.pacienteForm.get('presionDiastolica')?.value,
      frecuenciaCardiaca: this.pacienteForm.get('frecuenciaCardiaca')?.value,
      frecuenciaRespiratoria: this.pacienteForm.get('frecuenciaRespiratoria')?.value,
      motivoConsulta: motivoConsulta?.value,
      sintomasAdicionales: this.pacienteForm.get('sintomasAdicionales')?.value,
      tipoConsulta: tipoConsulta?.value,
      prioridad: prioridad?.value
    };

    // Crear nuevo registro médico
    this.crearRegistroMedico(this.pacienteSeleccionado.id, consultaData);

    this.mensajeExito = `Nueva consulta registrada para ${this.pacienteSeleccionado.nombreCompleto}`;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  private crearRegistroMedico(pacienteId: string, data: any): void {
    const nuevoRegistro: Omit<RegistroMedico, 'id'> = {
      pacienteId: pacienteId,
      fecha: new Date(),
      motivo: data.motivoConsulta,
      diagnostico: 'Pendiente de evaluación médica',
      tratamiento: 'A determinar',
      observaciones: data.sintomasAdicionales || 'Sin observaciones adicionales',
      doctorNombre: 'Dr. Sistema', // Aquí podrías obtener el doctor actual
      temperatura: data.temperatura,
      peso: data.peso,
      altura: data.altura,
      presionSistolica: data.presionSistolica,
      presionDiastolica: data.presionDiastolica,
      frecuenciaCardiaca: data.frecuenciaCardiaca,
      frecuenciaRespiratoria: data.frecuenciaRespiratoria
    };

    this.historialService.agregarRegistro(nuevoRegistro);
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.pacienteForm.controls).forEach(key => {
      const control = this.pacienteForm.get(key);
      if (control && control.enabled) {
        control.markAsTouched();
      }
    });
  }

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
