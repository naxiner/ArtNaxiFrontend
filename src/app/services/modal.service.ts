import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Image } from '../../models/image';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showModalCallback: ((image: Image, isAllowToDelete: boolean) => void) | null = null;
  private imageDeletedSubject = new Subject<string>();
  private imageVisibilityChangedSubject = new Subject<string>();

  imageDeleted$ = this.imageDeletedSubject.asObservable();
  imageVisibilityChanged$ = this.imageVisibilityChangedSubject.asObservable();

  registerShowModalCallback(callback: (image: Image, isAllowToDelete: boolean) => void) {
    this.showModalCallback = callback;
  }

  openModal(image: Image, isAllowToDelete: boolean) {
    if (this.showModalCallback) {
      this.showModalCallback(image, isAllowToDelete);
    }
  }

  notifyImageDeleted(imageId: string) {
    this.imageDeletedSubject.next(imageId);
  }

  notifyVisibilityChanged(imageId: string) {
    this.imageVisibilityChangedSubject.next(imageId);
  }
}
