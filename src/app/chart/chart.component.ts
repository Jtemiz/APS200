import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import {ApiService} from "../services/api.service";
import {MatDialog} from "@angular/material/dialog";
import {MetadataInputComponent} from "./metadata-input.component";

Chart.register(annotationPlugin);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  private interval: any
  public chart: any
  private chartAnnotationOptions = {
    type: 'line',
    scaleID: 'y',
    value: 5,
    borderColor: 'red',
    borderWidth: 3,
    label: {
      padding: 10,
      display: true,
      position: 'center',
      content: 'Grenzwert',
      backgroundColor: 'red'
    },
    click: () => this.changeLimitValue()
  }

  private chartOptions: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Messung",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        fill: false,
      }],
    },
    options: {
      plugins: {
        annotation: {
          annotations: {
            line1: this.chartAnnotationOptions
          }
        }
      },

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
        }, /*
        x: [{
          scaleLabel: {
            display: true,
            labelString: 'Position'
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 100
          }
        }]
        */
      },
      animation: false
    },
  };
  constructor(public apiService: ApiService, public dialog: MatDialog) {}

  private changeLimitValue() {

    let input = prompt("Grenzwerte ändern", this.chartAnnotationOptions.value + 'mm');
    if (input != undefined) {
      if ((parseInt(input) < this.chartOptions.options.scales.y.max)) {
        this.chartAnnotationOptions.value = parseInt(input);
        this.chart.update()
      }
    }
  }



  ngOnInit(): void {
    Chart.register(...registerables)
    Chart.register(annotationPlugin)
    this.chart = new Chart('chart', this.chartOptions)
    this.interval = setInterval(() => this.updateChart(this.apiService), 500)
  }

  public open_metadata_input_dialog() {
    const dialogRef = this.dialog.open(MetadataInputComponent)
  }

  private updateChart(apiService: ApiService) {
    if (apiService.getStatusValue('MEASUREMENT_ACTIVE')) {
      console.log('xy')
      let data = apiService.getMeasurementValues()
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.chart.data.labels.push(data[i].position)
        this.chart.data.datasets[0].data.push(data[i].height)
      }
      apiService.measurementValues = []
      this.chart.update()
    }
  }
}
