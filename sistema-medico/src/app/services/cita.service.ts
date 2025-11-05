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

export interface ValidacionCita {
  valido: boolean;
  mensaje?: string;
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

  /**
   * Valida si se puede agendar una cita en la fecha, hora y doctor especificados
   * @param fecha Fecha de la cita
   * @param hora Hora de la cita
   * @param doctor Nombre del doctor
   * @param citaIdExcluir ID de cita a excluir (útil para edición)
   * @returns Objeto con validación y mensaje de error si aplica
   */
  validarDisponibilidadCita(
    fecha: Date,
    hora: string,
    doctor: string,
    citaIdExcluir?: string
  ): ValidacionCita {
    // Obtener citas activas (no canceladas) del doctor en esa fecha
    const citasEnFecha = this.getCitasPorFecha(fecha).filter(
      (c: Cita) =>
        c.doctor === doctor &&
        c.estado !== 'cancelada' &&
        c.id !== citaIdExcluir // Excluir la cita actual si estamos editando
    );

    // Verificar si ya existe una cita a esa hora
    const citaConflicto = citasEnFecha.find((c: Cita) => c.hora === hora);

    if (citaConflicto) {
      return {
        valido: false,
        mensaje: `El doctor ${doctor} ya tiene una cita agendada el ${this.formatearFechaCorta(fecha)} a las ${hora} con ${citaConflicto.paciente}. Por favor, seleccione otro horario.`
      };
    }

    // Validar que la fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCita = new Date(fecha);
    fechaCita.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      return {
        valido: false,
        mensaje: 'No se pueden agendar citas en fechas pasadas.'
      };
    }

    return { valido: true };
  }

  agregarCita(cita: Omit<Cita, 'id' | 'fechaCreacion'>): { exito: boolean; mensaje: string; cita?: Cita } {
    // Validar disponibilidad antes de agregar
    const validacion = this.validarDisponibilidadCita(
      cita.fecha,
      cita.hora,
      cita.doctor
    );

    if (!validacion.valido) {
      return {
        exito: false,
        mensaje: validacion.mensaje || 'No se puede agendar la cita'
      };
    }

    const nuevaCita: Cita = {
      ...cita,
      id: this.generateId(),
      fechaCreacion: new Date()
    };

    const citasActuales = this.citasSubject.value;
    this.citasSubject.next([...citasActuales, nuevaCita]);

    return {
      exito: true,
      mensaje: 'Cita agendada exitosamente',
      cita: nuevaCita
    };
  }

  actualizarCita(id: string, citaActualizada: Partial<Cita>): { exito: boolean; mensaje: string } {
    const citas = this.citasSubject.value;
    const index = citas.findIndex((c: Cita) => c.id === id);

    if (index === -1) {
      return {
        exito: false,
        mensaje: 'Cita no encontrada'
      };
    }

    const citaOriginal = citas[index];

    // Si se está cambiando la fecha, hora o doctor, validar disponibilidad
    if (citaActualizada.fecha || citaActualizada.hora || citaActualizada.doctor) {
      const fechaFinal = citaActualizada.fecha || citaOriginal.fecha;
      const horaFinal = citaActualizada.hora || citaOriginal.hora;
      const doctorFinal = citaActualizada.doctor || citaOriginal.doctor;

      const validacion = this.validarDisponibilidadCita(
        fechaFinal,
        horaFinal,
        doctorFinal,
        id // Excluir la cita actual de la validación
      );

      if (!validacion.valido) {
        return {
          exito: false,
          mensaje: validacion.mensaje || 'No se puede actualizar la cita'
        };
      }
    }

    citas[index] = { ...citaOriginal, ...citaActualizada };
    this.citasSubject.next([...citas]);

    return {
      exito: true,
      mensaje: 'Cita actualizada exitosamente'
    };
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

  isHorarioDisponible(fecha: Date, hora: string, doctor: string, citaIdExcluir?: string): boolean {
    const validacion = this.validarDisponibilidadCita(fecha, hora, doctor, citaIdExcluir);
    return validacion.valido;
  }

  /**
   * Obtiene las horas ocupadas para un doctor en una fecha específica
   */
  getHorasOcupadas(fecha: Date, doctor: string, citaIdExcluir?: string): string[] {
    const citasEnFecha = this.getCitasPorFecha(fecha).filter(
      (c: Cita) =>
        c.doctor === doctor &&
        c.estado !== 'cancelada' &&
        c.id !== citaIdExcluir
    );

    return citasEnFecha.map((c: Cita) => c.hora);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private formatearFechaCorta(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
