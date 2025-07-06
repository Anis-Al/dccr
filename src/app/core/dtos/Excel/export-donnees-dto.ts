/**
 * DTO pour l'exportation de données vers Excel
 * @template T Type des données à exporter
 */
export interface ExportDonneesDto<T> {
  /** Données à exporter */
  donnees: T[];
  
  /** Nom de la feuille Excel (optionnel) */
  nomFeuille?: string;
}
