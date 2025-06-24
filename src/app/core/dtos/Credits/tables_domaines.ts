export interface TablesDomainesDto {
  nom_table: string;
  valeurs: ValeursTableDomaines[];
}

export interface ValeursTableDomaines {
  code: string;
  domaine: string;
}

export const TYPE_CLE_OPTIONS = [
  { code: 'i1', domaine: 'Particulier' },
  { code: 'i2', domaine: 'Entrepreneur individuel' },
  { code: 'i3', domaine: 'Entreprise' },
  { code: 'i4', domaine: 'Autre' }
];
