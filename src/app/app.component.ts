import { Component } from '@angular/core';
import {ApiService} from "./services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'APS200';
  constructor(public apiService: ApiService) {
    this.updateFontSize()
  }

  updateFontSize() {
    let fontScaleValue = Number(localStorage.getItem('fontSizeValue'))
    document.documentElement.style.setProperty('--font-scale', this.getFontSizeValue().toString());
  }

  public getFontSizeValue(): number {
    return Number(localStorage.getItem('fontSizeValue')) || 1
  }
}
