import { Component } from '@angular/core';
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  displayedTableCols = ['content', 'delete']
  commentToAdd = ''
  commentBtns: string[] = []

  constructor(public apiService: ApiService) {
    //this.commentBtns = apiService.get
  }

  public addCommentBtn() {
    if (this.commentToAdd != '')
      if (!this.commentBtns.includes(this.commentToAdd)) {
        this.apiService.add_quick_com_button(this.commentToAdd).then(r => this.commentBtns.push(this.commentToAdd))
        this.commentToAdd = ''
      }
  }
}
