import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ModalService } from '../../services/modal.service';
import { SDRequest } from '../../../models/sd-request';
import { Image } from '../../../models/image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  sdRequest: SDRequest = {
    prompt: '',
    negative_prompt: '',
    styles: [],
    seed: -1,
    sampler_name: 'DPM++ SDE',
    scheduler: 'Karras',
    steps: 7,
    cfg_scale: 2,
    width: 512,
    height: 512
  }

  displayedSeed: number = -1;
  errorMessage: string = '';

  styles: string[] = ['Negative'];

  generatedImages: Image[] = [];
  isGenerating: boolean = false;

  baseUrl = environment.baseUrl;

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

  constructor(
    private sdService: ImageGeneratorService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) {
    this.modalService.imageDeleted$.subscribe(imageId => {
      this.onImageDeleted(imageId);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sdRequest.prompt = params['prompt'] || '';
    });
  }

  onSubmit(): void {
    this.isGenerating = true;

    if (this.displayedSeed === -1) {
      this.sdRequest.seed = this.generateRandomSeed();
    } else {
      this.sdRequest.seed = this.displayedSeed;
    }

    this.sdRequest.styles = this.sdRequest.styles || [];
    if (!Array.isArray(this.sdRequest.styles)) {
      this.sdRequest.styles = [this.sdRequest.styles];
    }
    
    this.sdService.generateImage(this.sdRequest).subscribe({
      next: (response) => {
        this.generatedImages.unshift({
          id: response.id,
          url: response.url,
          creationTime: response.creationTime,
          createdBy: response.createdBy,
          userId: response.userId,
          request: response.request,
          isPublic: response.isPublic
        });
        if (this.imageContainer && this.imageContainer.nativeElement) {
          this.imageContainer.nativeElement.scrollTo({
            left: 0,
          });
        }
      },
      error: (err) => {
        console.log(err.error);
      },
      complete: () => {
        this.isGenerating = false;
      }
    })
  }

  reverseResolution() {
    const temp = this.sdRequest.width;
    this.sdRequest.width = this.sdRequest.height;
    this.sdRequest.height = temp;
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

  generateRandomSeed(): number {
    // random number (0 to 2147483647)
    return Math.floor(Math.random() * 2147483648);
  }

  validateSeed() {
    if (this.displayedSeed < -1) {
      this.displayedSeed = -1;
      this.errorMessage = 'Seed may not be smaller than: -1';
    } else if (this.displayedSeed > 2147483647) {
      this.displayedSeed = 2147483647;
      this.errorMessage = 'Seed may not be larger than: 2147483647';
    } else {
      this.errorMessage = '';
    }
  }
}
