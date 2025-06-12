import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../components/pagination/pagination.component';
import { CreditDto } from '../../../../../core/dtos/Credits/credits';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReponseIntegrationDto } from '../../../../../core/dtos/Excel/integration-response.dto';
import { ApiService } from '../../../../../core/services/excel/api.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  providers: [ApiService],
  templateUrl:'./resultat.component.html',
  styleUrls: ['./resultat.component.css']
})
export class ResultatComponent implements OnInit {
  result!: ReponseIntegrationDto;
  fileName: string = '';
  showErrorCase = true;
  apercuDonnees: any[] = [];
  idExcel: number | undefined;
  Math = Math; // Make Math available in the template
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aps:ApiService
  ) 
  {
  }

  get erreurs() {
    return this.result?.erreurs || [];
  }
  currentValidPage = 1;
  currentInvalidPage = 1;
  itemsPerPage = 5; // Show 5 items per page
  showErrorPopup = true;
  showSuccess = false;
  successMessage = '';
  expandedRows: boolean[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['result']) {
        this.result = JSON.parse(params['result']);
        this.idExcel = this.result.idExcel; 
        this.apercuDonnees = this.result?.apercuDonnees || [];
      }
      if (params['fileName']) {
        this.fileName = params['fileName'];
      }
    });
    const lastView = sessionStorage.getItem('lastResultView');
    this.showErrorCase = lastView !== 'correct';
    sessionStorage.setItem('lastResultView', this.showErrorCase ? 'correct' : 'error');
  }

  changeValidPage(page: number) {
    this.currentValidPage = page;
  }

  get paginatedErreurs() {
    const startIndex = (this.currentInvalidPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.erreurs.slice(startIndex, endIndex);
  }

  changeInvalidPage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.erreurs.length / this.itemsPerPage)) {
      this.currentInvalidPage = page;
    }
  }

  closePopup() {
    this.showErrorPopup = false;
  }

  goBack() {
    this.router.navigate(['/fichiers-excel/integration']);
  }

  exportErrors() {
    // TO DO: implement export errors functionality
  }

  confirmInsertion() {
    console.log('Result before API call:', this.result); // Debugging log
    console.log('idExcel before API call:', this.idExcel); // Debugging log

    if (!this.result || !this.idExcel) {
      console.error('Result or idExcel is undefined. Cannot confirm integration.');
      alert('Une erreur est survenue : Les données nécessaires sont manquantes.');
      return;
    }

    this.aps.confirmerIntegration(this.idExcel).subscribe({
      next: (response) => {
        this.showSuccessPopup('Les crédits ont été insérés avec succès!');
        this.router.navigate(['/credits']);
      },
      error: (err) => {
        console.error('Erreur lors de la confirmation de l\'intégration:', err);
        alert('Une erreur est survenue lors de la confirmation de l\'intégration.');
      }
    });
  }

  showSuccessPopup(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 5000);
  }

  toggleRow(index: number) {
    this.expandedRows[index] = !this.expandedRows[index];
  }

  telechargerFichierErreurs(): void {

    if (!this.idExcel) {
      return;
    }
    window.alert('Téléchargement du fichier en cours...');
    
    this.aps.telechargerFichierErreursExcel(this.idExcel).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob || blob.size === 0) {
          window.alert('Le fichier de téléchargement est vide.');
          return;
        }

        const filename = this.extraireNomFichier(response) ?? `erreurs_${this.result.NomFichierExcel}.xlsx`;
        this.declencherTelechargement(blob, filename);
        this.router.navigate(['/fichiers-excel/integration']);
      },
      error: (err) => {
        window.alert(`Erreur lors du téléchargement: ${err.status}`);
      }
    });
  }
  private extraireNomFichier(reponse: HttpResponse<Blob>): string | null {
    const contentDisposition = reponse.headers.get('content-disposition');
    if (!contentDisposition) return null;

    const matches = /filename[^;=\n]*=(?:(['"])(.*?)\1|([^;\n]*))/i.exec(contentDisposition);
    let nomFichier = (matches && matches[3] ? matches[3].trim() : (matches && matches[2] ? matches[2].trim() : null));

    if (nomFichier) {
      try {
        return decodeURIComponent(nomFichier);
      } catch (e) {
        return nomFichier;
      }
    }
    return null; 
  }
  private declencherTelechargement(blob: Blob, nomFichier: string): void {
    const url = window.URL.createObjectURL(blob);
    const ancre = document.createElement('a');
    ancre.href = url;
    ancre.download = nomFichier;
    ancre.style.display = 'none';
    document.body.appendChild(ancre);
    ancre.click();
    document.body.removeChild(ancre);
    window.URL.revokeObjectURL(url);
  }
}
