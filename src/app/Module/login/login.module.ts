import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';
import {isNullOrUndefined} from 'util';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class LoginModule {
   db: IDBDatabase;
  constructor(private variable: CentralisationService) {
  }
  dataStore() {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      this.db = e.target.result;
      console.log('db open');
    };
    index.onerror = () => {
      console.log('vous avez refuser l\'access a indexDb et nous ne pouvons pas vous sauvegarder vos donnees');
    };
  }
  Enregistrer(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI): string {
    let ret;
    if (isNullOrUndefined(nomI) || isNullOrUndefined(emailI)
      || isNullOrUndefined(sexeI) || isNullOrUndefined(prenomI) || isNullOrUndefined(dateNaissanceI)
      || isNullOrUndefined(photoI) || isNullOrUndefined(passI)) {
      return 'champs non rempli';
    } else {
      this.dataStore();
      const utilisateur = {
          nom : nomI,
          prenom : prenomI,
          sexe : sexeI,
          email : emailI,
          dateNaissance : dateNaissanceI,
          password : passI,
          photo : photoI,
        };

      const Enregistrement = this.db.transaction([this.variable.dbname], 'readwrite');
      const objectstore = Enregistrement.objectStore(this.variable.dbTable[0]);
      objectstore.add(utilisateur);
      Enregistrement.oncomplete = () => {
          console.log('reussi');
          ret = 'enregistrement reussi';
        };
      Enregistrement.onerror = () => {
          ret = 'enregistrement echoue';
        };
      Enregistrement.onabort = () => {
          ret = 'enregistrement annule';
        };
      return ret;
    }
  }
}