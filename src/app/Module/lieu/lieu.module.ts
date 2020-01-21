import {NgModule, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class LieuModule {
  private ville;
  private region;
  private pays;
  private coordonnee = {
    long: '',
    lat: ''
  };

  constructor(private variable: CentralisationService) {}
  getLieu() {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
      const lieu = obj.objectStore().getAll();
      lieu.onsuccess = () => {
        alert('lieu enregistre');
      };
    };
  }

  setLieu(lieu: Lieu) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
      const store = obj.objectStore(this.variable.dbTable[1]);
      store.add(lieu);
    };
  }
}

interface Lieu {
  ville: string;
  region: string;
  pays: string;
  coords: {
    lat: number;
    long: number;
  };
}
