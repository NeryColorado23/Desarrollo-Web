import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export interface ReportData {
  citasTotal: number;
  citasCompletadas: number;
  citasCanceladas: number;
  citasPendientes: number;
  pacientesTotal: number;
  pacientesNuevos: number;
  doctoresActivos: number;
  ingresosMensuales: number;
  tasaOcupacion: number;
}

export interface CitaReporte {
  id: string;
  paciente: string;
  doctor: string;
  fecha: Date;
  hora: string;
  especialidad: string;
  estado: 'completada' | 'pendiente' | 'cancelada';
  monto?: number;
}

@Component({
  selector: 'app-page-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './page-reports.component.html',
  styleUrls: ['./page-reports.component.scss']
})
export class PageReportsComponent implements OnInit {
  @ViewChild('citasChart') citasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('especialidadesChart') especialidadesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosChart') ingresosChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pacientesChart') pacientesChartRef!: ElementRef<HTMLCanvasElement>;

  // Forms
  filtrosForm!: FormGroup;

  // Data
  reportData: ReportData = {
    citasTotal: 1234,
    citasCompletadas: 987,
    citasCanceladas: 123,
    citasPendientes: 124,
    pacientesTotal: 456,
    pacientesNuevos: 78,
    doctoresActivos: 12,
    ingresosMensuales: 125000,
    tasaOcupacion: 85
  };

  citasReporte: CitaReporte[] = [];
  displayedColumns: string[] = ['id', 'paciente', 'doctor', 'fecha', 'hora', 'especialidad', 'estado', 'monto', 'acciones'];

  // Estados
  loading = false;
  selectedTab = 0;
  periodoSeleccionado = 'mes';

  // Charts
  citasChart: any;
  especialidadesChart: any;
  ingresosChart: any;
  pacientesChart: any;

  // Opciones de filtros
  periodos = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mes' },
    { value: 'trimestre', label: 'Este Trimestre' },
    { value: 'año', label: 'Este Año' },
    { value: 'personalizado', label: 'Personalizado' }
  ];

  especialidades = [
    'Todas',
    'Cardiología',
    'Pediatría',
    'Traumatología',
    'Neurología',
    'Dermatología'
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadReportData();
    this.generateSampleData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  initializeForms(): void {
    this.filtrosForm = this.fb.group({
      periodo: ['mes'],
      fechaInicio: [new Date()],
      fechaFin: [new Date()],
      especialidad: ['Todas'],
      doctor: ['Todos']
    });

    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  loadReportData(): void {
    this.loading = true;
    // Simular carga de datos
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  generateSampleData(): void {
    // Generar datos de ejemplo para la tabla
    for (let i = 1; i <= 50; i++) {
      this.citasReporte.push({
        id: `CIT-${String(i).padStart(4, '0')}`,
        paciente: `Paciente ${i}`,
        doctor: `Dr. ${['Méndez', 'Romero', 'García', 'López'][i % 4]}`,
        fecha: new Date(2024, 0, Math.floor(Math.random() * 28) + 1),
        hora: `${9 + (i % 8)}:00`,
        especialidad: this.especialidades[Math.floor(Math.random() * 5) + 1],
        estado: ['completada', 'pendiente', 'cancelada'][Math.floor(Math.random() * 3)] as any,
        monto: Math.floor(Math.random() * 500) + 100
      });
    }
  }

  initializeCharts(): void {
    this.createCitasChart();
    this.createEspecialidadesChart();
    this.createIngresosChart();
    this.createPacientesChart();
  }

  createCitasChart(): void {
    if (this.citasChartRef) {
      const ctx = this.citasChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.citasChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
              label: 'Citas Completadas',
              data: [65, 78, 90, 81, 96, 105],
              borderColor: '#2dce89',
              backgroundColor: 'rgba(45, 206, 137, 0.1)',
              tension: 0.4
            }, {
              label: 'Citas Canceladas',
              data: [15, 22, 18, 25, 20, 15],
              borderColor: '#f5365c',
              backgroundColor: 'rgba(245, 54, 92, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }
  }

  createEspecialidadesChart(): void {
    if (this.especialidadesChartRef) {
      const ctx = this.especialidadesChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.especialidadesChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Cardiología', 'Pediatría', 'Traumatología', 'Neurología', 'Otros'],
            datasets: [{
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                '#5e72e4',
                '#2dce89',
                '#fb6340',
                '#11cdef',
                '#8965e0'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }
    }
  }

  createIngresosChart(): void {
    if (this.ingresosChartRef) {
      const ctx = this.ingresosChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.ingresosChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
              label: 'Ingresos ($)',
              data: [95000, 105000, 98000, 112000, 125000, 118000],
              backgroundColor: '#5e72e4'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  createPacientesChart(): void {
    if (this.pacientesChartRef) {
      const ctx = this.pacientesChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.pacientesChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Nuevos', 'Recurrentes', 'Referidos', 'Emergencias', 'Consultas'],
            datasets: [{
              label: 'Este Mes',
              data: [78, 90, 65, 40, 85],
              borderColor: '#5e72e4',
              backgroundColor: 'rgba(94, 114, 228, 0.2)'
            }, {
              label: 'Mes Anterior',
              data: [65, 85, 70, 35, 80],
              borderColor: '#8965e0',
              backgroundColor: 'rgba(137, 101, 224, 0.2)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  }

  aplicarFiltros(): void {
    this.loading = true;
    setTimeout(() => {
      this.loadReportData();
      this.updateCharts();
    }, 500);
  }

  updateCharts(): void {
    // Actualizar datos de los gráficos
    if (this.citasChart) {
      this.citasChart.update();
    }
  }

  exportarPDF(): void {
    console.log('Exportando a PDF...');
    // Implementar exportación a PDF
  }

  exportarExcel(): void {
    console.log('Exportando a Excel...');
    // Implementar exportación a Excel
  }

  imprimirReporte(): void {
    window.print();
  }

  verDetalleCita(cita: CitaReporte): void {
    console.log('Ver detalle de cita:', cita);
  }

  getEstadoColor(estado: string): string {
    switch(estado) {
      case 'completada': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelada': return 'danger';
      default: return '';
    }
  }

  calcularPorcentajeCambio(actual: number, anterior: number): number {
    if (anterior === 0) return 100;
    return ((actual - anterior) / anterior) * 100;
  }
}
