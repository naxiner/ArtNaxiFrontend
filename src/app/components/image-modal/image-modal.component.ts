import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'image-modal',
  standalone: true,
  imports: [CommonModule, SweetAlert2Module],
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
    private toastrService: ToastrService,
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
        this.toastrService.success('Image successfully deleted.', 'Success');
      },
      (error) => {
        this.toastrService.error(error.error, 'Error');
      }
    );
  }

  makePublic(id: string): void {
    this.imageGeneratorService.makeImagePublic(id).subscribe(
      () => { 
        if (this.image) {
          this.image.isPublic = true;
        }
        this.visibilityChanged.emit(id);
        this.modalService.notifyVisibilityChanged(id);
        this.toastrService.success('Image has been published.', 'Success');
      },
      (error) => {
        this.toastrService.error(error.error.message, 'Error');
      }
    );
  }

  makePrivate(id: string): void {
    this.imageGeneratorService.makeImagePrivate(id).subscribe(
      () => { 
        if (this.image) {
          this.image.isPublic = false;
        }
        this.visibilityChanged.emit(id);
        this.modalService.notifyVisibilityChanged(id);
        this.toastrService.success('Image has been hidden.', 'Success');
      },
      (error) => {
        this.toastrService.error(error.error.message, 'Error');
      }
    );
  }
}
