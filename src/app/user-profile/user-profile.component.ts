import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

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

  constructor (
    private userProfileService: UserProfileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') ?? '';
      this.loadUserProfile(this.userId);
    });
  }

  loadUserProfile(id: string): void {
    this.userProfileService.getUserProfile(id).subscribe(
      (data) => {
        debugger;
        this.user = data;
      },
      (error) => {
        console.error('Error loading user profile', error);
      }
    );
  }
}
