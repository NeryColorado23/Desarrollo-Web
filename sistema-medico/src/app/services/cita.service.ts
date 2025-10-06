import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Cita {
  id: string;
  pacienteId: string;
  paciente: string;
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

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasSubject = new BehaviorSubject<Cita[]>([]);
  public citas$ = this.citasSubject.asObservable();

  constructor() {
    this.cargarCitasEjemplo();
  }

  private cargarCitasEjemplo(): void {
    const citasEjemplo: Cita[] = [
      {
        id: '1',
        pacienteId: '1',
        paciente: 'Juan Pérez García',
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
        pacienteId: '2',
        paciente: 'María González López',
        doctor: 'Dra. Isabel Romero',
        especialidad: 'Pediatría',
        fecha: new Date(2024, 11, 16),
        hora: '10:30',
        tipoConsulta: 'primera-vez',
        estado: 'pendiente',
        motivoConsulta: 'Consulta por fiebre y malestar general',
        fechaCreacion: new Date()
      },
      {
        id: '3',
        pacienteId: '3',
        paciente: 'Carlos Rodríguez Martín',
        doctor: 'Dr. Antonio Méndez',
        especialidad: 'Cardiología',
        fecha: new Date(2024, 11, 17),
        hora: '14:00',
        tipoConsulta: 'urgencia',
        estado: 'confirmada',
        motivoConsulta: 'Dolor en el pecho',
        fechaCreacion: new Date()
      },
      {
        id: '4',
        pacienteId: '4',
        paciente: 'Ana Fernández Ruiz',
        doctor: 'Dr. Miguel Herrera',
        especialidad: 'Traumatología',
        fecha: new Date(2024, 11, 18),
        hora: '11:15',
        tipoConsulta: 'control',
        estado: 'completada',
        motivoConsulta: 'Seguimiento de lesión',
        fechaCreacion: new Date()
      }
    ];

    this.citasSubject.next(citasEjemplo);
  }

  getCitas(): Cita[] {
    return this.citasSubject.value;
  }

  getCitaPorId(id: string): Cita | undefined {
    return this.citasSubject.value.find((c: Cita) => c.id === id);
  }

  getCitasPorPaciente(pacienteId: string): Cita[] {
    return this.citasSubject.value.filter((c: Cita) => c.pacienteId === pacienteId);
  }

  getCitasPorDoctor(doctor: string): Cita[] {
    return this.citasSubject.value.filter((c: Cita) => c.doctor === doctor);
  }

  getCitasPorFecha(fecha: Date): Cita[] {
    return this.citasSubject.value.filter((c: Cita) =>
      this.isSameDay(new Date(c.fecha), fecha)
    );
  }

  getCitasPorRangoFechas(fechaInicio: Date, fechaFin: Date): Cita[] {
    return this.citasSubject.value.filter((c: Cita) => {
      const citaFecha = new Date(c.fecha);
      return citaFecha >= fechaInicio && citaFecha <= fechaFin;
    });
  }

  agregarCita(cita: Omit<Cita, 'id' | 'fechaCreacion'>): Cita {
    const nuevaCita: Cita = {
      ...cita,
      id: this.generateId(),
      fechaCreacion: new Date()
    };

    const citasActuales = this.citasSubject.value;
    this.citasSubject.next([...citasActuales, nuevaCita]);

    return nuevaCita;
  }

  actualizarCita(id: string, citaActualizada: Partial<Cita>): void {
    const citas = this.citasSubject.value;
    const index = citas.findIndex((c: Cita) => c.id === id);

    if (index !== -1) {
      citas[index] = { ...citas[index], ...citaActualizada };
      this.citasSubject.next([...citas]);
    }
  }

  cancelarCita(id: string, observacion?: string): void {
    const citas = this.citasSubject.value;
    const index = citas.findIndex((c: Cita) => c.id === id);

    if (index !== -1) {
      const observacionActualizada = (citas[index].observaciones || '') +
        `\n[${new Date().toLocaleDateString()}] Cita cancelada.` +
        (observacion ? ` ${observacion}` : '');

      citas[index] = {
        ...citas[index],
        estado: 'cancelada',
        observaciones: observacionActualizada
      };

      this.citasSubject.next([...citas]);
    }
  }

  eliminarCita(id: string): void {
    const citas = this.citasSubject.value.filter((c: Cita) => c.id !== id);
    this.citasSubject.next(citas);
  }

  cambiarEstadoCita(id: string, estado: Cita['estado']): void {
    this.actualizarCita(id, { estado });
  }

  contarCitasPorEstado(estado: Cita['estado']): number {
    return this.citasSubject.value.filter((c: Cita) => c.estado === estado).length;
  }

  isHorarioDisponible(fecha: Date, hora: string, doctor: string): boolean {
    const citasEnFecha = this.getCitasPorFecha(fecha);
    return !citasEnFecha.some((c: Cita) => c.hora === hora && c.doctor === doctor);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
