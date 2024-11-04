import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../environments/environment';
import { Image } from '../../models/image';
import { ImageGeneratorService } from '../image-generator.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../modal.service';

declare var bootstrap: any;

@Component({
  selector: 'image-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() image?: Image;
  @Input() isAllowToDelete: boolean = false;
  @Output() imageDeleted = new EventEmitter<string>();
  baseUrl = environment.baseUrl;

  constructor(
    private imageGeneratorService: ImageGeneratorService,
    private modalService: ModalService
  ) {}

  show() {
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }

  close() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
    modal.hide();
  }

  deleteImage(id: string): void {
    this.imageGeneratorService.deleteImage(id).subscribe(
      () => { 
        this.imageDeleted.emit(id);
        this.modalService.notifyImageDeleted(id);
        this.close();
      },
      (error) => {
        console.error('Error deleting image', error);
      }
    );
  }
}
