import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { CreditDetailsComponent } from '../../../credits/credit-details/credit-details.component';
import { SiRoleDirective } from '../../../../core/directives/si-role.directive';

@Component({
  selector: 'app-credits-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, CreditDetailsComponent,SiRoleDirective],
  templateUrl: './credits-list.component.html',
  styleUrls: ['./credits-list.component.css']
})
export class CreditsListComponent {
  @Input() fichierSelectionne: any;
  @Input() creditsPagines: any[] = [];
  @Input() creditSelectionne: any;
  @Input() creditSearchTerm: string = '';
  @Input() selectedDate: string = '';
  @Input() datesDeclaration: string[] = [];
  @Input() creditsFiltres: any[] = [];
  @Input() creditPageActuelle: number = 1;

  @Output() fermerCredits = new EventEmitter<void>();
  @Output() ajouterNouveauCredit = new EventEmitter<void>();
  @Output() creditSearch = new EventEmitter<void>();
  @Output() filtrerCreditParDate = new EventEmitter<void>();
  @Output() selectionnerCredit = new EventEmitter<any>();
  @Output() fermerDetails = new EventEmitter<void>();
  @Output() changerCreditPage = new EventEmitter<number>();
} 