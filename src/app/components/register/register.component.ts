import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../../models/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registerData: RegisterDTO = {
    username: '',
    email: '',
    password: ''
  };

  errorMessage: string = "";
  
  onSubmit(): void {
    this.authService.registerUser(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        if (err.error.errors) {
          const validationErrors = err.error.errors;
          if (validationErrors.Password) {
            this.errorMessage = validationErrors.Password.join(', ');
          }
        } else {
          this.errorMessage = `Error: ${err.error.message}`;
        }
      }
    });
  }
}
