import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Style } from '../../../models/style';
import { StyleService } from '../../services/style.service';
import { StyleAddComponent } from '../style-add/style-add.component';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [CommonModule, FormsModule, StyleAddComponent, SweetAlert2Module],
  templateUrl: './style.component.html',
  styleUrl: './style.component.css'
})
export class StyleComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalStyles: number = 0;
  isAddFormVisible: boolean = false;

  styles: Style[] = [];

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
    this.loadStyles();
  }

  loadStyles(): void {
    this.styleService.getAllStyles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.styles = response.styles;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  deleteStyle(id: string): void {
    this.styleService.deleteStyleById(id).subscribe({
      next: () => {
        this.onStyleDeleted(id);
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStyles();
    }
  } 

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStyles();
    }
  }

  toggleAddForm(): void {
    this.isAddFormVisible = !this.isAddFormVisible;
  }

  onStyleAdded(): void {
    this.loadStyles();
    this.toggleAddForm();
  }

  onStyleDeleted(id: string): void {
    this.styles = this.styles.filter(style => style.id !== id);

    if (this.styles.length === 0 && this.currentPage > 1) {
      this.previousPage();
    } else {
      this.loadStyles();
    }
  }
}
