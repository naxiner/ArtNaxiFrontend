import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userId: string | null = null;
  username: string | null = null;

  constructor(private authService: AuthService) {}

    ngOnInit(): void {
      this.authService.isAuthenticated$.subscribe((authStatus: boolean) => {
        this.isAuthenticated = authStatus;
        if (authStatus) {
          this.userId = this.authService.getUserIdFromToken();
          this.username = this.authService.getUserNameFromToken();
        }
      });
    }

  logout(): void {
    this.authService.logout();
  }
}
