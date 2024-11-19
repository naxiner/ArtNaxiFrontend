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
}
