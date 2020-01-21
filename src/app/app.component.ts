import {Component, OnInit} from '@angular/core';
import {AuthentificationModule} from './Module/authentification/authentification.module';
import {CentralisationService} from './service/centralisation.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private variable: CentralisationService, private router: Router) {}
  title = 'projetProgWeb';
  isAuth = this.variable.isAuth;
  ngOnInit() {
    this.variable.isAuth = (localStorage.getItem('isAuth') === 'true');
    if ( this.isAuth === true) {
      this.router.navigate(['weather']);
    }
  }


}
