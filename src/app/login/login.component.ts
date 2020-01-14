import {Component, OnInit} from '@angular/core';
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

  constructor(private router: Router,
              private formBuilder: FormBuilder, private variab: CentralisationService) {
  }

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
      const userRequest = list.get(formValue.email);
      userRequest.onsuccess = () => {
        const user = userRequest.result;
        if ((!isNullOrUndefined(user.email))
          && (user.password === formValue.motDePasse)) {
          this.variab.isAuth = true;
          window.localStorage.setItem('isAuth', 'true');
          console.log(this.variab.isAuth);
          this.router.navigate(['/weather']);
        } else {
          this.variab.isAuth = false;
          console.log(this.variab.isAuth);
        }
      };
    };
    console.log('submit');
  }
}
