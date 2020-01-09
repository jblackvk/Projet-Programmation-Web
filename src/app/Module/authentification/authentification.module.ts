import { NgModule,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthentificationModule {

  private name;
  private email;
  private password;

  constructor(private variable: CentralisationService) {}
   Authentifier(idA, passA): boolean {
      this.name = this.variable.name;
      this.email = this.variable.email;
      this.password = this.variable.password;
      return (idA === this.name || idA === this.email) && this.password === passA;
  }

}
