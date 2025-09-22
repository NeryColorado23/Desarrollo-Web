import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-page-central',
  imports: [CommonModule, FormsModule],
  templateUrl: './page-central.component.html',
  styleUrls: ['./page-central.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCentralComponent {
  credentials = {
    username: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  hasError = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Si ya está autenticado, redirigir al home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.hasError = false;
    this.errorMessage = '';

    // Validar campos requeridos
    if (!this.credentials.username || !this.credentials.password) {
      this.hasError = true;
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials.username, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Login exitoso - redirigir al home
            this.router.navigate(['/home']);
          } else {
            // Error de login
            this.hasError = true;
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Error interno del servidor';
          console.error('Error en login:', error);
        }
      });
  }
}
