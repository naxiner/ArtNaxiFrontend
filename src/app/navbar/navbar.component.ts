import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileService } from '../user-profile.service';

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
  userAvatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {}

    ngOnInit(): void {
      this.authService.isAuthenticated$.subscribe((authStatus: boolean) => {
        this.isAuthenticated = authStatus;
        if (authStatus) {
          this.userId = this.authService.getUserIdFromToken();
          this.username = this.authService.getUserNameFromToken();
          if (this.userId) {
            this.userProfileService.getUserProfileAvatar(this.userId).subscribe((response: { userAvatarUrl: string }) => {
              this.userAvatarUrl = response.userAvatarUrl;
            });
          }
        }
      });
    }

  logout(): void {
    this.authService.logout();
  }
}
