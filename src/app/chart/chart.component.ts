import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import {ApiService} from "../services/api.service";
import {MatDialog} from "@angular/material/dialog";
import {MetadataInputComponent} from "../metadata-input/metadata-input.component";

Chart.register(annotationPlugin);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  private interval: any
  public chart: any
  public quickComBtns: string[] = []
  public quickComToAdd: string = ''
  private chartAnnotationOptions = {
    type: 'line',
    scaleID: 'y',
    value: 4,
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
    responsive: true,
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
          min: -10,
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
      elements: {
        point: {
          pointStyle: false
        }
      },
      animation: false,
    },

  };
  constructor(public apiService: ApiService, public dialog: MatDialog) {}


  private changeLimitValue() {
    let input = prompt("Grenzwerte ändern", this.chartAnnotationOptions.value + 'mm');
    if (input != undefined) {
      if ((parseInt(input) < this.chartOptions.options.scales.y.max)) {
        this.apiService.set_limit_value(parseInt(input))
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
    this.get_all_quick_com_buttons()
    this.get_limit_value()
  }

  public open_metadata_input_dialog() {
    // @ts-ignore
    let metaData = localStorage.getItem('metaData') != null ? JSON.parse(localStorage.getItem('metaData')) : undefined
    const dialogRef = this.dialog.open(MetadataInputComponent, {data: {measurement: undefined, metaData: metaData}})
  }

  private updateChart(apiService: ApiService) {
    if (apiService.getStatusValue('MEASUREMENT_ACTIVE')) {
      let data = apiService.getMeasurementValues()
      while (this.chart.data.labels.length > 100) {
        this.chart.data.labels.shift()
        this.chart.data.datasets[0].data.shift()
      }
      for (let i = 0; i < data.length; i++) {
        this.chart.data.labels.push(data[i].position)
        this.chart.data.datasets[0].data.push(data[i].height)
      }
      apiService.measurementValues = []
      this.chart.update()
    }
  }

  public get_all_quick_com_buttons() {
    this.apiService.get_all_quick_com_buttons().then((res) => {
      this.quickComBtns = res
    })
  }

  public addComment(comment?: string) {
    if (comment == undefined) {
      this.apiService.add_comment(this.quickComToAdd)
    } else {
      this.apiService.add_comment(comment)
    }
  }

  get_limit_value() {
    this.apiService.get_limit_value().then((response) => {
      this.chartAnnotationOptions.value = response
      this.chart.update()
    })
  }
}
