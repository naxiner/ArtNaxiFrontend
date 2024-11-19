import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../../models/register';
import { ToastrService } from 'ngx-toastr';

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
    private toastrService: ToastrService,
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
      error: (error) => {
        if (error.error.errors) {
          const validationErrors = error.error.errors;
          if (validationErrors.Password) {
            this.toastrService.error(validationErrors.Password.join(', '));
          }
        } else {
          this.toastrService.error(`Error: ${error.error.message}`);
        }
      }
    });
  }
}
