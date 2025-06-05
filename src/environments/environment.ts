export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:44307/api/',
  endpoints: {
    excel: {
      integrationPart1: 'Excel/importer',
      integrationPart2:'Excel/confirmer-integration',
      exportationErreurs: 'Excel/exporter-erreurs-excel', 
      tousLesFichiersExcelEnCours: 'Excel/get-tous-metadonnes-excel',
      telechargerModele:'',
      supprimerFichierExcel:'Excel/supprimer-fichier-excel',
    },
    credits: {
      tousLesCreditsEnCours: 'credits/get-tous-credits',
      tableDomaines: 'credits/get-tables-domaines',
      ajouterCredit: 'credits/nouveau',
    },
    declarationsBA :{
     tousLesDeclarations:'declarationsBA',
     genererDeclarationsParExcel :'declarationsBA/generer-declarations',
     telechargerDeclarations:'declarationsBA/telecharger-declarations',
     archiverDonnees:'declarationsBA/archiver-donnees',
    },
    utilisateurs: {
      tousLesUtilisateurs: 'utilisateurs',
      ajouterUtilisateur: 'utilisateurs/ajouter-utilisateur',
      majUtilisateur: 'utilisateurs/modifier-utilisateur',
      supprimerUtilisateur: 'utilisateurs/supprimer-utilisateur',
    },
    auth: {
      login: 'auth',
    }  
  }
};
