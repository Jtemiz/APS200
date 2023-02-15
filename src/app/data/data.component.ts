import { Component } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  displayedTableCols: string[] = ['number', 'name', 'location', 'distance', 'user', 'measure', 'date', 'show', 'download', 'delete']
  tables = []
}
