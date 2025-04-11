import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditLog {
  id: string;
  utilisateur: string;
  action: string;
  ressource: string;
  details: string;
  date: Date;
  niveau: 'Info' | 'Avertissement' | 'Erreur';
}

@Component({
  selector: 'app-journaux-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="journaux-audit">
      <div class="header">
        <h1>Journaux d'Audit</h1>
      </div>

      <div class="filters card">
        <div class="form-grid">
          <div class="form-group">
            <label>Période</label>
            <select class="form-control">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <div class="form-group">
            <label>Niveau</label>
            <select class="form-control">
              <option value="">Tous</option>
              <option value="info">Info</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
          </div>

          <div class="form-group">
            <label>Utilisateur</label>
            <input type="text" class="form-control" placeholder="Rechercher par utilisateur">
          </div>

          <div class="form-group">
            <label>Action</label>
            <select class="form-control">
              <option value="">Toutes les actions</option>
              <option value="create">Création</option>
              <option value="update">Modification</option>
              <option value="delete">Suppression</option>
              <option value="export">Export</option>
              <option value="import">Import</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Ressource</th>
              <th>Détails</th>
              <th>Niveau</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of journaux">
              <td>{{ log.date | date:'dd/MM/yyyy HH:mm:ss' }}</td>
              <td>{{ log.utilisateur }}</td>
              <td>{{ log.action }}</td>
              <td>{{ log.ressource }}</td>
              <td>{{ log.details }}</td>
              <td>
                <span class="niveau-badge" [class]="log.niveau.toLowerCase()">
                  {{ log.niveau }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button class="btn btn-secondary" disabled>
            <i class="fas fa-chevron-left"></i>
            Précédent
          </button>
          <span>Page 1 sur 5</span>
          <button class="btn btn-secondary">
            Suivant
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .journaux-audit {
      padding: 1rem;
    }

    .header {
      margin-bottom: 1rem;
    }

    .filters {
      margin-bottom: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .niveau-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.info {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      &.avertissement {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.erreur {
        background-color: #ffebee;
        color: var(--error-color);
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class JournauxAuditComponent {
  journaux: AuditLog[] = [
    {
      id: '1',
      utilisateur: 'Marie Dubois',
      action: 'Création',
      ressource: 'Prêt #12345',
      details: 'Nouveau prêt créé pour le client Jean Martin',
      date: new Date('2024-03-20T15:30:00'),
      niveau: 'Info'
    },
    {
      id: '2',
      utilisateur: 'Pierre Martin',
      action: 'Export',
      ressource: 'Fichier XML',
      details: 'Export SEPA généré pour mars 2024',
      date: new Date('2024-03-20T14:45:00'),
      niveau: 'Info'
    },
    {
      id: '3',
      utilisateur: 'Sophie Bernard',
      action: 'Modification',
      ressource: 'Prêt #12340',
      details: 'Modification du taux d\'intérêt de 3.5% à 3.2%',
      date: new Date('2024-03-20T13:15:00'),
      niveau: 'Avertissement'
    },
    {
      id: '4',
      utilisateur: 'Système',
      action: 'Import',
      ressource: 'Fichier Excel',
      details: 'Échec de l\'import - Format invalide',
      date: new Date('2024-03-20T12:30:00'),
      niveau: 'Erreur'
    }
  ];
} 