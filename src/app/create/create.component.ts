import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageGeneratorService } from '../image-generator.service';
import { SDRequest } from '../../models/sd-request';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

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
    sampler_name: 'DPM++ SDE',
    scheduler: 'Karras',
    steps: 7,
    cfg_scale: 2,
    width: 512,
    height: 512
  }

  styles: string[] = ['Negative'];

  generatedImagesUrls: string[] = []
  isGenerating: boolean = false;

  baseUrl = environment.baseUrl;

  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

  constructor(private sdService: ImageGeneratorService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sdRequest.prompt = params['prompt'] || '';
    });
  }

  onSubmit(): void {
    this.isGenerating = true;

    this.sdRequest.styles = this.sdRequest.styles || [];
    if (!Array.isArray(this.sdRequest.styles)) {
      this.sdRequest.styles = [this.sdRequest.styles];
    }
    
    this.sdService.generateImage(this.sdRequest).subscribe({
      next: (response) => {
        this.generatedImagesUrls.unshift(response.imagePath);
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
}
