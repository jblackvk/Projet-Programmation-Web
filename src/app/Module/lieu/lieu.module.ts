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
  public lieu;
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
      const idbRequestLieu = obj.objectStore(this.variable.dbTable[1]).getAll();
      idbRequestLieu.onsuccess = (event) => {
        const even = event.target.result;
      };
    };
  }

  getLieuFixe(li) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
      const lieu = obj.objectStore(this.variable.dbTable[1]).index('ville').get(li);
      lieu.onsuccess = () => {
      };
      return lieu;

    };
  }

  deleteLieu(nom) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const obj = db.transaction([this.variable.dbTable[1]], 'readwrite');
      const store = obj.objectStore(this.variable.dbTable[1]);
      const ind = store.index('ville');
      store.delete(ind.get(nom).id);
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
