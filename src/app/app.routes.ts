import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth&utilisateurs/auth.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      if (!authService.isAuthenticated()) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }],
    children: [

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
              import('./pages/credits/credits-list/credits-list.component').then(m => m.CreditsListComponent)
          },
          {
            path: 'nouveau',
            loadComponent: () =>
              import('./pages/credits/credit-form/credit-form.component').then(m => m.CreditFormComponent)
          },
          {
            path: 'modifier/:id',
            loadComponent: () =>
              import('./pages/credits/credit-form/credit-form.component').then(m => m.CreditFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/credits/credit-details/credit-details.component').then(m => m.CreditDetailsComponent)
          }
        ]
      },
      {
        path: 'fichiers-excel',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/fichiers-excel/consultation/fichiers-excel-consultation.component').then(m => m.FichiersExcelConsultationComponent)
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
        path: 'fichiers-xml',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/fichiers-xml/consultation/fichiers-xml.component').then(m => m.FichiersXMLComponent)
          },
          {
            path: 'generation',
            loadComponent: () =>
              import('./pages/fichiers-xml/fichiers-xml-generation/fichiers-xml-generation.component').then(m => m.FichiersXmlGenerationComponent)
          }
        ]
      },
      {
        path: 'archives',
        children: [
          {
            path: 'fichiers-entree',
            loadComponent: () =>
              import('./pages/archives/fichiers-entree-archive/fichiers-entree-archive.component').then(m => m.FichiersEntreeArchiveComponent)
          },
          {
            path: 'credits',
            loadComponent: () =>
              import('./pages/archives/credits-archive/credits-archive.component').then(m => m.CreditsArchiveComponent)
          },
          {
            path: 'declarations-ba',
            loadComponent: () =>
              import('./pages/archives/declarations-ba-archive/declarations-ba-archive.component').then(m => m.DeclarationsBaArchiveComponent)
          },
          {
            path: '',
            redirectTo: 'fichiers-entree',
            pathMatch: 'full'
          }
        ]
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
