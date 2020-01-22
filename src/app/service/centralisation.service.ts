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
  private appid = 'e469cd9a36352ce261cd13509a0004d8';
  public isAuth = false;
  public listeLieu;

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
    if (position.typeCoord === typePosition.coordonnee) {
      if (position.typeReq === typeRequete.instant) {
        this.url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.position.lat}` +
        `&lon=${position.position.long}&units=metric&appid=` + this.appid;
      } else if (position.typeReq === typeRequete.prediction) {
        this.url = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.position.lat}` +
        `&lon=${position.position.long}&units=metric&appid=` + this.appid;
      } else {
        console.log('erreur dans l\'ecriture du type de requete');

      }
    } else if (position.typeCoord === typePosition.ville) {
      if (position.typeReq === typeRequete.instant) {
        this.url = `https://api.openweathermap.org/data/2.5/weather?q=${position.ville}&units=metric&appid=` + this.appid;
      } else if (position.typeReq === typeRequete.prediction) {
        this.url = `https://api.openweathermap.org/data/2.5/forecast?q=${position.ville}&units=metric&appid=` + this.appid;
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
enum typePosition {'coordonnee', 'ville' }
enum typeRequete {'instant', 'prediction'}
enum langue {'fr',  'en'}
interface Position {
  position;
  ville: string;
  langue: langue;
  typeCoord: typePosition;
  typeReq: typeRequete;
}
