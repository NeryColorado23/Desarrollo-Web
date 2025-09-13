import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  citas: CalendarCita[];
  hasAvailableSlots: boolean;
}

export interface CalendarCita {
  id: string;
  paciente: string;
  doctor: string;
  especialidad: string;
  hora: string;
  tipoConsulta: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  motivoConsulta?: string;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface MonthView {
  year: number;
  month: number;
  monthName: string;
  weeks: CalendarWeek[];
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  private citasSubject = new BehaviorSubject<CalendarCita[]>([]);
  private selectedDoctorSubject = new BehaviorSubject<string>('');

  currentDate$ = this.currentDateSubject.asObservable();
  citas$ = this.citasSubject.asObservable();
  selectedDoctor$ = this.selectedDoctorSubject.asObservable();

  private monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  private dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor() {
    this.initializeExampleCitas();
  }

  private initializeExampleCitas(): void {
    const today = new Date();
    const exampleCitas: CalendarCita[] = [
      {
        id: '1',
        paciente: 'Ana García López',
        doctor: 'Dr. Antonio Méndez',
        especialidad: 'Cardiología',
        hora: '09:00',
        tipoConsulta: 'control',
        estado: 'confirmada',
        motivoConsulta: 'Revisión rutinaria'
      },
      {
        id: '2',
        paciente: 'Carlos Rodríguez',
        doctor: 'Dra. Isabel Romero',
        especialidad: 'Pediatría',
        hora: '10:30',
        tipoConsulta: 'primera-vez',
        estado: 'pendiente',
        motivoConsulta: 'Consulta por fiebre'
      },
      {
        id: '3',
        paciente: 'María Fernández',
        doctor: 'Dr. Antonio Méndez',
        especialidad: 'Cardiología',
        hora: '14:00',
        tipoConsulta: 'urgencia',
        estado: 'confirmada',
        motivoConsulta: 'Dolor en el pecho'
      },
      {
        id: '4',
        paciente: 'Pedro Martínez',
        doctor: 'Dr. Luis Herrera',
        especialidad: 'Neurología',
        hora: '11:15',
        tipoConsulta: 'control',
        estado: 'completada',
        motivoConsulta: 'Seguimiento migraña'
      }
    ];

    this.citasSubject.next(exampleCitas);
  }

  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }

  setCurrentDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  setSelectedDoctor(doctor: string): void {
    this.selectedDoctorSubject.next(doctor);
  }

  getSelectedDoctor(): string {
    return this.selectedDoctorSubject.value;
  }

  nextMonth(): void {
    const currentDate = this.currentDateSubject.value;
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    this.currentDateSubject.next(nextMonth);
  }

  previousMonth(): void {
    const currentDate = this.currentDateSubject.value;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    this.currentDateSubject.next(prevMonth);
  }

  goToToday(): void {
    this.currentDateSubject.next(new Date());
  }

  getMonthView(date: Date): MonthView {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = this.monthNames[month];

    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Primer día a mostrar (puede ser del mes anterior)
    const firstDayToShow = new Date(firstDayOfMonth);
    firstDayToShow.setDate(firstDayToShow.getDate() - firstDayOfMonth.getDay());

    // Último día a mostrar (puede ser del mes siguiente)
    const lastDayToShow = new Date(lastDayOfMonth);
    const daysToAdd = 6 - lastDayOfMonth.getDay();
    lastDayToShow.setDate(lastDayToShow.getDate() + daysToAdd);

    const weeks: CalendarWeek[] = [];
    const currentWeekDays: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDay = new Date(firstDayToShow);

    while (currentDay <= lastDayToShow) {
      const dayDate = new Date(currentDay);
      const isCurrentMonth = dayDate.getMonth() === month;
      const isToday = dayDate.getTime() === today.getTime();
      const isPast = dayDate < today;

      const dayCitas = this.getCitasForDate(dayDate);
      const hasAvailableSlots = this.hasAvailableSlotsForDate(dayDate);

      const calendarDay: CalendarDay = {
        date: dayDate,
        isCurrentMonth,
        isToday,
        isPast,
        citas: dayCitas,
        hasAvailableSlots
      };

      currentWeekDays.push(calendarDay);

      if (currentWeekDays.length === 7) {
        weeks.push({ days: [...currentWeekDays] });
        currentWeekDays.length = 0;
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return {
      year,
      month,
      monthName,
      weeks
    };
  }

  private getCitasForDate(date: Date): CalendarCita[] {
    const citas = this.citasSubject.value;
    const selectedDoctor = this.selectedDoctorSubject.value;

    // Simulamos que tenemos citas en fechas específicas
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    let dateCitas: CalendarCita[] = [];

    if (this.isSameDay(date, today)) {
      dateCitas = citas.filter(c => selectedDoctor ? c.doctor === selectedDoctor : true).slice(0, 2);
    } else if (this.isSameDay(date, tomorrow)) {
      dateCitas = citas.filter(c => selectedDoctor ? c.doctor === selectedDoctor : true).slice(1, 3);
    } else if (this.isSameDay(date, dayAfterTomorrow)) {
      dateCitas = citas.filter(c => selectedDoctor ? c.doctor === selectedDoctor : true).slice(2, 4);
    }

    return dateCitas;
  }

  private hasAvailableSlotsForDate(date: Date): boolean {
    const citas = this.getCitasForDate(date);
    const maxCitasPerDay = 8; // Asumimos máximo 8 citas por día
    return citas.length < maxCitasPerDay && !this.isPast(date);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  getDayNames(): string[] {
    return this.dayNames;
  }

  addCita(cita: CalendarCita): void {
    const currentCitas = this.citasSubject.value;
    this.citasSubject.next([...currentCitas, cita]);
  }

  updateCita(cita: CalendarCita): void {
    const currentCitas = this.citasSubject.value;
    const index = currentCitas.findIndex(c => c.id === cita.id);
    if (index !== -1) {
      currentCitas[index] = cita;
      this.citasSubject.next([...currentCitas]);
    }
  }

  deleteCita(citaId: string): void {
    const currentCitas = this.citasSubject.value;
    const filteredCitas = currentCitas.filter(c => c.id !== citaId);
    this.citasSubject.next(filteredCitas);
  }

  getCitasForDateRange(startDate: Date, endDate: Date): CalendarCita[] {
    // Esta función podría usarse para obtener citas en un rango de fechas
    const citas = this.citasSubject.value;
    return citas.filter(cita => {
      // Por ahora retornamos todas las citas, pero aquí podrías filtrar por fechas
      return true;
    });
  }
}
