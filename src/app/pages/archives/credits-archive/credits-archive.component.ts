import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ArchiveService } from '../../../core/services/archive.service';
import { ArchiveCreditsListeDto } from '../../../core/dtos/archive-dtos';

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
  credits: ArchiveCreditsListeDto[] = [];
  creditsFiltres: ArchiveCreditsListeDto[] = [];
  creditsPagines: ArchiveCreditsListeDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private dp: DatePipe,
    private archiveService: ArchiveService
  ) {}

  ngOnInit(): void {
    this.chargerCreditsArchives();
  }

  private chargerCreditsArchives(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.archiveService.getCreditsArchives().subscribe({
      next: (data) => {
        this.credits = data;
        this.creditsFiltres = [...this.credits];
        this.updatePaginatedData();
        this.isLoading = false;
        console.log(this.credits);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des crédits archivés:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des crédits archivés.';
        this.isLoading = false;
      }
    });
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
        (credit.num_contrat_credit && credit.num_contrat_credit.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (credit.libelle_type_credit && credit.libelle_type_credit.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Since we don't have a direct date_archivage field, we'll use date_declaration if needed
      const dateToCheck = credit.date_declaration || '';
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(dateToCheck) >= new Date(this.dateDebut) &&
         new Date(dateToCheck) <= new Date(this.dateFin));
         
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