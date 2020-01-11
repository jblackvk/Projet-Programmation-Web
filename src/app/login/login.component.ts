import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {variable} from '@angular/compiler/src/output/output_ast';
import {CentralisationService} from '../service/centralisation.service';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  constructor(  private router: Router,
                private formBuilder: FormBuilder, private variab: CentralisationService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      // pseudo: '',
      email: '',
      motDePasse: '',
    });
  }

  onSubmit() {
    const readDB = indexedDB.open(this.variab.dbname);
    const formValue = this.userForm.value;
    readDB.onsuccess = (e) => {
      // @ts-ignore
      const db = e.target.result;
      const transact = db.transaction([this.variab.dbTable[0]], 'readwrite');
      const conn = transact.objectStore(this.variab.dbTable[0]);
      const list = conn.index('email');
      if ( (!isNullOrUndefined(list.get(formValue.email).email))
        && (list.get(formValue.email).password === formValue.motDePasse) ) {
        this.variab.isAuth = true;
      } else {
        this.variab.isAuth = false;
      }
    };
    this.router.navigate(['/weather']);
    console.log('submit');
  }
}
