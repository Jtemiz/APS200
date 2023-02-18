import { Component } from '@angular/core';
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  constructor(public apiService: ApiService) {
  }
  displayedTableCols: string[] = ['number', 'name', 'location', 'distance', 'user', 'measure', 'date', 'show', 'download', 'delete']
  tables = []
}
