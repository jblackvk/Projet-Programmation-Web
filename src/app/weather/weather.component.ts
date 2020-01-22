import {Component, OnInit, AfterViewInit, Inject, OnChanges} from '@angular/core';
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
import {icon} from 'leaflet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit {
  lieuDeChange;
  ville = 'ville';
  addins: false;
  region = 'region';
  pays = 'Cameroun';
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
  listeLieu = [];
  listeRegion = ['Adamaoua', 'Centre', 'Est', 'Extreme Nord', 'Littoral', 'Nord', 'Nord Ouest',
    'Ouest', 'Sud', 'Sud Ouest'];
  private mapCarte;

  constructor(private jsonLoader: JsonService, private variable: CentralisationService, public dialog: MatDialog) {
  }

  villeControl = new FormControl();
  regionControl = new FormControl();
  villeFiltree: Observable<string[]>;
  regionFiltree: Observable<string[]>;
  texte: any;

  ngOnInit() {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
      const idbRequestLieu = obj.objectStore(this.variable.dbTable[1]).getAll();
      idbRequestLieu.onsuccess = (event) => {
        this.listeLieu = event.target.result;
        console.log(this.listeLieu);
      };
    };
    const initDb = new InitDbModule(this.variable);
    initDb.dataStore();
    this.initMeteo();
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

  setMeteo(event) {
    const initMeteo = new MeteoModule(this.variable);
    console.log(event);
    const data = event;
    const init = initMeteo.getMeteoNow(data);
    this.Meteo = initMeteo.met;
  }

  loadVille() {
    this.villeFiltree = this.villeControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtreur(value))
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
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 3,
      maxZoom: 19,
    });
    tiles.addTo(this.mapCarte);
    let marker = L.marker([lat1, long1]).addTo(this.mapCarte);
    const xhttp = new XMLHttpRequest();
    this.mapCarte.on('click', (e) => {
      lat1 = e.latlng.lat;
      long1 = e.latlng.lng;
      const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat1 + '&lon=' + long1 + '';
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          console.log(xhttp.responseType);
          const reponse = JSON.parse(xhttp.response);
          const ville = reponse.display_name;
          console.log(reponse);
          console.log('latitude' + lat1 + 'lonngitude' + long1);
          this.mapCarte.removeLayer(marker);
          marker = L.marker([lat1, long1], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: '../../../node_modules/leaflet/dist/images/marker-icon.png',
              shadowUrl: '../../../node_modules/leaflet/dist/images/leaflet/marker-shadow.png'
            })
          });
          const popup = marker.addTo(this.mapCarte);
          popup.bindPopup(ville).openPopup();
          console.log(reponse);
          console.log(reponse.display_name.split(',')[0]);
          const Local = {
            ville: reponse.display_name.split(',')[0],
            region: reponse.address.state,
            pays: reponse.address.country,
            coords: {
              lat: reponse.lat,
              long: reponse.lon
            }
          };
          popup.on('click', () => {
            this.ville = Local.ville;
            this.region = Local.region;
            this.pays = Local.pays;
            this.openDialog(Local);
          });
        }
      };
      xhttp.open('GET', url, true);
      xhttp.send();


    });

  }

  openDialog(lieu) {
    /*const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: lieu
    });*/
    const lieus = new LieuModule(this.variable);
    lieus.setLieu(lieu);
    alert('Ce lieu a ete ajoute au lieu dont vous pouvez obtenir la meteo');
  }

  onValider() {
    console.log('champ valider');
  }

  cliquer() {
    const champVille = document.getElementById('ville');

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

enum langue {'fr', 'en'}

interface Position {
  position: any;
  ville: string;
  heure: any;
  jour: any;
  langue: langue;
  typeCoord: typePosition;
  typeReq: typeRequete;
}

/*

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-data-example-dialog.html',
})
export class DialogOverviewExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private variable: CentralisationService) {
  }

  onNoClick(): void {
    const lieus = new LieuModule(this.variable);
    lieus.setLieu(this.data.lieu);
    this.dialogRef.close();
  }

}
*/
