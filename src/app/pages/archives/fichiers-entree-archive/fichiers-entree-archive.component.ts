import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ArchiveService } from '../../../core/services/archive.service';
import { ArchiveExcelMetadonneesDto } from '../../../core/dtos/archive-dtos';

@Component({
  selector: 'app-fichiers-entree-archive',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  providers: [DatePipe],
  templateUrl: './fichiers-entree-archive.component.html',
  styleUrls: ['./fichiers-entree-archive.component.scss']
})
export class FichiersEntreeArchiveComponent implements OnInit {
  pageActuelle: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  fichiers: ArchiveExcelMetadonneesDto[] = [];
  fichiersFiltres: ArchiveExcelMetadonneesDto[] = [];
  fichiersPagines: ArchiveExcelMetadonneesDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private dp: DatePipe,
    private archiveService: ArchiveService
  ) {}

  ngOnInit(): void {
    this.chargerFichiersArchives();
  }

  private chargerFichiersArchives(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.archiveService.getFichiersExcelArchives().subscribe({
      next: (data) => {
        this.fichiers = data;
        this.fichiersFiltres = [...this.fichiers];
        this.updatePaginatedData();
        this.isLoading = false;
        console.log(this.fichiers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fichiers archivés:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des fichiers archivés.';
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
    this.fichiersPagines = this.fichiersFiltres.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPages = Math.ceil(this.fichiersFiltres.length / this.itemsPerPage);
  }

  onSearch(): void {
    this.applyFilters();
  }

  filtrerParDate(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.fichiersFiltres = this.fichiers.filter(fichier => {
      const searchMatch = !this.searchTerm ||
        (fichier.nomFichierExcel && fichier.nomFichierExcel.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(fichier.dateHeureIntegrationExcel) >= new Date(this.dateDebut) &&
         new Date(fichier.dateHeureIntegrationExcel) <= new Date(this.dateFin));
         
      return searchMatch && dateMatch;
    });
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }

  telechargerFichier(fichier: any): void {
  }

  supprimerFichier(fichier: any): void {
  }
} 