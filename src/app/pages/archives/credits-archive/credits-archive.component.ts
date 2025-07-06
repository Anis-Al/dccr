import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ArchiveService } from '../../../core/services/archive.service';
import { ArchiveCreditsListeDto, ArchiveCreditDetailResponse } from '../../../core/dtos/archive-dtos';
import { CreditDetailsComponent } from '../../credits/credit-details/credit-details.component';

@Component({
  selector: 'app-credits-archive',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, CreditDetailsComponent],
  providers: [DatePipe],
  templateUrl: './credits-archive.component.html',
  styleUrls: ['./credits-archive.component.scss']
})
export class CreditsArchiveComponent implements OnInit {
  pageActuelle: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  searchTerm: string = '';
  selectedDate: string = '';
  datesDeclaration: string[] = [];
  credits: ArchiveCreditsListeDto[] = [];
  creditsFiltres: ArchiveCreditsListeDto[] = [];
  creditsPagines: ArchiveCreditsListeDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedCredit: ArchiveCreditDetailResponse = null;
  showDetails: boolean = false;

  constructor(
    private dp: DatePipe,
    private archiveService: ArchiveService
  ) {}

  private isDetailsLoading = false;

  onCreditSelect(credit: ArchiveCreditsListeDto): void {
    if (this.isDetailsLoading || !credit.num_contrat_credit || !credit.date_declaration) {
      return;
    }

    this.isDetailsLoading = true;
    this.errorMessage = '';
    this.isLoading = true;

    // Add a small delay to prevent UI flickering for fast responses
    const startTime = Date.now();
    const minLoadingTime = 300; // 300ms minimum loading time

    this.archiveService.getDetailsCreditArchive(
      credit.num_contrat_credit,
      new Date(credit.date_declaration)
    ).subscribe({
      next: (response) => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);
        
        setTimeout(() => {
          this.selectedCredit = response;
          this.showDetails = true;
          this.isLoading = false;
          this.isDetailsLoading = false;
        }, remainingTime);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails du crédit:', error);
        this.errorMessage = 'Impossible de charger les détails du crédit. Veuillez réessayer.';
        this.isLoading = false;
        this.isDetailsLoading = false;
      }
    });
  }

  onCloseDetails(): void {
    this.showDetails = false;
    this.selectedCredit = null;
  }

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
        this.extraireDatesDeclaration();
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des crédits archivés:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des crédits archivés.';
        this.isLoading = false;
      }
    });
    this.updatePaginatedData();
  }

  onPageChange(page: number): void {
    this.pageActuelle = page;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.pageActuelle - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.creditsPagines = this.creditsFiltres.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.creditsFiltres.length / this.itemsPerPage);
  }

  private extraireDatesDeclaration(): void {
    // Extract unique dates for the filter
    const datesUniques = new Set<string>();
    this.credits.forEach(credit => {
      if (credit.date_declaration) {
        const dateStr = new Date(credit.date_declaration).toISOString().split('T')[0];
        datesUniques.add(dateStr);
      }
    });
    this.datesDeclaration = Array.from(datesUniques).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }

  onSearch(): void {
    const searchLower = this.searchTerm.toLowerCase();
    
    if (searchLower) {
      this.creditsFiltres = this.credits.filter(credit => 
        (credit.num_contrat_credit && credit.num_contrat_credit.toLowerCase().includes(searchLower)) ||
        (credit.libelle_type_credit && credit.libelle_type_credit.toLowerCase().includes(searchLower)) ||
        (credit.libelle_situation && credit.libelle_situation.toLowerCase().includes(searchLower)) ||
        (credit.libelle_activite && credit.libelle_activite.toLowerCase().includes(searchLower))
      );
    } else {
      this.creditsFiltres = [...this.credits];
    }
    
    this.filtrerParDate();
  }

  filtrerParDate(): void {
    if (!this.selectedDate) {
      // If no date is selected, keep the current filtered results
      return;
    }

    this.creditsFiltres = this.creditsFiltres.filter(credit => {
      if (!credit.date_declaration) return false;
      const creditDate = new Date(credit.date_declaration).toISOString().split('T')[0];
      return creditDate === this.selectedDate;
    });
    
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }

} 