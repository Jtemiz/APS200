import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import position = _default.defaults.position;
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-metadata-input',
  templateUrl: './metadata-input.component.html',
  styleUrls: ['./metadata-input.component.css']
})
export class MetadataInputComponent {
  public measurement
  public metaData: any = {
    inputName: '',
    inputUser: '',
    inputLocation: '',
    inputNotes: '',
    inputStreetWidth: 0
  }



  constructor(
    public dialogRef: MatDialogRef<MetadataInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: ApiService
  ) {
    if (data.metaData != undefined) {
      this.metaData = data.metaData
    }
    this.measurement = data.measurement
  }

  updateMetadata() {
    if (this.measurement == undefined) {
      this.apiService.set_metadata(this.metaData.inputName, this.metaData.inputUser, this.metaData.inputLocation, this.metaData.inputNotes, this.metaData.inputStreetWidth)
    } else {
      this.apiService.update_metadata(this.measurement, this.metaData.inputName, this.metaData.inputUser, this.metaData.inputLocation, this.metaData.inputNotes)
    }
  }

  saveMetadataToLocalStorage() {
    localStorage.setItem('metaData', JSON.stringify(this.metaData))
  }

 /*
  public getLocation(): Promise<{ longitude: string, latitude: string }> {
    navigator.geolocation.getCurrentPosition((position) =>  {
      return {
      longitude: position.coords.longitude,
        latitude: position.coords.latitude
    }})
  }

  public insertLocation(): { longitude: string, latitude: string } {
    return await this.getLocation().then((position) => {
      return position
    }).catch(() => {
      return { longitude: '0', latitude: '0' }
    })
  }

  */
}
