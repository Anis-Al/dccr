import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-credits-archive',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  providers: [DatePipe],
  templateUrl: './credits-archive.component.html',
  styleUrls: ['./credits-archive.component.scss']
})
export class CreditsArchiveComponent implements OnInit {
  pageActuelle: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  credits: any[] = [];
  creditsFiltres: any[] = [];
  creditsPagines: any[] = [];

  constructor(private dp: DatePipe) {}

  ngOnInit(): void {
    this.chargerCreditsArchives();
  }

  private chargerCreditsArchives(): void {
    // TODO: Replace with real service call
    this.credits = [];
    this.creditsFiltres = [...this.credits];
    this.updatePaginatedData();
  }

  changerPage(page: number): void {
    this.pageActuelle = page;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.pageActuelle - 1) * this.itemsPerPage;
    this.creditsPagines = this.creditsFiltres.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPages = Math.ceil(this.creditsFiltres.length / this.itemsPerPage);
  }

  onSearch(): void {
    this.applyFilters();
  }

  filtrerParDate(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.creditsFiltres = this.credits.filter(credit => {
      const searchMatch = !this.searchTerm ||
        (credit.numContrat && credit.numContrat.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(credit.dateArchivage) >= new Date(this.dateDebut) &&
         new Date(credit.dateArchivage) <= new Date(this.dateFin));
      return searchMatch && dateMatch;
    });
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }

  telechargerCredit(credit: any): void {
    // TODO: Implement download logic
  }

  supprimerCredit(credit: any): void {
    // TODO: Implement delete logic
  }
} 