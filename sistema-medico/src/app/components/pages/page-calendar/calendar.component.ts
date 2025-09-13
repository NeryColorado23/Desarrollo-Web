import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// Services
import { CalendarService, MonthView, CalendarDay, CalendarCita } from '../../../services/calendar.service';
import { DoctorService, Doctor } from '../../../services/doctor.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  monthView: MonthView | null = null;
  selectedDate: Date | null = null;
  selectedDoctor = '';
  dayNames: string[] = [];

  // Vista actual del calendario
  currentViewDate: Date = new Date();

  // Datos de doctores
  doctores: Doctor[] = [];

  // Citas del día seleccionado
  selectedDateCitas: CalendarCita[] = [];

  constructor(
    private calendarService: CalendarService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctores();
    this.setupSubscriptions();
    this.dayNames = this.calendarService.getDayNames();
    this.updateCalendarView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctores(): void {
    this.doctores = this.doctorService.getDoctoresActivos();
  }

  private setupSubscriptions(): void {
    // Combinar los observables del servicio para actualizar la vista
    combineLatest([
      this.calendarService.currentDate$,
      this.calendarService.selectedDoctor$,
      this.calendarService.citas$
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([currentDate, selectedDoctor, citas]) => {
      this.currentViewDate = currentDate;
      this.selectedDoctor = selectedDoctor;
      this.updateCalendarView();
      this.cdr.detectChanges();
    });
  }

  private updateCalendarView(): void {
    this.monthView = this.calendarService.getMonthView(this.currentViewDate);
  }

  // Navegación del calendario
  previousMonth(): void {
    this.calendarService.previousMonth();
  }

  nextMonth(): void {
    this.calendarService.nextMonth();
  }

  goToToday(): void {
    this.calendarService.goToToday();
  }

  // Selección de doctor
  onDoctorChange(doctor: string): void {
    this.calendarService.setSelectedDoctor(doctor);
  }

  // Selección de día
  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth || day.isPast) return;

    this.selectedDate = day.date;
    this.selectedDateCitas = day.citas;
    this.cdr.detectChanges();
  }

  // Obtener el tooltip para un día
  getDayTooltip(day: CalendarDay): string {
    if (!day.isCurrentMonth) return '';

    const citasCount = day.citas.length;
    if (citasCount === 0) {
      return day.hasAvailableSlots ? 'Disponible para citas' : 'Sin disponibilidad';
    }

    const citasText = citasCount === 1 ? '1 cita' : `${citasCount} citas`;
    return `${citasText} programada${citasCount === 1 ? '' : 's'}`;
  }

  // Obtener las clases CSS para un día
  getDayClasses(day: CalendarDay): string[] {
    const classes: string[] = ['calendar-day'];

    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.isPast) classes.push('past');
    if (day.citas.length > 0) classes.push('has-citas');
    if (day.hasAvailableSlots) classes.push('available');
    if (this.selectedDate && this.isSameDay(day.date, this.selectedDate)) {
      classes.push('selected');
    }

    return classes;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Obtener el color del chip según el estado de la cita
  getEstadoColor(estado: string): string {
    const colors: { [key: string]: string } = {
      'pendiente': 'warn',
      'confirmada': 'primary',
      'completada': 'accent',
      'cancelada': ''
    };
    return colors[estado] || '';
  }

  // Formatear fecha para mostrar
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Obtener el texto del estado
  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado] || estado;
  }

  // Obtener estadísticas rápidas del mes
  getMonthStats(): { total: number; confirmadas: number; pendientes: number } {
    if (!this.monthView) return { total: 0, confirmadas: 0, pendientes: 0 };

    let total = 0;
    let confirmadas = 0;
    let pendientes = 0;

    this.monthView.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.isCurrentMonth) {
          total += day.citas.length;
          confirmadas += day.citas.filter(c => c.estado === 'confirmada').length;
          pendientes += day.citas.filter(c => c.estado === 'pendiente').length;
        }
      });
    });

    return { total, confirmadas, pendientes };
  }

  // Limpiar selección
  clearSelection(): void {
    this.selectedDate = null;
    this.selectedDateCitas = [];
    this.cdr.detectChanges();
  }
}
