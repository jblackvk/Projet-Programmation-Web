import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import * as L from 'leaflet';
import {Url} from 'url';
import {JsonService} from '../service/json.service';
import {FormControl} from '@angular/forms';
import {Observable, ObservableInput} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {InitDbModule} from '../Module/init-db/init-db.module';
import {CentralisationService} from '../service/centralisation.service';
import {MeteoModule} from '../Module/meteo/meteo.module';
import {LieuModule} from '../Module/lieu/lieu.module';

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
  posTest = {
    lat: 7.86667,
    long: 12.51667
  };
  Meteo;
  Coordonnees = {
    lat: 7.86667,
    long: 12.51667,
  };
  MeteoPrev;
  listeVille;
  listeRegion = ['Adamaoua', 'Centre', 'Est', 'Extreme Nord', 'Littoral', 'Nord', 'Nord Ouest',
    'Ouest', 'Sud', 'Sud Ouest'];
  private mapCarte;

  constructor(private jsonLoader: JsonService, private variable: CentralisationService) {
    this.temperature = 27;
    this.mesure = '°C';
    this.description = 'Nuageux';
    this.humidite = 40;
    this.image = 'url(../../images/nuageux.png)';
    this.hour = Date().substring(15, 18);
    this.ville = 'Yaoundé';
    this.nbre = [1, 2, 3, 4, 5, 6, 7, 8];
    this.region = 'Centre';
    this.pays = 'Cameroun';
  }

  villeControl = new FormControl();
  regionControl = new FormControl();
  villeFiltree: Observable<string[]>;
  regionFiltree: Observable<string[]>;

  ngOnInit() {
    const initDb = new InitDbModule(this.variable);
    initDb.dataStore();
    this.initMeteo();
    console.log(this.Meteo);
    this.initMap();
    this.initListe();
    this.regionFiltree = this.regionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtreurRegion(value))
    );
  }
  initMeteo() {
    const initMeteo = new MeteoModule(this.variable);
    navigator.geolocation.getCurrentPosition((posi) => {
      this.Coordonnees.lat = posi.coords.latitude;
      this.Coordonnees.long = posi.coords.longitude;
    });
    const date = new Date();
    const pos = {
      position: this.Coordonnees,
      ville: '',
      heure: date.getTime(),
      jour: date.getDate(),
      langue: langue.fr,
      typeCoord: typePosition.coordonnee,
      typeReq: typeRequete.instant
    };
    const init = initMeteo.getMeteoNow(pos);
    this.Meteo = initMeteo.met;
    const lieu = new LieuModule(this.variable);
    const local = lieu.getLieuFixe(initMeteo.met.Lieu);
    // @ts-ignore
  }

  async loadVille() {
    this.villeFiltree = await this.villeControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this.filtreur(value);
      })
    );
  }

  _filtreurRegion(valeur: string): string[] {
    const valeurAFiltrer = valeur.toLowerCase();
    return this.listeRegion.filter(
      region => region.toLowerCase().includes(valeurAFiltrer));
  }

  filtreur(valeur: string): string[] {
    const valeurAFiltrer = valeur.toLowerCase();
    return this.listeVille.filter(
      ville => {
        return ville.name.toLowerCase().includes(valeurAFiltrer);
      });
  }

  displayFonction(objet) {
    return objet ? objet.name : undefined;
  }

  private initListe() {
    const urlListe = 'assets/listCity/citycameroun.json';
    this.jsonLoader.getJson(urlListe).subscribe(
      (resp) => {
        this.listeVille = resp.body;
        this.listeVille = this.listeVille.sort((a, b) => {
          if (a.name.toLowerCase() === b.name.toLowerCase()) {
            return 0;
          } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          }
        });
        this.loadVille();
      }
    );
  }

  private initMap() {
    const lat = 7.86667;
    let lat1 = 7.86667;
    const long = 12.51667;
    let long1 = 12.51667;
    const zoom = 6;
    this.mapCarte = L.map('carteBar').setView([lat, long], zoom);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      minZoom: 3,
      maxZoom: 19,
    });
    tiles.addTo(this.mapCarte);
    let marker = L.marker([lat1, long1]).addTo(this.mapCarte);
    const xhttp = new XMLHttpRequest();
    this.mapCarte.on('click', (e) => {
        lat1 = e.latlng.lat;
        long1 = e.latlng.lng;


        const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + long + '';
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log('envoie de la requette');
                console.log(xhttp.responseType);
                const reponse = JSON.parse(xhttp.response);
                const ville = reponse.display_name;

                console.log('latitude' + lat + 'lonngitude' + long);
                this.mapCarte.removeLayer(marker);
                marker = L.marker([lat, long]);
                const popup = marker.addTo(this.mapCarte);
                popup.bindPopup(ville).openPopup();


            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();

    });
  }

  onValider() {
    console.log('champ valider');
  }
}

interface VilleModele {
  id: number;
  name: string;
  country: string;
  coord: {
    lon: number,
    lat: number
  };
}

enum typePosition {'coordonnee', 'ville' }
enum typeRequete {'instant', 'prediction'}
enum langue {'fr',  'en'}
interface Position {
  position: any;
  ville: string;
  heure: any;
  jour: any;
  langue: langue;
  typeCoord: typePosition;
  typeReq: typeRequete;
}
