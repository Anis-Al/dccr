import { Injectable } from '@angular/core';
import { Credit, Intervenant, Garantie } from '../models/credits';

@Injectable({
  providedIn: 'root'
})
export class GenererDonneesFictivesService {

  getMockCredits(count: number = 10): Credit[] {
    return Array(count).fill(0).map((_, i) => this.createMockCredit(i));
  }

  public createMockCredit(index: number): Credit {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - Math.floor(Math.random() * 12));
    
    return {
      numContrat: `CTR${(index + 1).toString().padStart(4, '0')}`,
      typeCredit: (index % 3) + 1,
      libelleTypeCredit: ['Crédits à l’exportation', 'Crédits de trésorerie', 'Crédits professionnels','Crédits aidés'][index % 3],
      plafondAccorde: index % 2 === 0,
      numeroPlafond: index % 2 === 0 ? `PLF${index.toString().padStart(4, '0')}` : undefined,
      codeActivite: Math.floor(Math.random() * 100) + 1,
      libelleActivite: ['Agriculture, Chasse, Services Annexe', 'Pêche, Aquaculture','Industrie du Papier et du Carton', 'Industrie Textile'][index % 4],
      situation: (index % 3) + 1,
      libelleSituation: ['Crédit régulier', 'Crédit rejeté', 'Crédit impayé'][index % 3],
      motif: index % 5 === 0 ? 'Motif spécial' : undefined,
      intervenants: [this.createMockIntervenant(index)],
      codeAgence: Math.floor(Math.random() * 100) + 1,
      libelleAgence: `Agence ${String.fromCharCode(65 + (index % 5))}`,
      codeWilaya: Math.floor(Math.random() * 48) + 1,
      libelleWilaya: `Wilaya ${index % 48 + 1}`,
      codePays: 1,
      libellePays: 'Algérie',
      creditsAccorde: Math.floor(Math.random() * 1000000) + 50000,
      dev: 1,
      libelleDev: 'DZD',
      tauxInterets: Math.random() * 10 + 1,
      coutCredits: Math.floor(Math.random() * 50000) + 1000,
      mensualite: Math.floor(Math.random() * 10000) + 500,
      dureeInit: Math.floor(Math.random() * 120) + 12,
      libelleDureeInitiale: `${Math.floor(Math.random() * 10) + 1} ans`,
      dureeRestante: Math.floor(Math.random() * 60) + 6,
      libelleDureeRestante: `${Math.floor(Math.random() * 5) + 1} ans`,
      classeRetard: index % 5 === 0 ? Math.floor(Math.random() * 4) + 1 : 0,
      libelleClasseRetard: index % 5 === 0 ? 
        ["Jusqu'à 30 jours", "Plus de 30 à 60 jours", "Plus de 60 à 90 jours", "Plus de 90 jours"][Math.floor(Math.random() * 4)] : '',
      nombreEcheancesImpayes: index % 5 === 0 ? Math.floor(Math.random() * 5) : 0,
      dateConstatationEcheancesImpayes: index % 5 === 0 ? startDate.toISOString().split('T')[0] : startDate.toISOString().split('T')[0],
      montantCapitalRetard: index % 5 === 0 ? Math.floor(Math.random() * 10000) : Math.floor(Math.random() * 10000),
      montantInteretsRetard: index % 5 === 0 ? Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000),
      montantInteretsCourus: Math.floor(Math.random() * 1000),
      dateOctroi: startDate.toISOString().split('T')[0],
      dateExpiration: new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()).toISOString().split('T')[0],
      dateDeclaration: startDate.toISOString().split('T')[0],
      dateRejet: index % 10 === 0 ? new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()).toISOString().split('T')[0] : startDate.toISOString().split('T')[0],
      garanties: [this.createMockGarantie(index)],
      source: {
        type: index % 3 === 0 ? 'manual' : 'excel',
        fileId: index % 3 === 0 ? undefined : `file_${index}`,
        fileName: index % 3 === 0 ? undefined : `import_${startDate.toISOString().split('T')[0]}.xlsx`,
        importDate: index % 3 === 0 ? undefined : startDate.toISOString().split('T')[0],
        createdBy: index % 3 === 0 ? 'admin' : 'system'
      }
    };
  }

  public createMockIntervenant(index: number): Intervenant {
    return {
      cle: `CLI${index.toString().padStart(4, '0')}`,
      typeCle: ['PP', 'PM'][index % 2],
      niveauResponsabilite: index % 3 + 1,
      libelleNiveauResponsabilite: ['Emprunteur', 'Co-emprunteur', 'Garant'][index % 3],
      nif: `NIF${index.toString().padStart(8, '0')}`,
      rib: `RIB${index.toString().padStart(12, '0')}`,
      cli: `CLI${index.toString().padStart(6, '0')}`,
      soldeRestant: Math.floor(Math.random() * 100000) + 1000
    };
  }

  public createMockGarantie(index: number): Garantie {
    return {
      intervenant: `CLI${index.toString().padStart(4, '0')}`,
      type: (index % 3) + 1,
      libelleType: ['Hypothèque', 'Caution', 'Nantissement'][index % 3],
      montant: Math.floor(Math.random() * 500000) + 50000
    };
  }
}
