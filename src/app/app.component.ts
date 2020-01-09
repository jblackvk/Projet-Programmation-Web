import { Component } from '@angular/core';
import {AuthentificationModule} from './Module/authentification/authentification.module';
import {CentralisationService} from './service/centralisation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private variable: CentralisationService){}
  title = 'projetProgWeb';
  opened = false;
  tester() {
   const auth = new AuthentificationModule(this.variable);
  }
}
