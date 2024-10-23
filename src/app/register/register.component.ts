import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterDTO } from '../../models/register';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Error: ${err.status}`;
      }
    });
  }
}
