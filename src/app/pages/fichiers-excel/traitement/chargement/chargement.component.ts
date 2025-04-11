import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-upload-fichier',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h1>Intégration </h1>

      <div class="upload-zone card" 
           (dragover)="$event.preventDefault()" 
           (drop)="onFileDrop($event)"
           [class.loading]="isLoading">
           
        <div *ngIf="!isLoading">
          <i class="fas fa-file-excel"></i>
          <p>Glissez-déposez vos fichiers ici</p>
          <p class="text-muted">ou</p>
          <button class="btn btn-secondary" (click)="triggerFileBrowse()">Parcourir</button>
          <input #fileInput type="file" accept=".xlsx,.xls" hidden (change)="onFileSelected($event)">
          <p class="text-muted">Formats acceptés: .xlsx, .xls</p>
        </div>
        
        <div *ngIf="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Traitement du fichier...</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .upload-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
    
    .upload-zone {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .upload-zone:hover {
      border-color: #1d6f42;
      background-color: #f8f9fa;
    }
    
    .upload-zone i.fa-file-excel {
      font-size: 48px;
      color: #1d6f42;
    }
    
    .upload-zone p {
      margin: 0;
      font-size: 16px;
    }
    
    .upload-zone .text-muted {
      color: #6c757d;
    }
    
    .btn-secondary {
      padding: 10px 20px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .fa-spinner {
      font-size: 36px;
      color: #1d6f42;
    }
    
    .upload-zone.loading {
      background-color: #f8f9fa;
    }
    `
  ]
})
export class ChargementComponent { 
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  isLoading = false;
  constructor(private router: Router) {}

  triggerFileBrowse() {
    this.fileInputRef.nativeElement.click();
  }

  private processFile(file: File) {
    this.isLoading = true;
    
    // Simulate API call with 2 second delay
    of(null).pipe(
      delay(2000),
      finalize(() => {
        this.isLoading = false;
        this.router.navigate(['/fichiers-excel/resultat'], { queryParams: { fileName: file.name } });
      })
    ).subscribe();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }
}
