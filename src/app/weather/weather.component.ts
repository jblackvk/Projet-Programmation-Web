import { Component, OnInit } from '@angular/core';
import { Url } from 'url';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  ville: string;
  temperature: number;
  mesure: string;
  description: string;
  humidite: number;
  image: string;
  hour: string;
  opened: boolean = false;
  nbre: number;
  constructor() {
    this.temperature = 27;
    this.mesure = '°C';
    this.description = 'Nuageux';
    this.humidite = 40;
    this.image = 'url(../../images/nuageux.png)';
    this.hour = Date();
    this.ville = 'Yaoundé';
    this.nbre = 8;
  }

  ngOnInit() {
  }

}
