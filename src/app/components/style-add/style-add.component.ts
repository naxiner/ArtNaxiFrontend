import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StyleService } from '../../services/style.service';
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

  errorMessage: string = '';

  style: AddStyleRequest = {
    name: ''
  }

  constructor(private styleService: StyleService) { }

  onSubmit(): void {
    this.styleService.addStyle(this.style).subscribe({
      next: () => {
        this.errorMessage = '';
        this.styleAdded.emit();
       },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

  cancel(): void {
    this.formClosed.emit();
  }
}
