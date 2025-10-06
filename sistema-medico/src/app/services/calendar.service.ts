import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CitaService, Cita } from './cita.service';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  citas: Cita[];
  hasAvailableSlots: boolean;
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
  private selectedDoctorSubject = new BehaviorSubject<string>('');

  currentDate$ = this.currentDateSubject.asObservable();
  selectedDoctor$ = this.selectedDoctorSubject.asObservable();

  private monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  private dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(private citaService: CitaService) {}

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

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayToShow = new Date(firstDayOfMonth);
    firstDayToShow.setDate(firstDayToShow.getDate() - firstDayOfMonth.getDay());

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

  private getCitasForDate(date: Date): Cita[] {
    const selectedDoctor = this.selectedDoctorSubject.value;
    let citas = this.citaService.getCitasPorFecha(date);

    // Filtrar por doctor si hay uno seleccionado
    if (selectedDoctor) {
      citas = citas.filter((c: Cita) => c.doctor === selectedDoctor);
    }

    return citas;
  }

  private hasAvailableSlotsForDate(date: Date): boolean {
    const citas = this.getCitasForDate(date);
    const maxCitasPerDay = 8;
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
}
