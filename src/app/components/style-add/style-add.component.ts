import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StyleService } from '../../services/style.service';
import { ToastrService } from 'ngx-toastr';
import { AddStyleRequest } from '../../../models/add-style-request';

@Component({
  selector: 'app-style-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './style-add.component.html',
  styleUrl: './style-add.component.css'
})
export class StyleAddComponent {
  @Output() formClosed = new EventEmitter<void>();
  @Output() styleAdded = new EventEmitter<void>();

  style: AddStyleRequest = {
    name: ''
  }

  constructor(private styleService: StyleService, private toastrService: ToastrService) { }

  onSubmit(): void {
    this.styleService.addStyle(this.style).subscribe({
      next: (response) => {
        this.styleAdded.emit();
        this.toastrService.success(response.message, "Success");
       },
      error: (error) => {
        this.toastrService.error(error.message, "Error");
      }
    });
  }

  cancel(): void {
    this.formClosed.emit();
  }
}
