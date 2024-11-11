import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  totalPages: number = 0;
  
  users: User[] = [];

  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  };


  loadUsers(): void {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.loadUsers();
    }
  } 

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadUsers();
    }
  }
}
