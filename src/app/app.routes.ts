import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'tableau-de-bord',
        pathMatch: 'full'
      },
      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import('./pages/tableau-de-bord/tableau-de-bord.component').then(m => m.TableauDeBordComponent)
      },
      {
        path: 'credits',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/prets/credits-list/credits-list.component').then(m => m.CreditsListComponent)
          },
          {
            path: 'nouveau',
            loadComponent: () =>
              import('./pages/prets/pret-form/pret-form.component').then(m => m.PretFormComponent)
          },
          {
            path: 'modifier/:id',
            loadComponent: () =>
              import('./pages/prets/pret-form/pret-form.component').then(m => m.PretFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/prets/pret-details/pret-details.component').then(m => m.PretDetailsComponent)
          }
        ]
      },
      {
        path: 'fichiers-excel',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/fichiers-excel/fichiers-excel.component').then(m => m.FichiersExcelComponent)
          },
          {
            path: 'integration',
            loadComponent: () =>
              import('./pages/fichiers-excel/traitement/chargement/chargement.component').then(m => m.ChargementComponent)
          },
          {
            path: 'resultat',
            loadComponent: () =>
              import('./pages/fichiers-excel/traitement/resultat/resultat/resultat.component').then(m => m.ResultatComponent)
          }
        ]
      },
      {
        path: 'declarations-ba',
        loadComponent: () =>
          import('./pages/fichiers-xml/fichiers-xml.component').then(m => m.FichiersXMLComponent)
      },
      {
        path: 'archives',
        loadComponent: () =>
          import('./pages/archives/archives.component').then(m => m.ArchivesComponent)
      },
      {
        path: 'journaux-audit',
        loadComponent: () =>
          import('./pages/journaux-audit/journaux-audit.component').then(m => m.JournauxAuditComponent)
      },
      {
        path: 'utilisateurs',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent)
          },
          {
            path: 'nouveau',
            loadComponent: () =>
              import('./pages/utilisateurs/user-form/user-form.component').then(m => m.UserFormComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tableau-de-bord'
  }
];
