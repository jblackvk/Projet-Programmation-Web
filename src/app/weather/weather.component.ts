import { Component, OnInit } from '@angular/core';
import { Url } from 'url';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  ville: string;
  region: string;
  pays: string;
  temperature: number;
  mesure: string;
  description: string;
  humidite: number;
  image: string;
  hour: string;
  opened: boolean = false;
  nbre: number[];
  constructor() {
    this.temperature = 27;
    this.mesure = '°C';
    this.description = 'Nuageux';
    this.humidite = 40;
    this.image = 'url(../../images/nuageux.png)';
    this.hour = Date().substring(15,18);
    this.ville = 'Yaoundé';
    this.nbre = [1,2,3,4,5,6,7,8];
    this.region = 'Centre';
    this.pays = 'Cameroun';
  }

  ngOnInit() {
  }

}
