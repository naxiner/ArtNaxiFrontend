import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/user-profile.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  totalPages: number = 0;
  
  users: User[] = [];
  roles: string[] = ['User', 'Admin', 'Moderator'];

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

  updateRole(user: User) {
    this.userService.setUserRole(user.id, user.role).subscribe({
      next: () => { },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  banUnban(id: string, isBanned: boolean): void {
    const request = isBanned ? this.userService.unbanUser(id) : this.userService.banUser(id);

    request.subscribe({
      next: (response) => {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.isBanned = !isBanned;
        }
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.onUserDeleted(id);
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

  onUserDeleted(id: string): void {
    this.users = this.users.filter(user => user.id !== id);

    if (this.users.length < this.pageSize && this.currentPage < this.totalPages) {
      this.loadUsers();
    }
  }
}
