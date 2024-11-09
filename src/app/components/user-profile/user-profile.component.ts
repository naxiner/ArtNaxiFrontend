import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserProfileEditComponent } from "../user-profile-edit/user-profile-edit.component";
import { UserProfileImagesComponent } from '../user-profile-images/user-profile-images.component';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { UserDataService } from '../../services/user-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserProfileEditComponent, UserProfileImagesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  baseUrl = environment.baseUrl;
  user: any;
  userId: string = '';
  currentUserRole: string = '';
  isAllowToDelete = false;
  isAllowToEdit = false;
  isEditingProfile = false;

  errorMessage: string = "";

  publicImageCount = 0;

  constructor (
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private userDataService: UserDataService,
    private route: ActivatedRoute
  ) {
    this.userDataService.username$.subscribe(username => {
      this.user.username = username;
    });

    this.userDataService.email$.subscribe(email => {
      this.user.email = email;
    });
  
    this.userDataService.avatarUrl$.subscribe(avatarUrl => {
      this.user.profilePictureUrl = avatarUrl;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') ?? '';
      this.currentUserRole = this.authService.getUserRoleFromToken() ?? 'User';
      const currentUserId = this.authService.getUserIdFromToken() ?? '';

      if (this.userId == currentUserId || this.currentUserRole == 'Admin') {
        this.isAllowToDelete = true;
      }

      if (this.userId == currentUserId) {
        this.isAllowToEdit = true;
      }

      this.loadUserProfile(this.userId);
      this.getPublicImageCount(this.userId);
    });
  }

  loadUserProfile(id: string): void {
    this.userProfileService.getUserProfile(id).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error loading user profile', error);
      }
    );
  }

  getPublicImageCount(id: string): void {
    this.userProfileService.getPublicImageCount(id).subscribe(
      (response) => {
        this.publicImageCount = response.publicImageCount;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  editProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  onProfileUpdated(updatedUser: any) {
    this.user = updatedUser;
  }

  onCancelEdit() {
    this.isEditingProfile = false;
  }
}
