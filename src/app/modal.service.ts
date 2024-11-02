import { Injectable } from '@angular/core';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor() { }
  
  private showModalCallback: ((image: Image) => void) | null = null;

  registerShowModalCallback(callback: (image: Image) => void) {
    this.showModalCallback = callback;
  }

  openModal(image: Image) {
    if (this.showModalCallback) {
      this.showModalCallback(image);
    }
  }
}
