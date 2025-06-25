import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditDto, CreditsListeDto } from '../../../core/dtos/Credits/credits';
import { CreditStateService } from '../../../core/services/credits/credit-state.service';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SiRoleDirective } from '../../../core/directives/si-role.directive';
import { DevisePipe } from '../devise.pipe';




@Component({
  selector: 'app-pret-details',
  standalone: true,
  imports: [CommonModule, SiRoleDirective, DevisePipe],
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss'],
})
export class CreditDetailsComponent implements OnInit {
  @Input() pret!: CreditsListeDto;
  @Input() fromCreditsList: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  isLoading: boolean = true;
  error: string | null = null;
  creditDetails: CreditDto | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditStateService: CreditStateService,
    private creditsService: CreditsService
  ) {}

  ngOnInit() {
    if (this.pret?.num_contrat_credit && this.pret?.date_declaration) {
      this.loadCreditDetails(this.pret.num_contrat_credit, this.pret.date_declaration);
    } else {
      this.error = 'Infos manquantes';
      this.isLoading = false;
    }
  }


  private loadCreditDetails(numContrat: string, dateDeclaration: string): void {
    this.isLoading = true;
    this.error = null;
    const formattedDate = formatDate(dateDeclaration, 'yyyy-MM-dd', 'en-US');
    const date = new Date(formattedDate);
    
    this.creditsService.getCreditDetails(numContrat, date)
      .pipe(
        catchError((error: any) => {
          this.error = 'Erreur lors du chargement des détails du crédit';
          console.error('Error loading credit details:', error);
          return of([]);
        })
      )
      .subscribe((credits: any) => {
        this.creditDetails = (Array.isArray(credits) && credits.length > 0) ? credits[0] : null;
        
        if (!this.creditDetails) {
          this.error = 'Aucun détail de crédit trouvé';
        }
        
        this.isLoading = false;
      });
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    const creditToEdit = this.creditDetails;
    if (!creditToEdit?.num_contrat_credit) {
      console.error('Cannot edit: Missing credit information');
      return;
    }
    
    this.creditStateService.setSelectedCredit(creditToEdit);
    this.creditStateService.setEditMode(true);
    this.router.navigate(['/credits/modifier', creditToEdit.num_contrat_credit])
      .catch(error => {
        console.error('Navigation error:', error);
      });
  }

  onDelete() {
    if (!this.creditDetails?.num_contrat_credit || !this.creditDetails.date_declaration) {
      console.error('Cannot delete: Missing credit information');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce crédit ? Cette action est irréversible.')) {
      this.isLoading = true;
      const dateDeclaration = new Date(this.creditDetails.date_declaration);
      
      this.creditsService.supprimerCredit(this.creditDetails.num_contrat_credit, dateDeclaration)
        .subscribe({
          next: (errors) => {
            if (errors && errors.length > 0) {
              this.error = `Erreur lors de la suppression : ${errors.join(', ')}`;
            } else {
              // Emit the delete event to parent component if needed
              this.delete.emit();
              
              // If not in a list context, navigate back
              if (!this.fromCreditsList) {
                this.router.navigate(['/credits']).catch(console.error);
              }
            }
            this.isLoading = false;
          },
          error: (error) => {
            this.error = 'Une erreur est survenue lors de la suppression du crédit';
            console.error('Error deleting credit:', error);
            this.isLoading = false;
          }
        });
    }
  }
}
