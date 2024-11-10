import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateFormComponent } from '../create-form/create-form.component';
import { ModalService } from '../../services/modal.service';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule, CreateFormComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  generatedImages: Image[] = [];

  baseUrl = environment.baseUrl;

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

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
    this.generatedImages = this.generatedImages.filter(image => image.id !== id);
  }
}
