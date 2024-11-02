import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { Image } from '../../models/image';

declare var bootstrap: any;

@Component({
  selector: 'image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() image?: Image;
  baseUrl = environment.baseUrl;

  show() {
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
  }

  close() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
    modal.hide();
  }
}
