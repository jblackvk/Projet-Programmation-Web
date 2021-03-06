import {Component, OnInit, AfterViewInit, Inject, OnChanges} from '@angular/core';
import * as $ from 'jquery';
import * as L from 'leaflet';
import {Url} from 'url';
import {JsonService} from '../service/json.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {InitDbModule} from '../Module/init-db/init-db.module';
import {CentralisationService} from '../service/centralisation.service';
import {MeteoModule} from '../Module/meteo/meteo.module';
import {LieuModule} from '../Module/lieu/lieu.module';
import {icon} from 'leaflet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {isNotNullOrUndefined} from "codelyzer/util/isNotNullOrUndefined";

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
  modif = false;
  posTest = {
    lat: 7.86667,
    long: 12.51667
  };
  Meteo;
  Coordonnees = {
    lat: 3.86667,
    long: 11.51667,
  };
  MeteoPrev;
  listeVille;
  listeLieu = [];
  listeLieutemp = [];
  listeRegion = ['Adamaoua', 'Centre', 'Est', 'Extreme Nord', 'Littoral', 'Nord', 'Nord Ouest',
    'Ouest', 'Sud', 'Sud Ouest'];
  private mapCarte;
  private lieu;

  villeControl = new FormControl();
  regionControl = new FormControl();
  villeFiltree: Observable<string[]>;
  regionFiltree: Observable<string[]>;
  texte: any;

  constructor(private jsonLoader: JsonService, private variable: CentralisationService, public dialog: MatDialog, private router: Router) {
    console.log('constructeur');
  }



  ngOnInit() {
    this.getLieu().then(() => {
      this.listeLieu = this.listeLieutemp.sort((a, b) => {
        a = a.ville.toLowerCase();
        b = b.ville.toLowerCase();
        if (a === b) {
          return 0;
        } else if (a < b) {
          return -1;
        } else if (a < b) {
          return 1;
        }
      });
    });
    console.log('init');
    const initDb = new InitDbModule(this.variable);
    this.lieu = new LieuModule(this.variable);
    initDb.dataStore();
    this.initMeteo();
    this.initMap();
    this.initListe();
    this.regionFiltree = this.regionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtreurRegion(value))
    );
  }

  refresh() {
    if (this.modif === true) {
      console.log('refresh load');
      location.reload();
      this.modif = false;
    }
  }

  getLieu() {

    return new Promise((resolve) => {
      const index = indexedDB.open(this.variable.dbname);
      index.onsuccess = (e) => {
        // @ts-ignore
        const db = e.target.result;
        const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
        const idbRequestLieu = obj.objectStore(this.variable.dbTable[1]).getAll();
        idbRequestLieu.onsuccess = (event) => {
          this.listeLieutemp = event.target.result;
          resolve();
        };
      };
    });
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
    return this.listeVille.filter(ville => ville.name.toLowerCase().includes(valeurAFiltrer) );
  }
  onValider() {
    console.log(this.villeControl.value);
    const objVille = this.listeVille.filter(ville => ville.name.toLowerCase().includes(this.villeControl.value.toString().toLowerCase()));
    console.log(objVille);
    const Local = {
      ville: objVille[0].name,
      region: this.regionControl.value.toString(),
      pays: objVille[0].country,
      coords: {
        lat: objVille[0].coord.lat,
        long: objVille[0].coord.lon
      }
    };
    this.openDialog(Local);
    this.refresh();
  }
  displayFonction(objet) {
    return objet ? objet : undefined;
  }

  displayFonctionRegion(objet) {
    return objet ? objet : undefined;
  }


  private initListe() {
    const urlListe = 'assets/listCity/citycameroun.json';
    this.jsonLoader.getJson(urlListe).subscribe(
      (resp) => {
        this.listeVille = resp.body;
        this.listeVille = this.listeVille.sort((a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          if (a === b) {
            return 0;
          } else if (a < b) {
            return -1;
          } else if (a < b) {
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
          const reponse = JSON.parse(xhttp.response);
          const ville = reponse.display_name;
          console.log('latitude' + lat1 + 'lonngitude' + long1);
          this.mapCarte.removeLayer(marker);
          marker = L.marker([lat1, long1], {
            icon: icon({
              iconSize: [30, 60],
              iconUrl: 'leaflet/marker-icon.png',
              shadowUrl: 'leaflet/marker-shadow.png'
            })
          });
          const popup = marker.addTo(this.mapCarte);
          popup.bindPopup(ville).openPopup();
          console.log(reponse);
          console.log(reponse.display_name.split(',')[0].split(' ')[0]);
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
    this.modif = true;
    alert('Ce lieu a ete ajoute au lieu dont vous pouvez obtenir la meteo');
  }



  cliquer() {
    const champVille = document.getElementById('ville');
  }


  voirMeteo() {
    let position1: Position;
    let position2: Position;
    const date = new Date();

    position1 = {
      position: '',
      ville: this.ville.split(' ')[0],
      heure: date.getTime(),
      jour: date.getDate(),
      langue: langue.fr,
      typeCoord: typePosition.ville,
      typeReq: typeRequete.instant
    };
    position2 = {
      position: '',
      ville: this.ville,
      heure: date.getTime(),
      jour: date.getDate(),
      langue: langue.fr,
      typeCoord: typePosition.ville,
      typeReq: typeRequete.prediction
    };
    this.setMeteo(position1);
  }

  supprimerLieu() {
    this.lieu.deleteLieu(this.ville);
    this.modif = true;
    this.refresh();
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
