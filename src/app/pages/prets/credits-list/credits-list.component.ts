import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PretDetailsComponent } from '../pret-details/pret-details.component';
import { CreditDto }  from '../../../core/dtos/Credits/credits';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { ExcelSelectionService } from '../../../core/services/excel/excel-selection.service';
import { PaginationComponent } from '../../../components/pagination/pagination.component';


@Component({
  selector: 'app-prets',
  standalone: true,
  imports: [CommonModule, FormsModule, PretDetailsComponent, PaginationComponent],
  templateUrl: './credits-list.component.html',
  styleUrls: ['./credits-list.component.scss']
})
export class CreditsListComponent implements OnInit {
  credits$: Observable<CreditDto[]> | undefined;
  private TousLesCredits: CreditDto[] = []; 
  private loadCreditsSubscription: Subscription | undefined;
  isLoading: boolean = false; 
  selectedExcelFile: any = null;

  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  creditSelectionne: CreditDto | null = null;

  pageActuelle: number = 1;
  lignesParPage: number = 5;
  PagesTotales: number = 1;
  CreditsPagines: CreditDto[] = [];
  CreditsFiltres: CreditDto[] = []; 

  errorMessage: string | null = null;
  excelSelectionSubscription: Subscription;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id_excel = params['id_excel'];
      if (id_excel) {
        this.selectedExcelFile = { id_fichier_excel: +id_excel };
        this.CreditsFiltres = this.CreditsFiltres.filter(c => c.id_excel === +id_excel);
        this.updatePagination();
      } else {
        this.selectedExcelFile = null;
      }
    });
    this.creditService.getCreditsActuelles().subscribe(credits => {
      this.TousLesCredits = credits;
      this.route.queryParams.subscribe(params => {
        const fichierId = params['fichierId'];
        if (fichierId) {
          this.CreditsFiltres = this.TousLesCredits.filter(credit => credit.id_excel === fichierId);
        } else {
          this.CreditsFiltres = this.TousLesCredits;
        }
        this.updatePagination();
      });
    });

    // Initial load or refresh of credits
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
    // this.CreditsFiltres = this.TousLesCredits.filter(credit => {
    //   if (!this.dateDebut && !this.dateFin) {
    //     return true;
    //   }
      
    //   // const creditDate = new Date(credit.date_declaration);
      
    //   if (isNaN(creditDate.getTime())) {
    //     console.warn('Invalid date format:', credit.date_declaration);
    //     return false;
    //   }
      
    //   // Apply start date filter if set
    //   if (this.dateDebut) {
    //     const debutDate = new Date(this.dateDebut);
    //     // Set time to beginning of day
    //     debutDate.setHours(0, 0, 0, 0);
    //     if (creditDate < debutDate) {
    //       return false;
    //     }
    //   }
      
    //   // Apply end date filter if set
    //   if (this.dateFin) {
    //     const finDate = new Date(this.dateFin);
    //     // Set time to end of day
    //     finDate.setHours(23, 59, 59, 999);
    //     if (creditDate > finDate) {
    //       return false;
    //     }
    //   }
      
    //   return true;
    // });
    
    // Reset to first page and update pagination
    this.pageActuelle = 1;
    this.updatePagination();
  }
  

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  

  updatePagination(): void {
    // Create a deep copy to avoid modifying the original data
    let filteredCredits = JSON.parse(JSON.stringify(this.TousLesCredits));

    // Apply search term filter if it exists
    if (this.searchTerm) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) =>
        credit.num_contrat_credit?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false
      );
    }

    // Apply date filters if they exist
    if (this.dateDebut || this.dateFin) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) => {
        if (!credit.date_declaration) return false;
        
        const creditDate = new Date(credit.date_declaration);
        if (isNaN(creditDate.getTime())) return false;
        
        const dateDebutValid = this.dateDebut ? new Date(this.dateDebut) : null;
        const dateFinValid = this.dateFin ? new Date(this.dateFin) : null;
        
        if (dateDebutValid && dateFinValid) {
          return creditDate >= dateDebutValid && creditDate <= dateFinValid;
        } else if (dateDebutValid) {
          return creditDate >= dateDebutValid;
        } else if (dateFinValid) {
          return creditDate <= dateFinValid;
        }
        
        return true;
      });
    }

    // Apply excel file filter if selected
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

  selectionnerCredit(credit: CreditDto): void {
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
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  loadCredits(): void {
    this.isLoading = true;      
    this.errorMessage = null; 

    this.loadCreditsSubscription?.unsubscribe();
    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({ 
        next: (credits) => {
          // Format dates in the credits array
          this.TousLesCredits = credits.map((credit: CreditDto) => ({
            ...credit,
            date_declaration: this.formatDate(credit.date_declaration)
          }));
          this.updatePagination();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.message;
          this.isLoading = false; 
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }


  annulerSelection(event: Event) {
    event.stopPropagation();
    this.selectedExcelFile = null;
    this.CreditsFiltres = this.TousLesCredits;
    this.updatePagination();
  }

 

  
}

 
