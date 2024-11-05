import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ImageGeneratorService } from '../image-generator.service';
import { AuthService } from '../auth.service';
import { Image } from '../../models/image';
import { ModalService } from '../modal.service';
import { ImageModalComponent } from "../image-modal/image-modal.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ImageModalComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  baseUrl = environment.baseUrl;
  user: any;
  userId: string = '';
  currentUserRole: string = '';
  isAllowToDelete = false;
  userImages: Image[] = [];

  pageNumber = 1;
  pageSize = 12;
  totalPages = 1;
  selectedTab: 'public' | 'all' = 'public';

  constructor (
    private authService: AuthService,
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

  onImageVisibilityChanged(id: string) {
    const image = this.userImages.find(image => image.id === id);
    if (image) {
      image.isPublic = image.isPublic;
    }
  }
}
