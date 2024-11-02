import { Component, HostListener, OnInit } from '@angular/core';
import { ImageGeneratorService } from '../image-generator.service';
import { Image } from '../../models/image';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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

  constructor (
    private sdService: ImageGeneratorService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadImages();
  }
  
  loadImages(): void {
    if (this.isLoadingImages) return;
    this.isLoadingImages = true;

    this.sdService.getRecentImages(this.currentImagesPage, this.imagesPerPage).subscribe({
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

  organizeImages() {
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
    this.modalService.openModal(image);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadImages();
    }
  }
}
