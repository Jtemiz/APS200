import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {CaliModalComponent} from "./cali-modal/cali-modal.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  displayedTableCols = ['content', 'delete']
  commentToAdd = ''
  commentBtns: string[] = []

  @ViewChild(MatTable) table: MatTable<string> | undefined;

  constructor(public apiService: ApiService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.apiService.get_all_quick_com_buttons().then(data => {
      this.commentBtns = data
    })
  }

  public addCommentBtn() {
    if (this.commentToAdd != '') {
      if (!this.commentBtns.includes(this.commentToAdd)) {
        this.apiService.add_quick_com_button(this.commentToAdd)
        this.commentBtns.push(this.commentToAdd)
        if (this.table != undefined) {
          this.table.renderRows();
        }
        this.commentToAdd = ''
      }
    }
  }

  public deleteCommentBtn(content: string) {
    this.apiService.delete_quick_com_button(content)
    const index = this.commentBtns.indexOf(content, 0);
    if (index > -1) {
      this.commentBtns.splice(index, 1);
      this.table?.renderRows()
    }
  }

  public async openCalModal() {
    let pwInput = prompt("Passwort eingeben",)
    if (pwInput != undefined) {
      await this.apiService.getCalibrationSteps(pwInput).then((response) => {
        this.dialog.open(CaliModalComponent, {
          data: {
            calibrationSteps: response,
            password: pwInput
          }
        })
      }).catch((error) => {
        // todo: error handling
      })
    }
  }
}
