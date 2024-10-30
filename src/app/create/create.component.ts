import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageGeneratorService } from '../image-generator.service';
import { SDRequest } from '../../models/sd-request';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

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

  generatedImageUrl: string | null = null;
  isGenerating: boolean = false;

  baseUrl = environment.baseUrl;

  constructor(private sdService: ImageGeneratorService) {}

  onSubmit(): void {
    this.isGenerating = true;

    this.sdRequest.styles = this.sdRequest.styles || [];
    if (!Array.isArray(this.sdRequest.styles)) {
      this.sdRequest.styles = [this.sdRequest.styles];
    }
    
    this.sdService.generateImage(this.sdRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.generatedImageUrl = response.imagePath;
      },
      error: (err) => {
        console.log(err.error);
      },
      complete: () => {
        this.isGenerating = false;
        
      }
    })
  }
}
