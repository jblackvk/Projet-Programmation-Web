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
  constructor(private variable: CentralisationService) {}

  setMeteo(meteo: Meteo) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[3]], 'readwrite');
      const store = obj.objectStore(this.variable.dbTable[3]);
      store.add(meteo);
    };
    index.onerror = () => {
      console.log('vous devez authoriser l\'access a indexedDb');
    };
  }

  getMeteoNow(position: Position): string {
    console.log('Meteo actuelle');
    // tslint:disable-next-line:prefer-const
    let met: Meteo;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        console.log('envoie de la requette');
        const response = JSON.parse(xhttp.responseText);
        met.temperature = response.main.temp;
        met.pression = response.main.pressure;
        met.humidite = response.main.humidity;
        met.description = response.wheater[0].description;
        met.icon = response.wheater[0].icon;
        met.Lieu = response.name;
        met.Heure = position.heure;
        met.jour = position.jour;
      }
    };
    xhttp.open('GET', this.variable.url);
    xhttp.send();
    if (isNullOrUndefined(met)) {
      this.setMeteo(met);
      return 'good';
    } else {
      return 'nous ne parvenons pas a trouver la meteo que vous rechercher';
    }

  }

  getMeteoPredict(position: Position) {
    console.log('prevision 1');
    // tslint:disable-next-line:prefer-const
    let met: Meteo;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        console.log('envoie de la requette');
        const response = JSON.parse(xhttp.responseText);
        const liste = response.list;
        for (let i = 0; i < liste.lenght ; i++ ) {
          met.temperature = liste[i].main.temp;
          met.pression = liste[i].main.pressure;
          met.humidite = liste[i].main.humidity;
          met.description = liste[i].wheater[0].description;
          met.icon = liste.wheater[0].icon;
          met.Lieu = response.city.name;
          const dateTime = response.list[i].dt_txt;
          met.Heure = this.traductHour(dateTime.substr(11, dateTime.length));
          met.jour = dateTime.substr(0, 10);
          this.setMeteo(met);
        }

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

interface Position {
  lat: number;
  long: number;
  heure: Heure;
  jour: string;
}

interface Meteo {
  temperature: number;
  pression: number;
  humidite: number;
  description: string;
  Lieu: string;
  Heure: Heure;
  jour: string;
  icon: string;
}

