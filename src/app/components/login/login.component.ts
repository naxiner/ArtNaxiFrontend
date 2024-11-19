import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDTO } from '../../../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  loginData: LoginDTO = {
    usernameOrEmail: '',
    password: ''
  };

  onSubmit(): void {
    this.authService.loginUser(this.loginData).subscribe({
      next: (response) => {
        this.authService.handleAuthentication(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.status === 400) {
          if (error.error.errors) {
            const validationErrors = error.error.errors;
            if (validationErrors.Password) {
              this.toastrService.error(validationErrors.Password.join(', '));
            } else {
              this.toastrService.error('Validation error occurred', 'Error');
            }
          } else {
            this.toastrService.error(error.error.message, 'Error');
          }
        }
      
        else if (error.status === 401) {
          this.toastrService.error(error.error.message, 'Error');
        }

        else if (error.status === 403) {
          this.toastrService.error('Your account has been banned.', 'Error');
        }
      
        else {
          this.toastrService.error(error.error.message, 'Error');
        }
      }
    });
  }
} 
