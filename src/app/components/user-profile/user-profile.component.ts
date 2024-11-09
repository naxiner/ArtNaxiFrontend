import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserProfileEditComponent } from "../user-profile-edit/user-profile-edit.component";
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { UserDataService } from '../../services/user-data.service';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserProfileEditComponent],
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

  userImages: Image[] = [];

  publicImageCount = 0;
  pageNumber = 1;
  pageSize = 12;
  totalPages = 1;
  selectedTab: 'public' | 'all' = 'public';

  constructor (
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private userDataService: UserDataService,
    private imageGeneratorService: ImageGeneratorService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) {
    this.modalService.imageDeleted$.subscribe(imageId => {
      this.onImageDeleted(imageId);
    });

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

      this.loadUserImages();
      this.loadUserProfile(this.userId);
      this.getPublicImageCount(this.userId);
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
