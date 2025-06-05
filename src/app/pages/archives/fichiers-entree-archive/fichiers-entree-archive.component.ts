import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

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
  fichiers: any[] = [];
  fichiersFiltres: any[] = [];
  fichiersPagines: any[] = [];

  constructor(private dp: DatePipe) {}

  ngOnInit(): void {
    this.chargerFichiersArchives();
  }

  private chargerFichiersArchives(): void {
    // TODO: Replace with real service call
    this.fichiers = [];
    this.fichiersFiltres = [...this.fichiers];
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
        (fichier.nomFichier && fichier.nomFichier.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(fichier.dateArchivage) >= new Date(this.dateDebut) &&
         new Date(fichier.dateArchivage) <= new Date(this.dateFin));
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