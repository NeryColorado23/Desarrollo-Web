import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RegistroMedico {
  id: string;
  pacienteId: string;
  fecha: Date;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos?: string;
  observaciones?: string;
  doctorNombre: string;
  // Signos vitales del momento
  temperatura?: number;
  peso?: number;
  altura?: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private registrosSubject = new BehaviorSubject<RegistroMedico[]>([]);
  public registros$ = this.registrosSubject.asObservable();

  constructor() {
    this.cargarRegistrosEjemplo();
  }

  private cargarRegistrosEjemplo(): void {
    const registrosEjemplo: RegistroMedico[] = [
      {
        id: '1',
        pacienteId: '1',
        fecha: new Date(2024, 9, 15),
        motivo: 'Consulta general - Dolor de cabeza',
        diagnostico: 'Cefalea tensional',
        tratamiento: 'Reposo y analgésicos',
        medicamentos: 'Paracetamol 500mg cada 8 horas',
        observaciones: 'Paciente reporta estrés laboral. Se recomienda seguimiento en 2 semanas.',
        doctorNombre: 'Dr. José Martínez',
        temperatura: 36.5,
        peso: 75,
        altura: 175,
        presionSistolica: 120,
        presionDiastolica: 80,
        frecuenciaCardiaca: 72,
        frecuenciaRespiratoria: 16
      },
      {
        id: '2',
        pacienteId: '1',
        fecha: new Date(2024, 10, 1),
        motivo: 'Control de seguimiento',
        diagnostico: 'Evolución favorable',
        tratamiento: 'Continuar con medidas preventivas',
        observaciones: 'Paciente sin molestias. Alta médica.',
        doctorNombre: 'Dr. José Martínez',
        temperatura: 36.7,
        peso: 74,
        presionSistolica: 118,
        presionDiastolica: 78,
        frecuenciaCardiaca: 70
      },
      {
        id: '3',
        pacienteId: '2',
        fecha: new Date(2024, 10, 5),
        motivo: 'Revisión anual',
        diagnostico: 'Estado de salud óptimo',
        tratamiento: 'Mantener hábitos saludables',
        observaciones: 'Todos los parámetros dentro de rangos normales.',
        doctorNombre: 'Dra. Carmen Silva',
        temperatura: 36.6,
        peso: 62,
        altura: 165,
        presionSistolica: 115,
        presionDiastolica: 75,
        frecuenciaCardiaca: 68,
        frecuenciaRespiratoria: 14
      },
      {
        id: '4',
        pacienteId: '3',
        fecha: new Date(2024, 10, 8),
        motivo: 'Dolor lumbar',
        diagnostico: 'Lumbalgia mecánica',
        tratamiento: 'Fisioterapia y ejercicios de estiramiento',
        medicamentos: 'Ibuprofeno 400mg cada 8 horas si hay dolor',
        observaciones: 'Se recomienda evitar cargar objetos pesados. Cita con fisioterapeuta.',
        doctorNombre: 'Dr. Roberto Castillo',
        temperatura: 36.8,
        peso: 82,
        presionSistolica: 125,
        presionDiastolica: 82,
        frecuenciaCardiaca: 75
      },
      {
        id: '5',
        pacienteId: '4',
        fecha: new Date(2024, 10, 12),
        motivo: 'Control prenatal - 20 semanas',
        diagnostico: 'Embarazo de evolución normal',
        tratamiento: 'Continuar con vitaminas prenatales',
        medicamentos: 'Ácido fólico, Hierro',
        observaciones: 'Desarrollo fetal adecuado. Próximo control en 4 semanas.',
        doctorNombre: 'Dra. Laura Mendoza',
        temperatura: 36.9,
        peso: 68,
        presionSistolica: 110,
        presionDiastolica: 70,
        frecuenciaCardiaca: 78
      }
    ];

    this.registrosSubject.next(registrosEjemplo);
  }

  // Obtener todos los registros
  getRegistros(): RegistroMedico[] {
    return this.registrosSubject.value;
  }

  // Obtener registros por paciente ID
  getRegistrosPorPaciente(pacienteId: string): RegistroMedico[] {
    return this.registrosSubject.value
      .filter(r => r.pacienteId === pacienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Más recientes primero
  }

  // Obtener registro por ID
  getRegistroPorId(id: string): RegistroMedico | undefined {
    return this.registrosSubject.value.find(r => r.id === id);
  }

  // Agregar nuevo registro
  agregarRegistro(registro: Omit<RegistroMedico, 'id'>): void {
    const nuevoRegistro: RegistroMedico = {
      ...registro,
      id: this.generateId()
    };

    const registrosActuales = this.registrosSubject.value;
    this.registrosSubject.next([...registrosActuales, nuevoRegistro]);
  }

  // Actualizar registro
  actualizarRegistro(id: string, registroActualizado: Partial<RegistroMedico>): void {
    const registros = this.registrosSubject.value;
    const index = registros.findIndex(r => r.id === id);

    if (index !== -1) {
      registros[index] = { ...registros[index], ...registroActualizado };
      this.registrosSubject.next([...registros]);
    }
  }

  // Eliminar registro
  eliminarRegistro(id: string): void {
    const registros = this.registrosSubject.value.filter(r => r.id !== id);
    this.registrosSubject.next(registros);
  }

  // Obtener último registro de un paciente
  getUltimoRegistroPaciente(pacienteId: string): RegistroMedico | undefined {
    const registros = this.getRegistrosPorPaciente(pacienteId);
    return registros.length > 0 ? registros[0] : undefined;
  }

  // Contar registros de un paciente
  contarRegistrosPaciente(pacienteId: string): number {
    return this.registrosSubject.value.filter(r => r.pacienteId === pacienteId).length;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
