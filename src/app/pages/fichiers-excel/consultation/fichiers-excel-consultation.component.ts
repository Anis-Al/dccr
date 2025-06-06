import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelCrudService } from '../../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../../core/dtos/Excel/excel-metadonnees-dto';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { CreditDto } from '../../../core/dtos/Credits/credits';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { Subscription } from 'rxjs';
import { CreditDetailsComponent } from '../../credits/credit-details/credit-details.component';
import { CreditsListComponent } from './credits-list-par-source/credits-list.component';

@Component({
  selector: 'app-fichiers-excel-consultation',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe, CreditDetailsComponent, CreditsListComponent],
  templateUrl: './fichiers-excel-consultation.component.html',
  styleUrls: ['./fichiers-excel-consultation.component.scss']
})
export class FichiersExcelConsultationComponent implements OnInit, OnDestroy {
  fichiers: ExcelMetadonneesDto[] = [];
  fichiersFiltres: ExcelMetadonneesDto[] = [];
  FichiersExcelPagines: ExcelMetadonneesDto[] = [];
  fichierSelectionne: ExcelMetadonneesDto | null = null;
  pageActuelle = 1;
  lignesParPage = 10;   
  totalPages = 1;
  searchTerm = '';
  dateDebut: string = '';
  dateFin: string = '';
  today: string = new Date().toISOString().split('T')[0];
  creditsPagines: CreditDto[] = [];
  creditsFiltres: CreditDto[] = [];
  tousLesCredits: CreditDto[] = [];
  creditSelectionne: CreditDto | null = null;
  creditSearchTerm = '';
  selectedDate = '';
  datesDeclaration: string[] = [];
  creditPageActuelle = 1;
  creditLignesParPage = 10;
  creditPagesTotales = 1;
  isLoading = false;
  loadCreditsSubscription: Subscription | null = null;

  constructor(
    private excelCrudService: ExcelCrudService, 
    private router: Router,
    private creditService: CreditsService
  ) {}

  ngOnInit() {
    this.getTousLesMetadonneesduExcel();
  }

  getTousLesMetadonneesduExcel() {
    this.excelCrudService.getTousLesMetadonneesDuExcel()
      .subscribe({
        next: (metadonnees) => {
          this.fichiers = metadonnees;
          this.fichiersFiltres = [...this.fichiers];
          this.updatePagination();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.FichiersExcelPagines = this.fichiersFiltres.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.fichiersFiltres.length / this.lignesParPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
      this.updatePagination();
    }
  }

  onSearch() {
    this.filtrerFichiers();
  }

  filtrerParDate() {
    this.filtrerFichiers();
  }

  filtrerFichiers() {
    this.fichiersFiltres = this.fichiers.filter(fichier => {
      const matchesSearch = !this.searchTerm || 
        fichier.nom_fichier_excel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.integrateur.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchesDateRange = true;
      if (this.dateDebut || this.dateFin) {
        const fichierDate = new Date(fichier.date_heure_integration_excel);
        
        if (this.dateDebut) {
          const debut = new Date(this.dateDebut);
          matchesDateRange = matchesDateRange && fichierDate >= debut;
        }
        
        if (this.dateFin) {
          const fin = new Date(this.dateFin);
          fin.setHours(23, 59, 59, 999); 
          matchesDateRange = matchesDateRange && fichierDate <= fin;
        }
      }
      
      return matchesSearch && matchesDateRange;
    });
    
    this.pageActuelle = 1;
    this.updatePagination();
  }

  trackByFichier(index: number, fichier: ExcelMetadonneesDto): number {
    return fichier.id_fichier_excel; 
  }

  onRowClick(event: MouseEvent, fichier: ExcelMetadonneesDto) {
    const target = event.target as HTMLElement;
    if (target.closest('.actions')) {
      return;
    }
    this.fichierSelectionne = fichier;
    this.creditPageActuelle = 1;
    this.creditSearchTerm = '';
    this.selectedDate = '';
    this.loadCreditsForFichier(fichier.id_fichier_excel);
  }

  supprimerFichier(fichier: ExcelMetadonneesDto) {
    if (confirm(`Sûr de vouloir supprimer ce fichier : "${fichier.nom_fichier_excel}" ?`)) {
      this.excelCrudService.supprimerFichierExcel(fichier.id_fichier_excel)
        .subscribe({
          next: () => {
            this.creditService.actualiserCredits().subscribe(() => {
              this.tousLesCredits = [];
              this.creditsFiltres = [];
              this.creditsPagines = [];
              this.creditSelectionne = null;
              this.getTousLesMetadonneesduExcel();
            });
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  loadCreditsForFichier(idExcel: number) {
    this.isLoading = true;
    this.loadCreditsSubscription?.unsubscribe();
    
    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({
        next: (credits) => {
          this.tousLesCredits = credits
            .filter(credit => credit.id_excel === idExcel)
            .map(credit => ({
              ...credit,
            }));
          
          this.extractUniqueDates();
          this.updateCreditPagination();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  extractUniqueDates() {
    const uniqueDates = new Set<string>();
    this.tousLesCredits.forEach(credit => {
      if (credit.date_declaration) {
        uniqueDates.add(credit.date_declaration);
      }
    });
    this.datesDeclaration = Array.from(uniqueDates).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });
  }

  updateCreditPagination() {
    let filteredCredits = JSON.parse(JSON.stringify(this.tousLesCredits));
    if (this.creditSearchTerm) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) =>
        credit.num_contrat_credit?.toLowerCase().includes(this.creditSearchTerm.toLowerCase()) ?? false
      );
    }
    if (this.selectedDate) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) => {
        if (!credit.date_declaration) return false;
        return credit.date_declaration === this.selectedDate;
      });
    }
    this.creditsFiltres = filteredCredits;
    this.creditPagesTotales = Math.ceil(this.creditsFiltres.length / this.creditLignesParPage);
    this.creditPagesTotales = Math.max(1, this.creditPagesTotales);
    this.creditPageActuelle = Math.max(1, Math.min(this.creditPageActuelle, this.creditPagesTotales));
    const startIndex = (this.creditPageActuelle - 1) * this.creditLignesParPage;
    const endIndex = startIndex + this.creditLignesParPage;
    this.creditsPagines = this.creditsFiltres.slice(startIndex, endIndex);
  }

  onCreditSearch() {
    this.creditPageActuelle = 1;
    this.updateCreditPagination();
  }

  filtrerCreditParDate() {
    this.creditPageActuelle = 1;
    this.updateCreditPagination();
  }

  changerCreditPage(page: number) {
    this.creditPageActuelle = page;
    this.updateCreditPagination();
  }

  selectionnerCredit(credit: CreditDto) {
    if (this.creditSelectionne?.num_contrat_credit === credit.num_contrat_credit) {
      this.fermerDetails();
    } else {
      this.creditSelectionne = credit;
    }
  }

  fermerDetails() {
    this.creditSelectionne = null;
  }

  fermerCredits() {
    this.fichierSelectionne = null;
    this.creditSelectionne = null;
    this.creditSearchTerm = '';
    this.selectedDate = '';
    this.creditPageActuelle = 1;
  }

  ajouterNouveauCredit() {
    if (this.fichierSelectionne) {
      this.router.navigate(['/credits/nouveau'], {
        queryParams: { id_excel: this.fichierSelectionne.id_fichier_excel }
      });
    }
  }

  ngOnDestroy() {
    if (this.loadCreditsSubscription) {
      this.loadCreditsSubscription.unsubscribe();
    }
  }
}
