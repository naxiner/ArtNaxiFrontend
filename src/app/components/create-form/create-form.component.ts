import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SDRequest } from '../../../models/sd-request';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ActivatedRoute } from '@angular/router';
import { Image } from '../../../models/image';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.css'
})
export class CreateFormComponent {
  @Input() generatedImages!: Image[];

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

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

  isGenerating: boolean = false;
  displayedSeed: number = -1;
  errorMessage: string = '';

  styles: string[] = ['Negative'];

  constructor(
    private sdService: ImageGeneratorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
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

  reverseResolution(): void {
    const temp = this.sdRequest.width;
    this.sdRequest.width = this.sdRequest.height;
    this.sdRequest.height = temp;
  }

  generateRandomSeed(): number {
    // random number (0 to 2147483647)
    return Math.floor(Math.random() * 2147483648);
  }

  validateSeed(): void {
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
