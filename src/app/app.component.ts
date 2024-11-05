import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ImageModalComponent } from "./image-modal/image-modal.component";
import { ModalService } from './modal.service';
import { environment } from '../environments/environment';
import { Image } from '../models/image';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, ImageModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private modalService: ModalService) {}
  
  @ViewChild(ImageModalComponent) imageModal!: ImageModalComponent;
  baseUrl = environment.baseUrl;
  image: Image | null = null;
  isAllowToDelete: boolean = false;
  isVisibleButtonToTop: boolean = false;
  title = 'ArtNaxiFrontend';

  ngOnInit() {
    this.modalService.registerShowModalCallback((image, isAllowToDelete) => 
      this.openModal(image, isAllowToDelete));
  }

  openModal(image: Image, isAllowToDelete: boolean) {
    this.imageModal.image = image;
    this.imageModal.isAllowToDelete = isAllowToDelete;
    this.imageModal.show();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisibleButtonToTop = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
