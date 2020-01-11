import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CentralisationService implements OnInit {
  // nom de la base de donnee
  dbname = 'MeteoApp';
  dbTable = ['Utilisitateur', 'Lieu', 'Meteo'];
  public name;
  public email;
  public password;
  public photosLink;
  public url;
  private appid;
  public isAuth = false;

   Meteo = {
  temperature : 0 ,
  pression: 0,
  humidite: 0,
  description: '',
  Lieu: '',
  Heure: '',
  jour: '',
  icon: '',
  };
  constructor() {
  }
  setUrl(position: Position) {
    if (position.typeCoord === typePosition.coordonee) {
      if (position.typeReq === typeRequete.instant) {
        this.url = `api.openweathermap.org/data/2.5/weather?lat=${position.lat}
        &lon=${position.long}&units=metric&lang=${position.langue}&appid=${this.appid}`;
      } else if (position.typeReq === typeRequete.prediction) {
        this.url = `api.openweathermap.org/data/2.5/forecast?lat=${position.lat}
        &lon=${position.long}&units=metric&lang=${position.langue}&appid=${this.appid}`;
      } else {
        console.log('erreur dans l\'ecriture du type de requete');

      }
    } else if (position.typeCoord === typePosition.ville) {
      if (position.typeReq === typeRequete.instant) {
        this.url = `api.openweathermap.org/data/2.5/weather?q=${position.ville}&units=metric&lang=${position.langue}&appid=${this.appid}`;
      } else if (position.typeReq === typeRequete.prediction) {
        this.url = `api.openweathermap.org/data/2.5/forecast?q=${position.ville}&units=metric&lang=${position.langue}&appid=${this.appid}`;
      } else {
        console.log('erreur dans l\'ecriture du type de requete');
      }
    } else {
      console.log('erreur dans l\'ecriture du type de coordonne');
    }
  }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit() {

  }
}
enum typePosition {'coordonee', 'ville' }
enum typeRequete {'instant', 'prediction'}
enum langue {'fr',  'en'}
interface Position {
  lat: number;
  long: number;
  ville: string;
  langue: langue;
  typeCoord: typePosition;
  typeReq: typeRequete;
}
