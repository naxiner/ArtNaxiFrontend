import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EditUserRequest } from '../../../models/edit-user-request';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { UserDataService } from '../../services/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { DefaultAvatar } from '../../../constants/default-avatar-url';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, SweetAlert2Module],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: any;
  @Input() avatarPreview!: string;
  @Output() profileUpdated = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<void>();

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
    private userDataService: UserDataService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.editUserRequest.username = this.user.username;
    this.editUserRequest.email = this.user.email;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastrService.error('File size should not exceed 5MB.', 'Error');
        return;
      }

      if (!file.type.match(/image\/(jpeg|png)/)) {
        this.toastrService.error('Only image files (JPEG, PNG) are allowed.', 'Error');
        return;
      }

      this.selectedFile = file;
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
          this.userDataService.setAvatarUrl(response.avatarUrl);
          this.profileUpdated.emit(this.user);
          this.avatarPreview = '';
          this.selectedFile = null;
          this.toastrService.success(response.message, 'Success');
        },
        error: (error) => {
          this.toastrService.error(error.error.message, 'Error');
        }
      });
    }
  }

  onEditSubmit(): void {
    this.userService.editUser(this.userId, this.editUserRequest).subscribe({
      next: (response) => {
        this.userDataService.setUsername(this.editUserRequest.username);
        this.userDataService.setEmail(this.editUserRequest.email);
        this.profileUpdated.emit(this.user);
        this.toastrService.success(response.message, 'Success');
      },
      error: (error) => {
        this.toastrService.error(error.error.message, 'Error');
      }
    });
  }

  onDeleteProfileImage(): void {
    this.userProfileService.deleteUserAvatar(this.userId).subscribe({
      next: (response) => {
        this.userDataService.setAvatarUrl(DefaultAvatar.DefaultAvatarUrl);
        this.avatarPreview = '';
        this.profileUpdated.emit(this.user);
        this.toastrService.success(response.message, 'Success');
      },
      error: (error) => {
        this.toastrService.error(error.error.message, 'Error');
      }
    });
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}
