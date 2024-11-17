import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  errorMessage = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  totalPages: number = 0;

  searchQuery: string = '';
  isSearching: boolean = false;
  
  users: User[] = [];
  roles: string[] = ['User', 'Admin', 'Moderator'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  };

  loadUsers(): void {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.errorMessage = '';
        this.isSearching = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

  loadSearchResults(): void {
    this.userService.getUsersByQuery(this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: response => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.errorMessage = '';
        this.isSearching = true;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

  updateRole(user: User) {
    this.userService.setUserRole(user.id, user.role).subscribe({
      next: () => { 
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message;
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
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.onUserDeleted(id);
        this.errorMessage = '';
       },
      error: (err) => {
        this.errorMessage = err.error.message;
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

  onSearchChange(): void {
    if (this.searchQuery.trim() === '') {
      this.isSearching = false;
      this.currentPage = 1;
      this.loadUsers();
    } else {
      this.currentPage = 1;
      this.loadSearchResults();
    }
  }
}
