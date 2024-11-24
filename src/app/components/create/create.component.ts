import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateFormComponent } from '../create-form/create-form.component';
import { Image } from '../../../models/image';
import { CreateImagesComponent } from "../create-images/create-images.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule, CreateFormComponent, CreateImagesComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  @ViewChild(CreateImagesComponent) createImagesComponent!: CreateImagesComponent;

  generatedImages: Image[] = [];

  constructor() { }

  onImageDeleted(imageId: string) {
    this.generatedImages = this.generatedImages.filter(image => image.id !== imageId);
  }

  onImageGenerated() {
    if (this.generatedImages.length > 1) {
      this.createImagesComponent.scrollToStart();
    }
  }
}
