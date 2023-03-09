import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Chart, registerables} from "chart.js";

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.css']
})
export class ChartModalComponent implements OnInit{
  public chart: any
  private chartOptions: any = {
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
          min: -5,
          ticks: {
            stepSize: 5
          }
        },
      },
      animation: false,
      elements: {
        point: {
          pointStyle: false
        }
      },
      normalized: true,
    },
  };

  constructor(public dialogRef: MatDialogRef<ChartModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { tableName:string},
              public apiService: ApiService) {
  }

  ngOnInit(): void {
    Chart.register(...registerables)
    this.chart = new Chart('chart', this.chartOptions)
    this.apiService.get_measurement(this.data.tableName, false).then((values) => {
      for (let i = 0; i<values.length; i++) {
        this.chart.data.labels.push(values[i][0])
        this.chart.data.datasets[0].data.push(values[i][1])
        this.chart.data.datasets[1].data.push(values[i][4])
        this.chart.data.datasets[2].data.push(values[i][3])
        this.chart.data.datasets[3].data.push(values[i][2])
      }
      this.chart.update()
    })
  }


}
