import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-images.component.html',
  styleUrl: './user-profile-images.component.css'
})
export class UserProfileImagesComponent implements OnInit {
  @Input() userId!: string;
  @Input() isAllowToDelete = false;

  baseUrl = environment.baseUrl;
  
  selectedTab: 'public' | 'all' = 'public';

  userImages: Image[] = [];
  publicImageCount = 0;
  pageNumber = 1;
  pageSize = 12;
  totalPages = 1;

  constructor(
    private imageGeneratorService: ImageGeneratorService, 
    private modalService: ModalService,
    private toastrService: ToastrService
  ) {
    this.modalService.imageDeleted$.subscribe(imageId => {
      this.onImageDeleted(imageId);
    });
   }

  ngOnInit(): void {
    this.loadUserImages();
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
        this.toastrService.error(error.error.message, 'Error');
      }
    );
  }

  showImageModal(image: Image): void {
    this.modalService.openModal(image, this.isAllowToDelete);
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

  onImageDeleted(id: string): void {
    this.userImages = this.userImages.filter(image => image.id !== id);

    if (this.userImages.length < this.pageSize && this.pageNumber < this.totalPages) {
      this.loadUserImages();
    }
  }
}
