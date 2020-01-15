import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
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
  opened = false;
  nbre: number[];
  private map;
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
    this.initMap();
  }

  private initMap() {


    $.getJSON(
      '../listCity/citycameroun.json',
      (data) => {
        console.log(data);
      }
    );

    const lat = 7.86667;
    const long = 12.51667;
    const zoom = 6;
    this.map = L.map('carteBar').setView([lat, long], zoom);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      minZoom: 3,
      maxZoom: 19,
    });


    tiles.addTo(this.map);
  }

  onValider() {
    console.log('champ valider');
  }
}
