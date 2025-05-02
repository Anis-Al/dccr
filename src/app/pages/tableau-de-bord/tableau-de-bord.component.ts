import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
}

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="tableau-de-bord">
      <div class="header">
        <h1>Tableau de Bord</h1>
      </div>

    

      <div class="charts-grid">
        <div class="chart-card card">
          <h2>Fichiers intégrés</h2>
          <div class="chart-container">
            <canvas baseChart
              [data]="excelChartData"
              [type]="excelChartType"
              [options]="excelChartOptions">
            </canvas>
          </div>
            </div>

        <div class="chart-card card">
          <h2>Erreurs plus fréquentes</h2>
          <div class="chart-container">
            <canvas baseChart
              [data]="creditsChartData"
              [type]="creditsChartType"
              [options]="creditsChartOptions">
            </canvas>
          </div>
        </div>
        <div class="chart-card card">
          <h2>'Situations des Crédits' dans le dernier fichier intégré</h2>
          <div class="chart-container">
            <canvas baseChart
              [data]="creditsChartData2"
              [type]="creditsChartType"
              [options]="creditsChartOptions2">
            </canvas>
        </div>
      </div>

      

        <div class="chart-card card">
          <h2>Crédits proches de l'échéance</h2>
          <div class="chart-container">
            <canvas baseChart
              [data]="expiryChartData"
              [type]="expiryChartType"
              [options]="expiryChartOptions">
            </canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tableau-de-bord {
      padding: 1rem;
    }

    .header {
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      gap: 1rem;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background-color: var(--primary-color-light);
      color: var(--primary-color);

      i {
        font-size: 1.5rem;
      }
    }
      .stat-icon2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background-color: green;
      color: white;

      i {
        font-size: 1.5rem;
      }
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-color-light);
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1rem;
    }

    .chart-card {
      padding: 1.5rem;

      h2 {
        margin-bottom: 1rem;
      }
    }

    .chart-container {
      position: relative;
      height: 300px;
    }
  `]
})
export class TableauDeBordComponent {
  Math = Math;

  // Statistiques
  stats: StatCard[] = [
    { label: "Fichiers en attente de correction", value: 3, icon: 'fa-file-excel', trend: 5 },
    { label: 'Utilisateur plus actif', value: 'Halil Ibrahim', icon: 'fa-users', trend: 0 }
  ];
  stats2: StatCard[] = [
    { label: "Total fichiers importés", value: 12, icon: 'fa-file-import' },
    { label: "Crédits validés", value: 2893, icon: 'fa-check-circle' },
    { label: "Crédits en erreur", value: 521, icon: 'fa-exclamation-triangle' },
  ];

  // Chart 1: Fichiers Excel
  excelChartType: ChartType = 'line';
  excelChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        data: [12, 19, 15, 25, 22, 30],
        label: 'Fichiers Excel',
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  excelChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Chart 2: Crédits selon types
  creditsChartType: ChartType = 'bar';
  creditsChartData: ChartData<'bar'> = {
    labels: ['Cellules vides ', "Ordre de dates erroné","Valeurs non-existantes au table de domaines"],
    datasets: [
      {
        data: [9, 12, 20],
        label: 'Crédits',
        backgroundColor: ['#FFC107', '#4CAF50', '#F44336']
      }
    ]
  };
  creditsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };
  //situations des crédits
  creditsChartData2: ChartData<'bar'> = {
    labels: ['Crédit rejeté ', 'Crédit régulier', 'Crédit annulé'],
    datasets: [
      {
        data: [3, 4, 5],
        label: 'Crédit',
        backgroundColor: ['#FF2D30', '#4CAC50', '#F44536']
      }
    ]
  };
  creditsChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Chart 3: Fichiers XML
  xmlChartType: ChartType = 'doughnut';
  xmlChartData: ChartData<'doughnut'> = {
    labels: ['Correction', 'Supression'],
    datasets: [
      {
        data: [20, 20],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
      }
    ]
  };
  xmlChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  // Chart 4: Échéance des Crédits
  expiryChartType: ChartType = 'bar';
  expiryChartData: ChartData<'bar'> = {
    labels: ['Avr 2025', 'Mai 2025', 'Juin 2025', 'Juil 2025', 'Août 2025', 'Sept 2025'],
    datasets: [
      {
        data: [5, 8, 12, 6, 3, 4],
        label: "Crédits proches de l'échéance"  ,
        backgroundColor: '#FF7043'
      }
    ]
  };
  expiryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  };
}
