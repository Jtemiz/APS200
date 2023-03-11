import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MeasurementInterface, MeasurementMetadata} from "../util/Measurement.interface";
import {MatDialog} from "@angular/material/dialog";
import {MetadataInputComponent} from "../metadata-input/metadata-input.component";
import {ChartModalComponent} from "./chart-modal.component";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { saveAs } from 'file-saver';
import _default from "chart.js/dist/plugins/plugin.tooltip";
import type = _default.defaults.animations.numbers.type;

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  constructor(public apiService: ApiService, public dialog: MatDialog) {
  }

  displayedTableCols: string[] = ['name', 'location', 'distance', 'user', 'measure', 'date', 'actions']
  tables: MeasurementMetadata[] = []

  dataSource: MatTableDataSource<MeasurementMetadata> = new MatTableDataSource<MeasurementMetadata>()

  ngOnInit() {
    this.apiService.get_all_tables().then(data => {
      this.dataSource.data = data
    })
  }

  public toDateTime(timestamp: string, forSorting: boolean) {
    const date_object = new Date(Number.parseInt(timestamp) * 1000)
    if (forSorting) {
      const date = date_object.getFullYear().toString() + '-' + (date_object.getMonth()+1).toString() + '-' + date_object.getDate().toString()
      const time = date_object.getHours().toString() + ':' + date_object.getMinutes().toString() + ':' + date_object.getSeconds().toString()
      return date + '_' + time
    } else {
      return date_object.toLocaleString()
    }
  }

  public open_chart_modal(tablename: string) {
    const dialogRef = this.dialog.open(ChartModalComponent, {
      data: {tableName: tablename},
      height: '80vh',
      width: '80vw'
    })
  }

  public open_metadata_input(row: MeasurementMetadata) {
    let metaData = {
      inputName: row.name,
      inputUser: row.user,
      inputLocation: row.location,
      inputNotes: row.notes,
      inputStreetWidth: -1
    }
    const dialogRef = this.dialog.open(MetadataInputComponent, {data: {metaData: metaData, measurement: row.date}})
    dialogRef.afterClosed().subscribe((resultMetaData) => {
      let tmp = this.dataSource.data.find((elem) => {
        return elem.date == row.date
      })
      if (tmp != undefined) {
        tmp.name = resultMetaData.inputName
        tmp.user = resultMetaData.inputUser
        tmp.location = resultMetaData.inputLocation
        tmp.notes = resultMetaData.inputNotes
      }
    })
  }

  public delete_table(tableName: string) {
    this.apiService.delete_table(tableName)
    this.dataSource.data = this.dataSource.data.filter(elem => {
      return elem.date !== tableName
    })
  }


  public async download_csv(tableName: string) {
    let csv_content: any = {}
    let csv = ''
    await this.apiService.get_measurement(tableName, true).then((values) => {
      csv_content.measurementValues = values
    })
    csv_content.metaData = this.dataSource.data.find((elem) => {
      return elem.date == tableName
    })
    csv = csv.concat('Datum:;'+ this.toDateTime(csv_content.metaData.date, false) + '\r\n')
    csv = csv.concat('Prüfer:;'+ csv_content.metaData.user + '\r\n')
    csv = csv.concat('Adresse:;'+ csv_content.metaData.location + '\r\n')
    csv = csv.concat('Maßnahme:;'+ csv_content.metaData.name + '\r\n')
    csv = csv.concat('Notizen:;'+ csv_content.metaData.notes + '\r\n')
    csv = csv.concat('Länge:;'+ csv_content.metaData.distance.toString() + '\r\n\r\n')
    csv = csv.concat('Station;Höhe;Geschw;Breite;Grenze;Kommentar\r\n')
    for (let i = 0; i < csv_content.measurementValues.length; i++) {
      const row_array = csv_content.measurementValues[i]
      let row = ''
      for (let j = 0; j < row_array.length; j++) {
        row = row.concat(row_array[j] == null ? ';' : row_array[j].toString() + ';')
      }
      csv = csv.concat(row.slice(0, -1) + '\r\n')
    }
    let blob = new Blob([csv], {type: 'text/csv'})
    saveAs(blob, this.toDateTime(csv_content.metaData.date, true) + '.csv')
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'location':
          return compare(a.location, b.location, isAsc);
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'description':
          return compare(a.notes, b.notes, isAsc);
        case 'user':
          return compare(a.user, b.user, isAsc);
        case 'distance':
          return compare(a.distance, b.distance, isAsc);
        default:
          return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }
}
