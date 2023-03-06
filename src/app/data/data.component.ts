import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MeasurementInterface, MeasurementMetadata} from "../util/Measurement.interface";
import {MatDialog} from "@angular/material/dialog";
import {MetadataInputComponent} from "../chart/metadata-input.component";
import {ChartModalComponent} from "./chart-modal.component";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  constructor(public apiService: ApiService, public dialog: MatDialog) {
  }

  displayedTableCols: string[] = ['name', 'location', 'distance', 'user', 'measure', 'date', 'show', 'download', 'edit', 'delete']
  tables: MeasurementMetadata[] = []

  dataSource: MatTableDataSource<MeasurementMetadata> = new MatTableDataSource<MeasurementMetadata>()

  ngOnInit() {
    this.apiService.get_all_tables().then(data => {
      this.dataSource.data = data
    })
  }

  public toDateTime(timestamp: string) {
    return new Date(Number.parseInt(timestamp) * 1000).toLocaleString()
  }

  public open_chart_modal(tablename: string) {
    const dialogRef = this.dialog.open(ChartModalComponent, {
      data: {tableName: tablename},
      height: '80vh',
      width: '80vw'
    })
  }


  public delete_table(tableName: string) {
    this.apiService.delete_table(tableName)
    this.dataSource.data = this.dataSource.data.filter(elem => {
      return elem.date !== tableName
    })
  }


  public download_csv(tableName: string) {
    let csv_content: any = {}
    this.apiService.get_measurement(tableName).then((values) => {
      csv_content.measurementValues = values
    })
    // @ts-ignore
    csv_content.metaData = this.dataSource.data.find((elem) => {
      return elem.date == tableName
    })

    console.log(csv_content)
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
          return compare(a.description, b.description, isAsc);
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
