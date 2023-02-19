import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MeasurementMetadata} from "../util/Measurement.interface";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  constructor(public apiService: ApiService) {
  }
  displayedTableCols: string[] = ['number', 'name', 'location', 'distance', 'user', 'measure', 'date', 'show', 'download', 'edit', 'delete']
  tables: MeasurementMetadata[] = []

  ngOnInit() {
    this.apiService.get_all_tables().then(data => {
      this.tables = data
      console.log(data)
    } )
  }
  public toDateTime(timestamp: string) {
    return new Date(Number.parseInt(timestamp)*1000).toLocaleString()
  }
}
