import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Utilisateur, ROLES } from '../../core/dtos/Utilisateurs/utilisateur-dto';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UtilisateurService } from '../../core/services/auth&utilisateurs/utilisateur.service';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
  
  pageActuelle = 1;
  lignesParPage = 5;
  searchTerm = '';
  selectedRole = '';
  utilisateursFiltres: Utilisateur[] = [];
  utilisateursPagines: Utilisateur[] = [];
  roles = ROLES;

  constructor(private router: Router, private userService: UtilisateurService) {}

  utilisateurs: Utilisateur[] = [];

  ngOnInit() {
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isPageReload = navigation.type === 'reload';
    
    if (isPageReload) {
      this.userService.viderCacheUtilisateurs();
      this.rafraichirDonnees();
    } else {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.utilisateurs = users;
        this.updateFiltres();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  rafraichirDonnees() {
    this.userService.rafraichirUtilisateurs().subscribe({
      next: (users) => {
        this.utilisateurs = users;
        this.updateFiltres();
      },
      error: (error) => {
        console.error('Erreur lors du rafraîchissement des utilisateurs:', error);
      }
    });
  }

  updateFiltres() {
    this.utilisateursFiltres = this.utilisateurs.filter(user => {
      const matchSearch = !this.searchTerm || 
        user.nom_complet.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.matricule.toString().includes(this.searchTerm);
      const matchRole = !this.selectedRole || user.role === this.selectedRole;
      return matchSearch && matchRole;
    });
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.utilisateursPagines = this.utilisateursFiltres.slice(startIndex, endIndex);
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updateFiltres();
  }

  ajouterNouvelUtilisateur() {
    this.router.navigate(['/utilisateurs/nouveau']);
  }

  supprimerUtilisateur(user: Utilisateur) {
    if (confirm(`Sûr de vouloir supprimer l'utilisateur ${user.nom_complet} ?`)) {
      this.userService.suppUtilisateur(user.matricule).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
      });
    }
  }

  editerUtilisateur(user: Utilisateur) {
    this.router.navigate(['/utilisateurs', user.matricule]);
  }

  getRoleLabel(role: string): string {
    const found = this.roles.find(r => r.value === role);
    return found ? found.key : role;
  }
}