import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {LieuModule} from '../Module/lieu/lieu.module';
import {CentralisationService} from '../service/centralisation.service';
import {MeteoModule} from '../Module/meteo/meteo.module';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Component({
  selector: 'app-lieu',
  templateUrl: './lieu.component.html',
  styleUrls: ['./lieu.component.css']
})
export class LieuComponent implements OnInit {

  @Input()
  ville: string;
  @Input()
  region: string;
  @Input()
  pays: string;
  @Input()
  position;
  lieu;
  meteo;
  @Output() changeMeteo = new EventEmitter();
  @Output() changemeteoPredAff = new EventEmitter();
  constructor(private variable: CentralisationService) { }

  ngOnInit() {
    this.lieu = new LieuModule(this.variable);
    this.meteo = new MeteoModule(this.variable);
  }

  supprimerLieu() {
   this.lieu.deleteLieu(this.ville);
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
    this.changeMeteo.emit(position1);
    this.changemeteoPredAff.emit(position2);
  }
}
enum Heure { '00H00', '02H00', '04H00', '06H00', '08H00', '10H00', '12H00',
'14H00', '16H00', '18H00', '20H00', '22H00', '24H00'}
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
