import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { Router } from '@angular/router';
import { DeclarationsBAService } from '../../../core/services/declarationsBA/declarations-ba.service';
import { XmlDto } from '../../../core/dtos/DeclarationsBA/declarationsBA-dto';
import { SiRoleDirective } from '../../../core/directives/si-role.directive';
@Component({
  selector: 'app-fichiers-xml',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent,SiRoleDirective],
  providers:[DatePipe],
  templateUrl: './fichiers-xml.component.html',
  styleUrl: './fichiers-xml.component.scss'
  
})
export class FichiersXMLComponent implements OnInit {
  pageActuelle: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  dateActuelle:string='';
  fichiers: XmlDto[] = [];
  fichiersFiltres: XmlDto[] = [];
  fichiersPagines: XmlDto[] = [];
  
  constructor(
    private router: Router,
    private declarationsBAService: DeclarationsBAService,
    private dp:DatePipe
  ) {}

  ngOnInit(): void {
    this.chargerDeclarations();
  }

  private chargerDeclarations(): void {
    this.declarationsBAService.getTousLesDeclarations().subscribe({
      next: (declarations) => {
        this.fichiers = declarations;
        this.fichiersFiltres = [...this.fichiers];
        this.updatePaginatedData();
        console.log(this.fichiers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des déclarations:', error);
      }
    });
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
        fichier.nomFichierCorrection.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.nomFichierSuppression.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.nomFichierExcelSource.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.nomUtilisateurGenerateur.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const dateMatch = (!this.dateDebut || !this.dateFin) ||
        (new Date(fichier.dateHeureGenerationXml) >= new Date(this.dateDebut) &&
         new Date(fichier.dateHeureGenerationXml) <= new Date(this.dateFin));
     
      return searchMatch && dateMatch;
    });
    
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }
  
  telechargerLesFichiersDeCetteInstance(fichier: XmlDto): void {
    if (!fichier?.idFichierXml) {
      console.error('ID du fichier XML manquant');
      return;
    }

    this.declarationsBAService.telechargerDeclarations(fichier.idFichierXml).subscribe({
      next: (blob: Blob) => {
        const zipBlob = new Blob([blob], { type: 'application/zip' });
        const url = window.URL.createObjectURL(zipBlob);
        const lien = document.createElement('a');
        lien.href = url;
        this.dateActuelle=this.dp.transform(new Date(), 'dd-MM-yyyy')!;
        const nomFichierATelecharger = `declaration-ba_${this.dateActuelle}.zip`;
        lien.download = nomFichierATelecharger;
        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du fichier:', error);
      }
    });
  }
  
  marquerCommeSoumisALaBA(fichier: XmlDto): void {
    if (confirm('Sûr de vouloir archiver cette déclaration ?')) {
      this.declarationsBAService.archiverDeclaration(fichier.idFichierExcelSource).subscribe({
        next: (response) => {
          if (response.success) {
            this.chargerDeclarations();
            alert('Déclaration archivée avec succès');
          } else {
            alert('Erreur lors de l\'archivage : ' + response.message);
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'archivage :', error);
          alert('Une erreur est survenue lors de l\'archivage');
        }
      });
    }
  }

  supprimerFichier(fichier: XmlDto): void {
    if (confirm('Sûr de vouloir supprimer ce fichier ?')) {
      this.declarationsBAService.supprimerDeclaration(fichier.idFichierXml).subscribe({
        next: () => {
          this.fichiers = this.fichiers.filter(f => f.idFichierXml !== fichier.idFichierXml);
          this.fichiersFiltres = this.fichiersFiltres.filter(f => f.idFichierXml !== fichier.idFichierXml);
          this.updatePaginatedData();
          alert('Fichier supprimé avec succès.');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du fichier:', error);
          alert('Erreur lors de la suppression du fichier.');
        }
      });
    }
  }
  
  montrerIndiceLol(event: MouseEvent, type: string) {
    const button = event.target as HTMLElement;
    const tooltip = button.querySelector('.tooltip-text') as HTMLElement;
    if (tooltip) {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    }
  }
  
  cacherIndice(event: MouseEvent, type: string) {
    const button = event.target as HTMLElement;
    const tooltip = button.querySelector('.tooltip-text') as HTMLElement;
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }
  }
  
  naviguerVersGeneration(): void {
    this.router.navigate(['/fichiers-xml/generation']);
  }
}