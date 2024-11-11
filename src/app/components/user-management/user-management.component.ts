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
  users: User[] = [];

  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users;
        console.log(this.users);
      },
      error: (err) => {
        console.log(err.error);
      },
    }
  )};
}
