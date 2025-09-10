import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Doctor {
  id: string;
  nombreCompleto: string;
  cedula: string;
  especialidad: string;
  subespecialidad?: string;
  tiempoExperiencia: number; // en años
  email: string;
  telefono: string;
  direccionConsultorio?: string;
  numeroLicencia: string;
  universidad: string;
  fechaGraduacion: Date;
  // Horarios de trabajo
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

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctoresSubject = new BehaviorSubject<Doctor[]>([]);
  public doctores$ = this.doctoresSubject.asObservable();

  private especialidades = [
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

  constructor() {
    this.cargarDoctoresEjemplo();
  }

  private cargarDoctoresEjemplo(): void {
    const doctoresEjemplo: Doctor[] = [
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
      },
      {
        id: '3',
        nombreCompleto: 'Dr. Miguel Herrera',
        cedula: 'DOC003',
        especialidad: 'Traumatología',
        subespecialidad: 'Cirugía de Columna',
        tiempoExperiencia: 20,
        email: 'miguel.herrera@hospital.com',
        telefono: '555-1003',
        direccionConsultorio: 'Consultorio 102, Planta Baja',
        numeroLicencia: 'MED-12347',
        universidad: 'Facultad de Medicina Nacional',
        fechaGraduacion: new Date(2004, 3, 10),
        horarios: {
          lunes: { inicio: '09:00', fin: '18:00', activo: true },
          martes: { inicio: '09:00', fin: '18:00', activo: true },
          miercoles: { inicio: '09:00', fin: '18:00', activo: true },
          jueves: { inicio: '09:00', fin: '18:00', activo: true },
          viernes: { inicio: '09:00', fin: '17:00', activo: true },
          sabado: { inicio: '09:00', fin: '13:00', activo: true },
          domingo: { inicio: '00:00', fin: '00:00', activo: false }
        },
        horasDisponibles: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
        estado: 'activo',
        fechaRegistro: new Date(2024, 2, 5),
        observaciones: 'Cirujano ortopédico con especialización en columna vertebral'
      }
    ];

    this.doctoresSubject.next(doctoresEjemplo);
  }

  // CRUD Operations
  getDoctores(): Doctor[] {
    return this.doctoresSubject.value;
  }

  getDoctorPorId(id: string): Doctor | undefined {
    return this.doctoresSubject.value.find(d => d.id === id);
  }

  agregarDoctor(doctor: Omit<Doctor, 'id' | 'fechaRegistro'>): void {
    const nuevoDoctor: Doctor = {
      ...doctor,
      id: this.generateId(),
      fechaRegistro: new Date()
    };

    const doctoresActuales = this.doctoresSubject.value;
    this.doctoresSubject.next([...doctoresActuales, nuevoDoctor]);
  }

  actualizarDoctor(id: string, doctorActualizado: Partial<Doctor>): void {
    const doctores = this.doctoresSubject.value;
    const index = doctores.findIndex(d => d.id === id);

    if (index !== -1) {
      doctores[index] = { ...doctores[index], ...doctorActualizado };
      this.doctoresSubject.next([...doctores]);
    }
  }

  eliminarDoctor(id: string): void {
    const doctores = this.doctoresSubject.value.filter(d => d.id !== id);
    this.doctoresSubject.next(doctores);
  }

  // Métodos de utilidad
  getDoctoresPorEspecialidad(especialidad: string): Doctor[] {
    return this.doctoresSubject.value.filter(d => d.especialidad === especialidad);
  }

  getDoctoresActivos(): Doctor[] {
    return this.doctoresSubject.value.filter(d => d.estado === 'activo');
  }

  buscarDoctores(termino: string): Doctor[] {
    const terminoLower = termino.toLowerCase();
    return this.doctoresSubject.value.filter(doctor =>
      doctor.nombreCompleto.toLowerCase().includes(terminoLower) ||
      doctor.especialidad.toLowerCase().includes(terminoLower) ||
      doctor.email.toLowerCase().includes(terminoLower) ||
      doctor.numeroLicencia.toLowerCase().includes(terminoLower)
    );
  }

  getEspecialidades(): string[] {
    return this.especialidades;
  }

  getNombresDoctores(): string[] {
    return this.doctoresSubject.value.map(d => d.nombreCompleto);
  }

  getDoctorPorNombre(nombreCompleto: string): Doctor | undefined {
    return this.doctoresSubject.value.find(d => d.nombreCompleto === nombreCompleto);
  }

  // Métodos para horarios
  getHorasDisponiblesDoctor(doctorId: string, dia: string): string[] {
    const doctor = this.getDoctorPorId(doctorId);
    if (!doctor) return [];

    return doctor.horasDisponibles || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
