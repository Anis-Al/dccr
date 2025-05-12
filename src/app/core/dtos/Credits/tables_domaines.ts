export interface TablesDomainesDto {
  nom_table: string;
  valeurs: ValeursTableDomaines[];
}

export interface ValeursTableDomaines {
  code: string;
  domaine: string;
}
