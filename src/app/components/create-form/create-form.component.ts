import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SDRequest } from '../../../models/sd-request';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { ActivatedRoute } from '@angular/router';
import { Image } from '../../../models/image';
import { StyleService } from '../../services/style.service';
import { Style } from '../../../models/style';
import { ToastrService } from 'ngx-toastr';
import { SDRequestDto } from '../../../models/sd-request-dto';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.css'
})
export class CreateFormComponent implements OnInit {
  @Input() generatedImages!: Image[];

  @Output() imageGenerated = new EventEmitter();

  sdRequest: SDRequest = {
    prompt: '',
    negativePrompt: '',
    styles: [],
    seed: -1,
    samplerName: 'DPM++ SDE',
    scheduler: 'Karras',
    steps: 7,
    cfgScale: 2,
    width: 512,
    height: 512
  }

  sdRequestDto: SDRequestDto = {
    prompt: this.sdRequest.prompt,
    negative_prompt: this.sdRequest.negativePrompt,
    styles: this.sdRequest.styles,
    seed: this.sdRequest.seed,
    sampler_name: this.sdRequest.samplerName,
    scheduler: this.sdRequest.scheduler,
    steps: this.sdRequest.steps,
    cfg_scale: this.sdRequest.cfgScale,
    width: this.sdRequest.width,
    height: this.sdRequest.height
  }

  styles: Style[] = [];

  isGenerating: boolean = false;
  displayedSeed: number = -1;

  currentPage: number = 1;
  pageSize: number = 100;
  totalPages: number = 0;

  constructor(
    private sdService: ImageGeneratorService,
    private styleService: StyleService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sdRequest.prompt = params['prompt'] || '';
    });

    this.loadStyles();
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

    this.mapRequestToDto();
    
    this.sdService.generateImage(this.sdRequestDto).subscribe({
      next: (response) => {
        const image = response.image;
        this.generatedImages.unshift({
          id: image.id,
          url: image.url,
          creationTime: image.creationTime,
          createdBy: image.createdBy,
          userId: image.userId,
          request: image.request,
          isPublic: image.isPublic
        });

        this.imageGenerated.emit();
      },
      error: (error) => {
        this.toastrService.error(error.error.message, 'Error');
        this.isGenerating = false;
      },
      complete: () => {
        this.isGenerating = false;
      }
    })
  }

  loadStyles(): void {
    this.styleService.getAllStyles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.styles = response.styles;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        this.toastrService.error(error.error.message, 'Error');
      }
    });
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
      this.toastrService.error('Seed may not be smaller than: -1', 'Error');
    } else if (this.displayedSeed > 2147483647) {
      this.displayedSeed = 2147483647;
      this.toastrService.error('Seed may not be larger than: 2147483647', 'Error');
    }
  }

  validateImageSize(): void {
    if (this.sdRequest.width  < 512 || this.sdRequest.height < 512) {
      this.toastrService.error('Image may not be smaller than: 512x512', 'Error');
    } else if (this.sdRequest.width  > 1024 || this.sdRequest.height > 1024) {
      this.toastrService.error('Image may not be larger than: 1024x1024', 'Error');
    }
  }

  private mapRequestToDto(): void {
    const { prompt, negativePrompt, styles, seed, samplerName, scheduler, steps, cfgScale, width, height } = this.sdRequest;
    this.sdRequestDto = {
      prompt,
      negative_prompt: negativePrompt,
      styles,
      seed,
      sampler_name: samplerName,
      scheduler,
      steps,
      cfg_scale: cfgScale,
      width,
      height
    };
  }
}
