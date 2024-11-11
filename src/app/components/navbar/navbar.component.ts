import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  userId: string | null = null;
  username: string | null = null;
  userAvatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private userDataService: UserDataService
  ) {
    this.userDataService.username$.subscribe(username => {
      this.username = username;
    });
    
    this.userDataService.avatarUrl$.subscribe(avatarUrl => {
      this.userAvatarUrl = avatarUrl;
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
      if (authStatus) {
        this.userId = this.authService.getUserIdFromToken();
        this.username = this.authService.getUserNameFromToken();
        
        if (this.authService.getUserRoleFromToken() === 'Admin') {
          this.isAdmin = true;
        }
        
        if (!this.userAvatarUrl && this.userId) {
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
