import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ArchiveService } from '../../../core/services/archive.service';
import { ArchiveXmlDto } from '../../../core/dtos/archive-dtos';

@Component({
  selector: 'app-declarations-ba-archive',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  providers: [DatePipe],
  templateUrl: './declarations-ba-archive.component.html',
  styleUrls: ['./declarations-ba-archive.component.scss']
})
export class DeclarationsBaArchiveComponent implements OnInit {
  pageActuelle: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  fichiers: ArchiveXmlDto[] = [];
  fichiersFiltres: ArchiveXmlDto[] = [];
  fichiersPagines: ArchiveXmlDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private dp: DatePipe,
    private archiveService: ArchiveService
  ) {}

  ngOnInit(): void {
    this.chargerDeclarationsArchives();
  }

  private chargerDeclarationsArchives(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.archiveService.getFichiersXmlArchives().subscribe({
      next: (data) => {
        this.fichiers = data;
        this.fichiersFiltres = [...this.fichiers];
        this.updatePaginatedData();
        this.isLoading = false;
        console.log(this.fichiers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des déclarations archivées:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des déclarations archivées.';
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
        (fichier.nomFichierCorrection && fichier.nomFichierCorrection.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (fichier.nomFichierSuppression && fichier.nomFichierSuppression.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(fichier.dateHeureGenerationXml) >= new Date(this.dateDebut) &&
         new Date(fichier.dateHeureGenerationXml) <= new Date(this.dateFin));
         
      return searchMatch && dateMatch;
    });
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }

  telechargerFichier(fichier: any): void {
    // TODO: Implement download logic
  }

  supprimerFichier(fichier: any): void {
    // TODO: Implement delete logic
  }
} 