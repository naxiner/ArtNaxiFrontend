import { Component, OnInit } from '@angular/core';
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

  constructor (
    private sdService: ImageGeneratorService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.sdService.getRecentImages(20).subscribe({
      next: (response) => {
        this.generatedImages = response;
        this.organizeImages();
      },
      error: (err) => {
        console.log(err.error);
      }
    })
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
}
