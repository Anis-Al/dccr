import { CreditDto } from './Credits/credits';

export interface ArchiveExcelMetadonneesDto {
  idFichierExcel: number;
  nomFichierExcel: string;
  cheminFichierExcel: string;
  dateHeureIntegrationExcel: Date;
  integrateur: string;
}

export interface ArchiveXmlDto {
  idFichierXml: number;
  nomFichierCorrection: string;
  nomFichierSuppression: string;
  dateHeureGenerationXml: Date;
  nomUtilisateurGenerateur: string;
  IdFichierExcelSource: number;
  nomFichierExcelSource: string;
}

export interface ArchiveCreditsListeDto {
  num_contrat_credit: string | null;
  date_declaration: string | null;
  libelle_type_credit: string | null;
  libelle_activite: string | null;
  libelle_situation: string | null;
  id_excel: number | null;
}

export interface ArchiveCreditDetailDto extends CreditDto {

}

export type ArchiveCreditDetailResponse = ArchiveCreditDetailDto | null;
