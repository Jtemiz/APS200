import {Component, OnInit} from '@angular/core';
import {EvaluationService} from "../services/evaluation/evaluation.service";
import {ApiService} from "../services/api.service";
import {Chart, ChartOptions, registerables} from "chart.js";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  constructor(public EvaluationService: EvaluationService, public apiService: ApiService) {
  }

  public charts: Chart[] = []
  public chartOptions: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Messung in mm",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        fill: false,
      }, {
        label: "Grenzwert in mm",
        backgroundColor: 'rgba(255,99,132,0.45)',
        borderColor: 'rgba(255, 99, 132, 0.45)',
        data: [],
        fill: false
      }, {
        label: "Fahrbahnbreite in m",
        backgroundColor: 'rgba(99,112,255,0.45)',
        borderColor: 'rgba(99,112,255,0.45)',
        data: [],
        fill: false
      }, {
        label: "Geschwindigkeit in km/h",
        backgroundColor: 'rgba(99,232,255,0.45)',
        borderColor: 'rgba(99,232,255,0.45)',
        data: [],
        fill: false
      }
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Messung'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        y: {
          reverse: true,
          max: 30,
          min: -10,
          ticks: {
            stepSize: 5
          },
        },
        x: {
          gridLines: {
            color: "transparent",
            display: true,
            drawBorder: false,
            zeroLineColor: "#ccc",
            zeroLineWidth: 1
          }
        }
      },
      animation: false,
      elements: {
        point: {
          radius: 0
        }
      },
      normalized: true,
      spanGaps: true,
    },
  };

  ngOnInit(): void {
    Chart.register(...registerables)
    for (let measurement of this.EvaluationService.selected_measurements) {
      console.log(measurement.date)
      this.charts.push(new Chart(measurement.date, this.chartOptions))
    }
  }
  public resize_data_container(to_small: boolean) {
    // @ts-ignore
    if (document.getElementById('app-data-container') != null) {
      if (to_small) {
        // @ts-ignore
        document.getElementById('app-data-container').style.height = '100px'
        this.EvaluationService.data_selection_opened = false
      } else {
        // @ts-ignore
        document.getElementById('app-data-container').style.height = '100%'
        this.EvaluationService.data_selection_opened = true
      }
    }
  }
}
