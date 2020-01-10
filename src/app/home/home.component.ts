import { Component, OnInit } from '@angular/core';
import {InitDbModule} from '../Module/init-db/init-db.module';
import {CentralisationService} from '../service/centralisation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private variable: CentralisationService ) { }

  ngOnInit() {
    let initBD = new InitDbModule(this.variable);
    initBD.dataStore();
  }

}
