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
    // Check if page was just reloaded
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isPageReload = navigation.type === 'reload';
    
    if (isPageReload) {
      // Clear cache and force refresh on page reload
      this.ks.viderCacheKPIs();
      this.rafraichirDonnees();
    } else {
      // Normal load - use cached data if available
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
        // case 1:
        //   const timeSeriesData = kpi.resultats as kpi_time_series[];
        //   this.excelChartData = {
        //     labels: timeSeriesData.map(item => item.periode),
        //     datasets: [
        //     {
        //       data: timeSeriesData.map(item => item['VolumeCredits']), 
        //       label: 'Volume de Crédits',
        //       borderColor: '#4CAF50',
        //       yAxisID: 'y' 
        //     },
            
        //   ]
        //   };
        //   break;
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
        default:
          break;
      }
    }
  }
}