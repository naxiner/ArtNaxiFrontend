import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
    private router: Router
  ) {}

  loginData: LoginDTO = {
    usernameOrEmail: '',
    password: ''
  };

  errorMessage: string = "";

  onSubmit(): void {
    this.authService.loginUser(this.loginData).subscribe({
      next: (response) => {
        this.authService.handleAuthentication(response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 400) {
          if (err.error.errors) {
            const validationErrors = err.error.errors;
            if (validationErrors.Password) {
              this.errorMessage = validationErrors.Password.join(', ');
            } else {
              this.errorMessage = 'Validation error occurred';
            }
          } else {
            this.errorMessage = err.error || 'Bad Request';
          }
        }
      
        else if (err.status === 401) {
          this.errorMessage = err.error || 'Invalid Username or Password';
        }
      
        else {
          this.errorMessage = `Error: ${err.message}`;
        }
      }
    });
  }

} 
