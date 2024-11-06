import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

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
  @Output() visibilityChanged = new EventEmitter<string>();
  baseUrl = environment.baseUrl;

  constructor(
    private imageGeneratorService: ImageGeneratorService,
    private modalService: ModalService,
    private router: Router
  ) {}

  show() {
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }

  close() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
    modal.hide();
  }

  openProfile(userId: string): void {
    this.router.navigate([`profile/${userId}`])
    this.close();
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

  makePublic(id: string): void {
    this.imageGeneratorService.makeImagePublic(id).subscribe(
      (response) => { 
        if (this.image) {
          this.image.isPublic = true;
        }
        this.visibilityChanged.emit(id);
        this.modalService.notifyVisibilityChanged(id);
      },
      (error) => {
        console.error('Error deleting image', error);
      }
    );
  }

  makePrivate(id: string): void {
    this.imageGeneratorService.makeImagePrivate(id).subscribe(
      (response) => { 
        if (this.image) {
          this.image.isPublic = false;
        }
        this.visibilityChanged.emit(id);
        this.modalService.notifyVisibilityChanged(id);
      },
      (error) => {
        console.error('Error deleting image', error);
      }
    );
  }
}
