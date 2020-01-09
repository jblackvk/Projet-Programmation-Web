import { NgModule } from '@angular/core';
import {
  MatButtonModule,
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
  MatTabsModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatRadioModule,
} from '@angular/material';


const MaterialComponent = [
  MatTabsModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatInputModule,
  MatDatepickerModule,
  MatButtonModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatCardModule,
  MatFormFieldModule,
  MatRadioModule,
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
