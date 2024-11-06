import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
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

  constructor (
    private sdService: ImageGeneratorService,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService
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

  loadImages(): void {
    if (this.isLoadingImages) return;
    this.isLoadingImages = true;

    this.sdService.getRecentPublicImages(this.currentImagesPage, this.imagesPerPage).subscribe({
      next: (response) => {
        this.generatedImages.push(...response);
        this.organizeImages();
        this.currentImagesPage++;
        this.isLoadingImages = false;
      },
      error: (err) => {
        console.log(err.error);
        this.isLoadingImages = false;
      }
    });
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
