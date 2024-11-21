import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  generatedImages: Image[] = [];
  columns: any[][] = [];
  baseUrl = environment.baseUrl;
  numberOfColumns = 5;
  imagesPerPage = 20;
  currentImagesPage = 1;
  isLoadingImages = false;
  inputGenerateText: string = '';
  currentMode: 'recent' | 'popular' = 'recent';

  constructor (
    private sdService: ImageGeneratorService,
    private modalService: ModalService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadImages();
  }
  
  onGenerateClick(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['create'], { queryParams: { prompt: this.inputGenerateText } });
    } else {
      this.router.navigate(['user/register']);
    }
  }

  setMode(mode: 'recent' | 'popular'): void {
    if (this.currentMode !== mode) {
      this.generatedImages = [];
      this.currentMode = mode;
      this.currentImagesPage = 1;
      this.loadImages();
    }
  }

  loadImages(): void {
    if (this.isLoadingImages) return;
    this.isLoadingImages = true;
    let fetchImages$;

    if (this.currentMode === 'recent') {
      fetchImages$ = this.sdService.getRecentPublicImages(this.currentImagesPage, this.imagesPerPage);
    } else if (this.currentMode === 'popular') {
      fetchImages$ = this.sdService.getPopularPublicImages(this.currentImagesPage, this.imagesPerPage);
    }

    if (fetchImages$) {
      this.isLoadingImages = true;
      fetchImages$.subscribe({
        next: (response) => {
          const images = this.currentMode === 'recent' ? response.recentImages : response.popularImages;
          this.generatedImages.push(...images);
          this.organizeImages();
          this.currentImagesPage++;
          this.isLoadingImages = false;
        },
        error: (error) => {
          this.toastrService.error(error.error.message, 'Error');
          this.isLoadingImages = false;
        }
      });
    }
  }

  organizeImages(): void {
    this.columns = Array.from({ length: this.numberOfColumns }, () => []);
    const columnHeights = Array(this.numberOfColumns).fill(0);

    for (const image of this.generatedImages) {
        const imageHeight = this.getImageHeight(image);
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

        this.columns[shortestColumnIndex].push(image);
        columnHeights[shortestColumnIndex] += imageHeight;
    }
  }

  getImageHeight(image: Image): number {
    const originalWidth = image.request.width;
    const originalHeight = image.request.height;

    const scaleFactor = 1 / originalWidth;
    
    return originalHeight * scaleFactor;
  }

  showImageModal(image: Image) {
    this.modalService.openModal(image, false);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadImages();
    }
  }
}
