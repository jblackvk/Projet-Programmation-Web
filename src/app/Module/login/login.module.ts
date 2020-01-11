import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CentralisationService} from '../../service/centralisation.service';
import {isNullOrUndefined} from 'util';
import {Router} from "@angular/router";


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

  dataStore(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      this.db = e.target.result;
      this.Enregistrer(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI);
      console.log('db open');
    };
    index.onerror = () => {
      console.log('vous avez refuser l\'access a indexDb et nous ne pouvons pas vous sauvegarder vos donnees');
    };
  }

  dataUpdate(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI) {
    const index = indexedDB.open(this.variable.dbname);
    index.onsuccess = (e) => {
      // @ts-ignore
      this.db = e.target.result;
      this.update(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI);
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
      const utilisateur = {
        nom: nomI,
        prenom: prenomI,
        sexe: sexeI,
        email: emailI,
        dateNaissance: dateNaissanceI,
        password: passI,
        photo: photoI,
      };

      const Enregistrement = this.db.transaction([this.variable.dbTable[0]], 'readwrite');
      const objectstore = Enregistrement.objectStore(this.variable.dbTable[0]);
      objectstore.add(utilisateur);
      Enregistrement.oncomplete = () => {
        console.log('reussi');
        ret = 'enregistrement reussi';
      };
      Enregistrement.onerror = (e) => {
        console.log(e);
        ret = 'enregistrement echoue';
      };
      Enregistrement.onabort = () => {
        ret = 'enregistrement annule';
      };
      return ret;
    }
  }

  update(nomI, prenomI, sexeI, dateNaissanceI, emailI, photoI, passI): string {
    let ret;
    if (isNullOrUndefined(nomI) || isNullOrUndefined(emailI)
      || isNullOrUndefined(sexeI) || isNullOrUndefined(prenomI) || isNullOrUndefined(dateNaissanceI)
      || isNullOrUndefined(photoI) || isNullOrUndefined(passI)) {
      return 'champs non rempli';
    } else {
      const utilisateur = {
        nom: nomI,
        prenom: prenomI,
        sexe: sexeI,
        email: emailI,
        dateNaissance: dateNaissanceI,
        password: passI,
        photo: photoI,
      };

      const Enregistrement = this.db.transaction([this.variable.dbTable[0]], 'readwrite');
      const objectstore = Enregistrement.objectStore(this.variable.dbTable[0]);
      objectstore.put(utilisateur);
      Enregistrement.oncomplete = () => {
        console.log('reussi');
        ret = 'enregistrement reussi';
      };
      Enregistrement.onerror = (e) => {
        console.log(e);
        ret = 'enregistrement echoue';
      };
      Enregistrement.onabort = () => {
        ret = 'enregistrement annule';
      };
      return ret;
    }
  }
}

