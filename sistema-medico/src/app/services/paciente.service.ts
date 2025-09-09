import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Paciente {
  id: string;
  nombreCompleto: string;
  cedula: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  // Signos vitales opcionales
  temperatura?: number;
  peso?: number;
  altura?: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  // Información médica
  motivoConsulta?: string;
  sintomasAdicionales?: string;
  tipoConsulta?: string;
  prioridad?: string;
  fechaRegistro: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  public pacientes$ = this.pacientesSubject.asObservable();

  constructor() {
    this.cargarPacientesEjemplo();
  }

  private cargarPacientesEjemplo(): void {
    // Algunos pacientes de ejemplo para empezar
    const pacientesEjemplo: Paciente[] = [
      {
        id: '1',
        nombreCompleto: 'Juan Pérez García',
        cedula: '12345678',
        fechaNacimiento: new Date(1985, 5, 15),
        genero: 'masculino',
        telefono: '555-0123',
        email: 'juan.perez@email.com',
        direccion: 'Calle Principal 123, Ciudad',
        fechaRegistro: new Date(2024, 10, 1)
      },
      {
        id: '2',
        nombreCompleto: 'María González López',
        cedula: '87654321',
        fechaNacimiento: new Date(1992, 8, 22),
        genero: 'femenino',
        telefono: '555-0456',
        email: 'maria.gonzalez@email.com',
        direccion: 'Avenida Central 456, Ciudad',
        fechaRegistro: new Date(2024, 10, 5)
      },
      {
        id: '3',
        nombreCompleto: 'Carlos Rodríguez Martín',
        cedula: '11223344',
        fechaNacimiento: new Date(1978, 2, 10),
        genero: 'masculino',
        telefono: '555-0789',
        email: 'carlos.rodriguez@email.com',
        direccion: 'Plaza Mayor 789, Ciudad',
        fechaRegistro: new Date(2024, 10, 8)
      },
      {
        id: '4',
        nombreCompleto: 'Ana Fernández Ruiz',
        cedula: '44332211',
        fechaNacimiento: new Date(1990, 11, 3),
        genero: 'femenino',
        telefono: '555-0321',
        email: 'ana.fernandez@email.com',
        direccion: 'Barrio Norte 321, Ciudad',
        fechaRegistro: new Date(2024, 10, 12)
      }
    ];

    this.pacientesSubject.next(pacientesEjemplo);
  }

  // Obtener todos los pacientes
  getPacientes(): Paciente[] {
    return this.pacientesSubject.value;
  }

  // Obtener paciente por ID
  getPacientePorId(id: string): Paciente | undefined {
    return this.pacientesSubject.value.find(p => p.id === id);
  }

  // Agregar nuevo paciente
  agregarPaciente(paciente: Omit<Paciente, 'id' | 'fechaRegistro'>): void {
    const nuevoPaciente: Paciente = {
      ...paciente,
      id: this.generateId(),
      fechaRegistro: new Date()
    };

    const pacientesActuales = this.pacientesSubject.value;
    this.pacientesSubject.next([...pacientesActuales, nuevoPaciente]);
  }

  // Actualizar paciente
  actualizarPaciente(id: string, pacienteActualizado: Partial<Paciente>): void {
    const pacientes = this.pacientesSubject.value;
    const index = pacientes.findIndex(p => p.id === id);

    if (index !== -1) {
      pacientes[index] = { ...pacientes[index], ...pacienteActualizado };
      this.pacientesSubject.next([...pacientes]);
    }
  }

  // Eliminar paciente
  eliminarPaciente(id: string): void {
    const pacientes = this.pacientesSubject.value.filter(p => p.id !== id);
    this.pacientesSubject.next(pacientes);
  }

  // Buscar pacientes
  buscarPacientes(termino: string): Paciente[] {
    const terminoLower = termino.toLowerCase();
    return this.pacientesSubject.value.filter(paciente =>
      paciente.nombreCompleto.toLowerCase().includes(terminoLower) ||
      paciente.cedula.includes(termino) ||
      paciente.email.toLowerCase().includes(terminoLower)
    );
  }

  // Obtener nombres de pacientes para select
  getNombresPacientes(): string[] {
    return this.pacientesSubject.value.map(p => p.nombreCompleto);
  }

  // Obtener paciente por nombre completo
  getPacientePorNombre(nombreCompleto: string): Paciente | undefined {
    return this.pacientesSubject.value.find(p => p.nombreCompleto === nombreCompleto);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
