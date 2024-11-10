import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-images.component.html',
  styleUrl: './create-images.component.css'
})
export class CreateImagesComponent {
  @Input() generatedImages!: Image[];
  @Output() imageDeleted = new EventEmitter<string>();

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

  baseUrl = environment.baseUrl;

  constructor(private modalService: ModalService) {
    this.modalService.imageDeleted$.subscribe(imageId => {
      this.onImageDeleted(imageId);
    });
   }

  scrollLeft() {
    this.imageContainer.nativeElement.scrollBy({
      left: -500,
    });
  }

  scrollRight() {
    this.imageContainer.nativeElement.scrollBy({
      left: 500,
    });
  }

  showImageModal(image: Image) {
    this.modalService.openModal(image, true);
  }

  onImageDeleted(id: string) {
    this.imageDeleted.emit(id);
  }
}
