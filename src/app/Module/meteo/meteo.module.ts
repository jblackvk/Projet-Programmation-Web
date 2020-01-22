import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';
import {isNullOrUndefined} from 'util';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class MeteoModule {
  met = {
    temperature: 0,
  pression: 0,
  humidite: 0,
  description: '',
  Lieu: '',
  Heure: '',
  jour: '',
  icon: '',
  };

  constructor(private variable: CentralisationService) {}

  setMeteo(meteo: Meteo) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[2]], 'readwrite');
      const store = obj.objectStore(this.variable.dbTable[2]);
      store.add(meteo);
    };
    index.onerror = () => {
      console.log('vous devez authoriser l\'access a indexedDb');
    };
  }

  getMeteoNow(position: Position): any {
    // tslint:disable-next-line:prefer-const
    this.variable.setUrl(position);
    const xhttp = new XMLHttpRequest();
    // tslint:disable-next-line:only-arrow-functions
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const response = JSON.parse(xhttp.responseText);
        this.met.temperature = response.main.temp;
        this.met.pression = response.main.pressure;
        this.met.humidite = response.main.humidity;
        this.met.description = response.weather[0].description;
        this.met.icon = response.weather[0].icon;
        this.met.Lieu = response.name;
        this.met.Heure = position.heure;
        this.met.jour = position.jour;
      }
    };
    xhttp.onloadend = () => {
    };
    xhttp.open('GET', this.variable.url);
    xhttp.send();
  }

  getMeteoPredict(position: Position): any {
    console.log('prevision');
    // tslint:disable-next-line:prefer-const
    let metPredict: Meteo;
    const metPf: Meteo[] = [];
    const xhttp = new XMLHttpRequest();
    this.variable.setUrl(position);
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        console.log('envoie de la requette');
        const response = JSON.parse(xhttp.responseText);
        const liste = response.list;
        for (let i = 0; i < liste.lenght ; i++ ) {
          metPredict.temperature = liste[i].main.temp;
          metPredict.pression = liste[i].main.pressure;
          metPredict.humidite = liste[i].main.humidity;
          metPredict.description = liste[i].weather[0].description;
          metPredict.icon = liste.weather[0].icon;
          metPredict.Lieu = response.city.name;
          const dateTime = response.list[i].dt_txt;
          metPredict.Heure = this.traductHour(dateTime.substr(11, dateTime.length));
          metPredict.jour = dateTime.substr(0, 10);
          this.setMeteo(metPredict);
          metPf.push(metPredict);
        }
        return metPf;
      }
    };
    xhttp.open('GET', this.variable.url);
    xhttp.send();
  }
  // fonction pour convertir l'heure au bon format
  traductHour(heure: string): Heure {
    const h =  toNumbers(heure.substr(0, 2));
    // const m = toNumbers(heure.substr(3, 2));
    let heur: Heure;
    switch (h[1]) {
      case  0:
      case 1:
        // tslint:disable-next-line:no-unused-expression
        heur = Heure['00H00'] ;
        break;
      case 2:
      case 3:
        heur = Heure['02H00'] ;
        break;
      case 4:
      case 5:
        heur = Heure['04H00'];
        break;
      case 6:
      case 7:
        heur = Heure['06H00'];
        break;
      case 8:
      case 9:
        heur = Heure['08H00'];
        break;
      case 10:
      case 11:
        heur = Heure['10H00'];
        break;
      case 12:
      case 13:
        heur = Heure['12H00'];
        break;
      case 14:
      case 15:
        heur = Heure['14H00'];
        break;
      case 16:
      case 17:
        heur = Heure['16H00'];
        break;
      case 18:
      case 19:
        heur = Heure['18H00'];
        break;
      case 20:
      case 21:
        heur = Heure['20H00'];
        break;
      case 22:
      case 23:
        heur = Heure['22H00'];
        break;
    }
    return heur;
  }

}

enum Heure { '00H00', '02H00', '04H00', '06H00', '08H00', '10H00', '12H00',
  '14H00', '16H00', '18H00', '20H00', '22H00', '24H00'}
interface Meteo {
  temperature: number;
  pression: number;
  humidite: number;
  description: string;
  Lieu: string;
  Heure: any;
  jour: any;
  icon: string;
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

