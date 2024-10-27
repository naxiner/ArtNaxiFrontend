import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ImageGeneratorService } from '../image-generator.service';
import { AuthService } from '../auth.service';

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
        this.user.images = this.user.images.filter((img: any) => img.id !== id);
      },
      (error) => {
        console.error('Error deleting image', error)
      }
    )
  }
}
