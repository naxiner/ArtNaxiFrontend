import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditUserRequest } from '../../../models/edit-user-request';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: any;
  @Input() avatarPreview!: string;
  @Output() profileUpdated = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<void>();

  errorMessage: string = "";

  editUserRequest: EditUserRequest = {
    username: '',
    email: '',
    password: '',
    newPassword: ''
  }
  
  selectedFile: File | null = null;

  constructor(
    private userService: UserService, 
    private userProfileService: UserProfileService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.editUserRequest.username = this.user.username;
    this.editUserRequest.email = this.user.email;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size should not exceed 5MB.';
        return;
      }

      if (!file.type.match(/image\/(jpeg|png)/)) {
        this.errorMessage = 'Only image files (JPEG, PNG) are allowed.';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddProfileImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatarFile', this.selectedFile);

      this.userProfileService.updateProfileAvatar(this.userId, formData).subscribe({
        next: (response) => {
          this.userDataService.setAvatarUrl(response.profilePictureUrl);
          this.profileUpdated.emit(this.user);
          this.avatarPreview = '';
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error uploading profile image', error);
          this.errorMessage = 'Error uploading profile image.';
        }
      });
    }
  }

  onEditSubmit(): void {
    this.userService.editUser(this.userId, this.editUserRequest).subscribe({
      next: () => {
        this.userDataService.setUsername(this.editUserRequest.username);
        this.userDataService.setEmail(this.editUserRequest.email);
        this.profileUpdated.emit(this.user);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error updating profile.';
      }
    });
  }

  onDelete(): void {
    this.userProfileService.deleteUserAvatar(this.userId).subscribe({
      next: () => {
        const defaultAvatarUrl = '/default-avatar-512.png';
        this.userDataService.setAvatarUrl(defaultAvatarUrl);
        this.avatarPreview = '';
        this.profileUpdated.emit(this.user);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error deleting profile image.';
      }
    });
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}
