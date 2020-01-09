import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InitDbModule  {
  constructor(private variable: CentralisationService) {}
  dataStore() {
    const index = indexedDB.open(this.variable.dbname);
    index.onupgradeneeded = (e) => {
      // @ts-ignore
       const db = e.target.result;

       if (!db.objectStoreNames.contains(this.variable.dbTable[0])) {
         const User = db.createObjectStore(this.variable.dbTable[0], {keyPath: 'id', autoIncrement: true});
         User.createIndex('name', 'name', {unique: false});
         User.createIndex('email', 'email', {unique: true});
       }

       if (!db.objectStoreNames.contains(this.variable.dbTable[1])) {
         const Lieu = db.createObjectStore(this.variable.dbTable[1], {keyPath : 'position', autoIncrement : true});
         Lieu.createIndex('ville', 'ville', {unique : false});
         Lieu.createIndex('pays', 'pays', {unique : false});
       }
        const Meteo = db.createObjectStore(this.variable.dbTable[2], {keyPath: 'id', autoIncrement : true});
        Meteo.createIndex('Heure', 'Heure', {unique : false});
        Meteo.createIndex('Jour', 'Jour', {unique : false});


    };
    index.onsuccess = (e) => {
      // @ts-ignore
      db = e.target.result;
      console.log('db open');
    };
    index.onerror = () => {
      console.log('vous avez refuser l\'access a indexDb et nous ne pouvons pas vous sauvegarder vos donnees');
    };


  }
}