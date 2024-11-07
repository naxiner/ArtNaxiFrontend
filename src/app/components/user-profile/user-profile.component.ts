import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ImageModalComponent } from "../image-modal/image-modal.component";
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { EditUserRequest } from '../../../models/edit-user-request';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ImageModalComponent, FormsModule],
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
  
  editUserRequest: EditUserRequest = {
    username: '',
    email: '',
    password: '',
    newPassword: ''
  }

  errorMessage: string = "";

  userImages: Image[] = [];

  pageNumber = 1;
  pageSize = 12;
  totalPages = 1;
  selectedTab: 'public' | 'all' = 'public';
  selectedFile: File | null = null;
  avatarPreview: string = '';

  constructor (
    private authService: AuthService,
    private userService: UserService,
    private userProfileService: UserProfileService,
    private imageGeneratorService: ImageGeneratorService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) {
    this.modalService.imageDeleted$.subscribe(imageId => {
      this.onImageDeleted(imageId);
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

      this.loadUserImages();
      this.loadUserProfile(this.userId);
    });
  }

  changeTab(tab: 'public' | 'all'): void {
    this.selectedTab = tab;
    this.pageNumber = 1;
    this.loadUserImages();
  }

  loadUserImages(): void {
    const fetchImages = this.selectedTab === 'public'
      ? this.imageGeneratorService.getPublicImagesByUserId(this.userId, this.pageNumber, this.pageSize)
      : this.imageGeneratorService.getImagesByUserId(this.userId, this.pageNumber, this.pageSize);
  
    fetchImages.subscribe(
      (response: { userImages: Image[], totalPages: number }) => {
        this.userImages = response.userImages;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error('Error loading user images', error);
      }
    );
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

  goToPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadUserImages();
    }
  }

  goToNextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadUserImages();
    }
  }

  showImageModal(image: Image) {
    this.modalService.openModal(image, this.isAllowToDelete);
  }

  onImageDeleted(id: string) {
    this.userImages = this.userImages.filter(image => image.id !== id);

    if (this.userImages.length < this.pageSize && this.pageNumber < this.totalPages) {
      this.loadUserImages();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size should not exceed 5MB';
        return;
      }

      if (!file.type.match(/image\/(jpeg|png)/)) {
        this.errorMessage = 'Only image files (JPEG, PNG) are allowed';
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
          console.log(response.profilePictureUrl);
          this.user.profilePictureUrl = response.profilePictureUrl;
          this.avatarPreview = '';
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error uploading profile image', error);
        }
      });
    }
  }

  editProfile() {
    this.isEditingProfile = !this.isEditingProfile;
    this.editUserRequest.username = this.user.username;
    this.editUserRequest.email = this.user.email;
    this.editUserRequest.password = '';
    this.editUserRequest.newPassword = '';
  }

  cancelEdit() {
    this.isEditingProfile = false;
  }

  onEditSubmit() {
    this.userService.editUser(this.userId, this.editUserRequest).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.isEditingProfile = false;
        this.loadUserProfile(this.userId);
        this.errorMessage = '';
      },
      error: (error) => {
        console.log('here');
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = `Error: ${error.status} - ${error.statusText}`;
        }
      }
    });
  }
}
