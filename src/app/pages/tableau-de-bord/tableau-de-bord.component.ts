import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { kpi, kpi_nom_valeur,kpi_resume,kpi_time_series } from '../../core/dtos/tableau-de-bord/kpis-dto';
import { KpisService } from '../../core/services/tableau-de-bord/kpis.service';


@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl:'./tableau-de-bord.component.html',
  styleUrls:['./tableau-de-bord.component.css']
})

export class TableauDeBordComponent {

  public excelChartData?: ChartData<'line'>;
  public situationChartData?: ChartData<'doughnut'>;
  public guaranteeChartData?: ChartData<'bar'>;
  public agencyDebtChartData?: ChartData<'bar'>;
  public creditsVsRestePayerChartData?: ChartData<'pie'>;
  public creditsVsRestePayerChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const dataPoints = context.dataset.data.map(item => Number(item) || 0);
            const total = dataPoints.reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  private readonly couleurs: string[] = [
    '#3b82f6', 
    '#8b5cf6', 
    '#d946ef', 
    '#10b981', 
    '#f97316', 
    '#ef4444', 
    '#06b6d4', 
    '#eab308',
    '#ea9999',  
    '#93c47d',
    '#f9cb9c'
  ];

  public readonly excelChartType: ChartType = 'line';
  public readonly excelChartOptions: ChartConfiguration['options'] = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { legend: { display: false } }, 
    scales: { y: { 
      beginAtZero: true,
      ticks: {
        stepSize: 1   
      } 
    } 
  }
  };

  public readonly situationChartType: ChartType = 'doughnut';
  public readonly situationChartOptions: ChartConfiguration['options'] = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { 
      legend: { 
        position: 'bottom' 
      } 
    }
  };

  public readonly guaranteeChartType: ChartType = 'doughnut';
  public readonly guaranteeChartOptions: ChartConfiguration['options'] = { 
     responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom', 
    },
    title: {
      display: true,
      text: 'Top 5 types de garanties'
    },
   
  },
  };
  
  public readonly agencyDebtChartType: ChartType = 'bar';
  public readonly agencyDebtChartOptions: ChartConfiguration['options'] = { responsive: true, 
    maintainAspectRatio: false,
    scales: { 
      y: { 
        beginAtZero: true,
        ticks: {
          stepSize: 1
        } 
      } 
    } 
  };
  
  constructor(private ks: KpisService) {}

  ngOnInit(): void {
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isPageReload = navigation.type === 'reload';
    
    if (isPageReload) {
      this.ks.viderCacheKPIs();
      this.rafraichirDonnees();
    } else {
      this.ks.obtenirKPIs().subscribe({
        next: (resultats) => {
          this.traiterKpis(resultats);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des KPIs:', error);
        }
      });
    }
  }

  rafraichirDonnees() {
    this.ks.rafraichirKPIs().subscribe({
      next: (resultats) => {
        this.traiterKpis(resultats);
      },
      error: (error) => {
        console.error('Erreur lors du rafraîchissement des données:', error);
      }
    });
  }

  viderCacheKPIs() {
    this.ks.viderCacheKPIs();
  }

  get hasChartData(): boolean {
    return !!(this.excelChartData || this.guaranteeChartData || this.agencyDebtChartData);
  }

  private traiterKpis(kpis: kpi<any>[]): void {
    for (const kpi of kpis) {
      if (!kpi.resultats || kpi.resultats.length === 0) continue;

      switch (kpi.id_kpi) {
       
        case 9: 
          const mappedGuaranteeData: kpi_nom_valeur[] = kpi.resultats.map(item => ({
            nom: item.TypeDeGarantie,
            valeur: item.NombreUtilisations
          }));
          this.guaranteeChartData = {
            labels: mappedGuaranteeData.map(item => item.nom),
            datasets: [{
              data: mappedGuaranteeData.map(item => item.valeur),
              label: "5 types des garanties plus communes",
              backgroundColor: mappedGuaranteeData.map(() => 
                this.couleurs[Math.floor(Math.random() * this.couleurs.length)]
              )
            }]
          };
          break;   
        case 10: 
          const mappedAgencyData: kpi_nom_valeur[] = kpi.resultats.map(item => ({
            nom: item.Agence,
            valeur: item.TotalEcheancesImpayees
          }));
          this.agencyDebtChartData = {
            labels: mappedAgencyData.map(item => item.nom),
            datasets: [{
              data: mappedAgencyData.map(item => item.valeur),
              label: 'Total des échéances impayées',
              backgroundColor: mappedAgencyData.map(() => 
                this.couleurs[Math.floor(Math.random() * this.couleurs.length)]
              )
            }]
          };
          break;
        case 11:
          this.creditsVsRestePayerChartData = {
            labels: kpi.resultats.map(item => item.Libellé),
            datasets: [{
              data: kpi.resultats.map(item => item.Montant),
              label: 'Crédits utilisés vs Reste à payer',
              backgroundColor: kpi.resultats.map(() => 
                this.couleurs[Math.floor(Math.random() * this.couleurs.length)]
              ),
              hoverOffset: 4
            }]
          };
          break;
        default:
          break;
      }
    }
  }
}