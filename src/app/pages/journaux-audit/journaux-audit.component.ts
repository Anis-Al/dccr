import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';

interface AuditLog {
  id: string;
  utilisateur: string;
  action: string;
  ressource: string;
  details: string;
  date: Date;
  niveau: 'Info' | 'Avertissement' | 'Erreur';
}

@Component({
  selector: 'app-journaux-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './journaux-audit.component.html',
  styleUrls: ['./journaux-audit.component.scss']
})

export class JournauxAuditComponent implements OnInit {
  pageActuelle = 1;
  lignesParPage = 5;
  journauxFiltres: AuditLog[] = [];
  journauxPagines: AuditLog[] = [];
  journalSelectionne: AuditLog | null = null;
  
  searchTerm = '';
  selectedPeriode = '';
  selectedAction = '';
  
  journaux: AuditLog[] = [
  ];

  ngOnInit() {
    this.journauxFiltres = this.journaux;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.journauxPagines = this.journauxFiltres.slice(startIndex, endIndex);
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }
  
  onSearch() {
    this.filtrerJournaux();
  }
  
  filtrerParPeriode() {
    this.filtrerJournaux();
  }
  
  filtrerParAction() {
    this.filtrerJournaux();
  }
  
  filtrerJournaux() {
    this.journauxFiltres = this.journaux.filter(journal => {
      // Filtre par terme de recherche
      const matchesSearch = !this.searchTerm || 
        journal.utilisateur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        journal.ressource.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par action
      const matchesAction = !this.selectedAction || 
        journal.action.toLowerCase() === this.selectedAction.toLowerCase();
      
      // Filtre par période
      let matchesPeriode = true;
      if (this.selectedPeriode) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const journalDate = new Date(journal.date);
        
        if (this.selectedPeriode === 'today') {
          const endOfDay = new Date(today);
          endOfDay.setHours(23, 59, 59, 999);
          matchesPeriode = journalDate >= today && journalDate <= endOfDay;
        } else if (this.selectedPeriode === 'week') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          matchesPeriode = journalDate >= startOfWeek && journalDate <= endOfWeek;
        } else if (this.selectedPeriode === 'month') {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
          matchesPeriode = journalDate >= startOfMonth && journalDate <= endOfMonth;
        }
      }
      
      return matchesSearch && matchesAction && matchesPeriode;
    });
    
    this.pageActuelle = 1;
    this.updatePagination();
  }
  
  trackByJournal(index: number, journal: AuditLog): string {
    return journal.id;
  }
  
  selectionnerJournal(journal: AuditLog) {
    this.journalSelectionne = journal;
    document.querySelector('.journaux-list')?.classList.add('with-details');
  }
  
  fermerDetails() {
    this.journalSelectionne = null;
    document.querySelector('.journaux-list')?.classList.remove('with-details');
  }
}