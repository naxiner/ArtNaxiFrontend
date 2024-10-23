import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoginDTO } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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
        console.log(response);
        if (response.token) {
          this.authService.setToken(response.token);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Error: ${err.status}`;
      }
    });
  }

} 
