import {Component, Inject} from '@angular/core';
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
  metaData = {
    inputName: '',
    inputUser: '',
    inputLocation: '',
    inputNotes: ''
  }



  constructor(
    public dialogRef: MatDialogRef<MetadataInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: ApiService
  ) {
  }

  updateMetadata() {
    console.log('updateMetadata')
    this.apiService.set_metadata(this.metaData.inputName, this.metaData.inputUser, this.metaData.inputLocation, this.metaData.inputNotes)
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
