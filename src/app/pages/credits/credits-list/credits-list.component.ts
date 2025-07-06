import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditDetailsComponent } from '../credit-details/credit-details.component';
import { CreditDto, CreditsListeDto }  from '../../../core/dtos/Credits/credits';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { ExcelSelectionService } from '../../../core/services/excel/excel-selection.service';
import { PaginationComponent } from '../../../components/pagination/pagination.component';


@Component({
  selector: 'app-prets',
  standalone: true,
  imports: [CommonModule, FormsModule, CreditDetailsComponent, PaginationComponent],
  templateUrl: './credits-list.component.html',
  styleUrls: ['./credits-list.component.scss']
})
export class CreditsListComponent implements OnInit {
  credits$: Observable<CreditsListeDto[]> | undefined;
  private TousLesCredits: CreditsListeDto[] = []; 
  private loadCreditsSubscription: Subscription | undefined;
  isLoading: boolean = false; 
  selectedExcelFile: any = null;

  searchTerm: string = '';
  selectedDate: string = '';
  datesDeclaration: string[] = [];
  creditSelectionne: CreditsListeDto | null = null;

  pageActuelle: number = 1;
  lignesParPage: number = 5;
  PagesTotales: number = 1;
  CreditsPagines: CreditsListeDto[] = [];
  CreditsFiltres: CreditsListeDto[] = []; 

  errorMessage: string | null = null;
  excelSelectionSubscription: Subscription;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id_excel = params['id_excel'];
      if (id_excel) {
        this.selectedExcelFile = { id_fichier_excel: +id_excel };
      } else {
        this.selectedExcelFile = null;
      }
    });
    this.loadCredits();
}

  constructor(
    private router: Router,
    private creditService: CreditsService,
    private excelSelectionService: ExcelSelectionService,
    private route: ActivatedRoute
  ) {
    this.excelSelectionSubscription = this.excelSelectionService.selectedExcel$.subscribe(excel => {
      this.selectedExcelFile = excel;
    });
  }
  ngOnDestroy() {
    if (this.excelSelectionSubscription) {
      this.excelSelectionSubscription.unsubscribe();
    }
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  filtrerParDate() {
    this.pageActuelle = 1;
    this.updatePagination();
  }
  
  
  extractUniqueDates() {
    const uniqueDates = new Set<string>();
    
    this.TousLesCredits.forEach(credit => {
      if (credit.date_declaration) {
        const formattedDate = this.formatDate(credit.date_declaration);
        uniqueDates.add(formattedDate);
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
  

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  

  updatePagination(): void {
    let filteredCredits = JSON.parse(JSON.stringify(this.TousLesCredits));

    if (this.searchTerm) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) =>
        credit.num_contrat_credit?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false
      );
    }

    if (this.selectedDate) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) => {
        if (!credit.date_declaration) return false;
        const formattedCreditDate = credit.date_declaration;
        return formattedCreditDate 
      });
    }

    if (this.selectedExcelFile?.id_fichier_excel) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) => 
        credit.id_excel === this.selectedExcelFile.id_fichier_excel
      );
    }

    this.CreditsFiltres = filteredCredits;
    this.PagesTotales = Math.ceil(this.CreditsFiltres.length / this.lignesParPage);
    this.PagesTotales = Math.max(1, this.PagesTotales);
    this.pageActuelle = Math.max(1, Math.min(this.pageActuelle, this.PagesTotales));

    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.CreditsPagines = this.CreditsFiltres.slice(startIndex, endIndex);
  }

  async nouveauCredit() {
    try {
      console.log('Starting navigation...');
      console.log('Selected Excel File:', this.selectedExcelFile);
      
      const navigationExtras = this.selectedExcelFile?.id_fichier_excel 
        ? { 
            queryParams: { id_excel: this.selectedExcelFile.id_fichier_excel },
            queryParamsHandling: 'merge' as const
          }
        : undefined;
      
      console.log('Navigation extras:', navigationExtras);
      
      const result = await this.router.navigate(
        ['/credits/nouveau'], 
        navigationExtras
      );
      
      console.log('Navigation result:', result);
      
      if (!result) {
        console.error('Navigation failed: No route matched');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  selectionnerCredit(credit: CreditsListeDto): void {
    if (this.creditSelectionne?.num_contrat_credit === credit.num_contrat_credit) {
        this.fermerDetails(); 
    } else {
        this.creditSelectionne = credit;
    }
}

  fermerDetails(): void {
      this.creditSelectionne = null;
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

  annulerSelection(event: Event) {
    event.stopPropagation();
    this.selectedExcelFile = null;
    this.selectedDate = ''; 
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id_excel: null },
      queryParamsHandling: 'merge'
    });
    this.CreditsFiltres = this.TousLesCredits;
    this.updatePagination();
  }

  loadCredits(): void {
    this.isLoading = true;      
    this.errorMessage = null; 

    this.loadCreditsSubscription?.unsubscribe();
    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({ 
        next: (credits) => {
          this.TousLesCredits = credits.map((credit: CreditsListeDto) => ({
            ...credit,
          }));
          
          this.extractUniqueDates();
          this.updatePagination();
        },
        error: (err) => {
          this.errorMessage = err?.message;
          this.isLoading = false; 
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  
}

 
