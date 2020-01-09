import { NgModule } from '@angular/core';
import {MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatTabsModule
} from '@angular/material';


const MaterialComponent = [
  MatButtonModule,
  MatTabsModule,
  MatCardModule,
  MatGridListModule,
  MatButtonToggleModule,
  MatIconModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule
];


@NgModule({
  imports: [
    MaterialComponent
  ],
  exports: [
    MaterialComponent
  ]
})
export class MaterialCompModule { }
