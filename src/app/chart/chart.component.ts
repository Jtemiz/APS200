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
  private chartValueAmount: number = 5
  private chartAnnotationOptions = {
    type: 'line',
    scaleID: 'y',
    value: 4,
    borderColor: 'red',
    borderWidth: 2,
    label: {
      padding: 5,
      display: true,
      position: 'center',
      content: 'Grenzwert',
      backgroundColor: 'red',
      font: {
        size: (size: number) => 12 * Number((!localStorage.getItem('fontSizeValue')? 1 : localStorage.getItem('fontSizeValue')))
      },
    },
    click: () => this.changeLimitValue()
  }
  public lastVals = {
    height: 0,
    position: 0,
    speed: 0
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
            line1: this.chartAnnotationOptions,
            zeroLine: {
              type: 'line',
              scaleID: 'y',
              value: 0,
              borderColor: 'black',
              borderWidth: 1
            }
          }
        },
        legend: {
          display: false
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
            font: {
              size: (size: number) => 12 * Number((!localStorage.getItem('fontSizeValue')? 1 : localStorage.getItem('fontSizeValue')))
            },
            stepSize: 5
          },
        },
        x: {
          gridLines: { lineWidth: 50 },
        }
      },
      elements: {
        point: {
          pointStyle: false
        }
      },
      animation: false,
    },

  };

  constructor(public apiService: ApiService, public dialog: MatDialog) {
    console.log('constructor')
  }


  private changeLimitValue() {
    let input = prompt("Grenzwerte ändern", this.chartAnnotationOptions.value + 'mm');
    if (input != undefined) {
      if ((parseInt(input) < this.chartOptions.options.scales.y.max) && (parseInt(input) > this.chartOptions.options.scales.y.min)) {
        this.apiService.set_limit_value(parseInt(input))
        this.chartAnnotationOptions.value = parseInt(input);
        this.chart.update()
      }
    }
  }

  ngOnInit(): void {
    this.chartValueAmount = this.getChartValueAmount()
    this.apiService.resetMeasurementValues()
    Chart.register(...registerables)
    Chart.register(annotationPlugin)
    this.chart = new Chart('chart', this.chartOptions)
    this.interval = setInterval(() => this.updateChart(this.apiService), 100)
    this.get_all_quick_com_buttons()
    this.get_limit_value()
    this.apiService.measurementValues = []

  }

  public open_metadata_input_dialog() {
    // @ts-ignore
    let metaData = localStorage.getItem('metaData') != null ? JSON.parse(localStorage.getItem('metaData')) : undefined
    const dialogRef = this.dialog.open(MetadataInputComponent, {data: {measurement: undefined, metaData: metaData}})
  }

  private updateChart(apiService: ApiService) {
    if (apiService.getStatusValue('MEASUREMENT_ACTIVE')) {
      let data = apiService.getMeasurementValues();
      // Remove old data if the total length exceeds certain amount (default: 50)
      let excessLength = this.chart.data.labels.length + data.length - this.chartValueAmount*10;
      console.log(this.chartValueAmount)
      if (excessLength > 0) {
        this.chart.data.labels.splice(0, excessLength);
        this.chart.data.datasets[0].data.splice(0, excessLength);
      }

      // Append new data
      for (let i = 0; i < data.length; i++) {
        this.chart.data.labels.push(data[i].position);
        this.chart.data.datasets[0].data.push(data[i].height);
      }

      if (data.length !== 0 && apiService.getStatusValue('MEASUREMENT_ACTIVE')) {
        apiService.measurementValues = [];
      }
      console.log(this.chart.data.labels.length)
      this.chart.update();
    }
  }

  public get_digit_measurement_values(type: string): any {
    const data = this.apiService.getMeasurementValues()[this.apiService.getMeasurementValues().length - 1]
    if (data != undefined) {
      switch (type) {
        case 'height': {
          this.lastVals.height = data.height
          return data.height
        }
        case 'speed': {
          this.lastVals.speed = data.speed
          return data.speed
        }
        case 'position': {
          this.lastVals.position = data.position
          return data.position
        }
        default: {
          return ''
        }
      }
    }
    else {
      switch (type) {
        case 'height': {
          return this.lastVals.height
        }
        case 'speed': {
          return this.lastVals.speed
        }
        case 'position': {
          return this.lastVals.position
        }
        default: {
          return ''
        }
      }
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

  public getFontSizeValue(): number {
    return Number(localStorage.getItem('fontSizeValue')) || 1
  }

  public getChartValueAmount(): number {
    return Number(localStorage.getItem('chartValueAmount')) || 5
  }

}
