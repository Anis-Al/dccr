import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DeclarationsBAService } from '../../../core/services/declarationsBA/declarations-ba.service';
import { ExcelCrudService } from '../../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../../core/dtos/Excel/excel-metadonnees-dto';
import { AuthService } from '../../../core/services/auth&utilisateurs/auth.service';

@Component({
  selector: 'app-fichiers-xml-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fichiers-xml-generation.component.html',
  styleUrls: ['./fichiers-xml-generation.component.scss']
})
export class FichiersXmlGenerationComponent implements OnInit {

  searchTerm: string = '';  
  fichiersExcel: ExcelMetadonneesDto[] = [];
  isChargementFichiers: boolean = false;
  fichierSelectionne: ExcelMetadonneesDto | null = null;
  isLoading: boolean = false;
  messageErreur: string = '';
  messageSucces: string = '';
  
  constructor(
    private router: Router, 
    private declarationsService: DeclarationsBAService,
    private excelService: ExcelCrudService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.chargerFichiersExcel();
  }
  
  chargerFichiersExcel(): void {
    this.isChargementFichiers = true;
    this.excelService.getMetadonneesPourGenerationDeclarations()
      .subscribe({
        next: (fichiers) => {
          this.fichiersExcel = fichiers;
          this.isChargementFichiers = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des métadonnées pour la génération des déclarations', error);
          this.isChargementFichiers = false;
          this.messageErreur = 'Impossible de charger les métadonnées pour la génération des déclarations.';
        }
      });
  }
  
  get fichiersExcelFiltres(): ExcelMetadonneesDto[] {
    if (!this.searchTerm.trim()) {
      return this.fichiersExcel;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    return this.fichiersExcel.filter(fichier => 
      fichier.nom_fichier_excel?.toLowerCase().includes(searchTermLower) ||
      fichier.integrateur?.toLowerCase().includes(searchTermLower)
    );
  }
  
  selectionnerFichier(fichier: ExcelMetadonneesDto): void {
    this.fichierSelectionne = fichier;
    this.messageErreur = '';
    this.messageSucces = '';
  }
  
  genererXML(): void {
    if (!this.fichierSelectionne) return;
    
    this.isLoading = true;
    this.messageErreur = '';
    this.messageSucces = '';
    
    const userInfo = this.authService.getUserInfo();
    const matricule = userInfo ? userInfo.matricule : '';
    
    this.declarationsService.genererDeclarations(this.fichierSelectionne.id_fichier_excel, matricule)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageSucces = 'Le fichier XML a été généré avec succès.';
          this.router.navigate(['/fichiers-xml']);
        },
        error: () => {
          this.isLoading = false;
          this.messageErreur = 'Une erreur est survenue lors de la génération du fichier XML. Veuillez réessayer.';
        }
      });
  }
  
  getNomFichierSansExtension(nomFichier: string): string {
    if (!nomFichier) return '';
    return nomFichier.replace(/\.[^/.]+$/, '');
  }
  
  annuler(): void {
    this.fichierSelectionne = null;
    this.messageErreur = '';
    this.messageSucces = '';
  }
  
  retourListe(): void {
    this.router.navigate(['/fichiers-xml']);
  }
}
