import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {CaliModalComponent} from "./cali-modal/cali-modal.component";
import {MatSlider} from "@angular/material/slider";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  displayedTableCols = ['content', 'delete']
  commentToAdd = ''
  commentBtns: string[] = []
  sound_on: boolean;
  fontSizeValue: number = 1;
  chartValueAmount: number = 5;

  @ViewChild(MatTable) table: MatTable<string> | undefined;

  constructor(public apiService: ApiService, public dialog: MatDialog) {
    this.sound_on = localStorage.getItem('sound_on') != 'false'
  }

  ngOnInit() {
    this.apiService.get_all_quick_com_buttons().then(data => {
      this.commentBtns = data
    })
    this.fontSizeValue = this.getFontSizeValue()
    this.chartValueAmount = this.getChartValueAmount()
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
          disableClose: true,
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

  public updateChartValueAmount(value: number) {
    console.log(value)
    localStorage.setItem('chartValueAmount', value.toString())
  }

  public toggleSound() {
    this.sound_on = !this.sound_on
    localStorage.setItem('sound_on', String(this.sound_on))
    this.apiService.actualize_sound_on()
  }

  public updateFontSize(value: number = 1) {
    document.documentElement.style.setProperty('--font-scale', value.toString());
    localStorage.setItem('fontSizeValue', value.toString())
    console.log(value)
  }

  getFontSizeValue(): number {
    return Number(localStorage.getItem('fontSizeValue')) || 1
  }

  getChartValueAmount(): number {
    return Number(localStorage.getItem('chartValueAmount')) || 5
  }
}

