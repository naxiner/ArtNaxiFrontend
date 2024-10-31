import { Component, OnInit } from '@angular/core';
import { ImageGeneratorService } from '../image-generator.service';
import { Image } from '../../models/image';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  generatedImages: Image[] = [];
  baseUrl = environment.baseUrl;

  constructor (
    private sdService: ImageGeneratorService,
  ) { }

  ngOnInit(): void {
    this.sdService.getAllImages().subscribe({
      next: (response) => {
        console.log(response);
        this.generatedImages = response;
      },
      error: (err) => {
        console.log(err.error);
      }
    })
  }
}
