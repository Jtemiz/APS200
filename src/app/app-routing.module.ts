import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ChartComponent} from "./chart/chart.component";
import {DataComponent} from "./data/data.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {path: '', component: ChartComponent},
  {path: 'data', component: DataComponent},
  {path: 'settings', component: SettingsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
