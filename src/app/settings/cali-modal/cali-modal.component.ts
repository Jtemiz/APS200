import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-cali-modal',
  templateUrl: './cali-modal.component.html',
  styleUrls: ['./cali-modal.component.css']
})
export class CaliModalComponent implements OnInit {
  public caliSteps: number[] = []

  constructor(
    public dialogRef: MatDialogRef<CaliModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      calibrationSteps: number[],
      password: string
    },
    public apiService: ApiService
  ) {
    this.caliSteps = data.calibrationSteps
  }

  public setCalibrationValue(value: number) {
    this.apiService.setCalibrationStep(value, this.data.password )
  }


  ngOnInit(): void {
  }
}
