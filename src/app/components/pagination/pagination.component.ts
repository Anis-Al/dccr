import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="pagesTotales>0">
      <button class="btn" [disabled]="pageActuelle === 1" (click)="changerPage(pageActuelle - 1)">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">Page {{pageActuelle}} sur {{pagesTotales}}</span>
      <button class="btn" [disabled]="pageActuelle === pagesTotales" (click)="changerPage(pageActuelle + 1)">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      padding: 1rem;
      background-color: transarent;
      border-radius: 8px;
    }

    .btn {
      padding: 0.5rem;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-info {
      font-size: 0.9rem;
      color: var(--text-color);
    }
  `]
})
export class PaginationComponent {
  private readonly lignesParPage = 5;

  @Input() set lignesTotales(value: number) {
    this._lignesTotales = value;
    this.calculerPages();
  }
  get lignesTotales(): number {
    return this._lignesTotales;
  }

  @Input() set pageActuelle(value: number) {
    this._pageActuelle = value;
  }
  get pageActuelle(): number {
    return this._pageActuelle;
  }

  @Output() changeurPage = new EventEmitter<number>();

  private _lignesTotales = 0;
  private _pageActuelle = 1;

  get pagesTotales(): number {
    return Math.ceil(this.lignesTotales / this.lignesParPage);
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.pagesTotales && page !== this.pageActuelle) {
      this.changeurPage.emit(page);
    }
  }

  private calculerPages(): void {
    const pages = Math.ceil(this._lignesTotales / this.lignesParPage);
    if (this._pageActuelle > pages) {
      this._pageActuelle = Math.max(1, pages);
      this.changeurPage.emit(this._pageActuelle);
    }
  }
}