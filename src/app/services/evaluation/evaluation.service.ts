import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  selected_measurements: any[] = []
  data_selection_opened = true
  constructor() { }
}
