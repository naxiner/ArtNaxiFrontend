import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ImageGeneratorService } from '../image-generator.service';
import { AuthService } from '../auth.service';
import { Image } from '../../models/image';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  baseUrl = environment.baseUrl;
  user: any;
  userId: string = '';
  currentUserRole: string = '';
  isAllowToDelete = false;
  userImages: Image[] = [];

  constructor (
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private imageGeneratorService: ImageGeneratorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') ?? '';
      this.currentUserRole = this.authService.getUserRoleFromToken() ?? 'User';
      const currentUserId = this.authService.getUserIdFromToken() ?? '';

      if (this.userId == currentUserId || this.currentUserRole == 'Admin') {
        this.isAllowToDelete = true;
      }

      const pageNumber = 1, pageSize = 10;
      this.imageGeneratorService.getImagesByUserId(this.userId, pageNumber, pageSize).subscribe(
        (images: Image[]) => {
          this.userImages = images;
        },
        (error) => {
          console.error('Error loading user images', error);
        }
      );
      
      this.loadUserProfile(this.userId);
    });
  }

  loadUserProfile(id: string): void {
    this.userProfileService.getUserProfile(id).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error loading user profile', error);
      }
    );
  }

  deleteImage(id: string): void {
    this.imageGeneratorService.deleteImage(id).subscribe(
      () => {
        this.userImages = this.userImages.filter((img: any) => img.id !== id);
      },
      (error) => {
        console.error('Error deleting image', error)
      }
    )
  }
}
