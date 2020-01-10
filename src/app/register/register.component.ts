import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CentralisationService} from '../service/centralisation.service';
import {AuthentificationModule} from '../Module/authentification/authentification.module';
import {LoginModule} from '../Module/login/login.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private variable: CentralisationService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: '',
      prenom: '',
      email: '',
      motDePasse: '',
      passConfirm: '',
      sexe: '',
      dateNaissance: '',
      photoProfil: '',
    });
  }
  getPhoto() {
    console.log('photo recuperer');
  }

  register() {
    const formValue = this.registerForm.value;
    const registerer = new LoginModule(this.variable);
    registerer.Enregistrer( formValue['name'], formValue['prenom'], formValue['sexe'],
      formValue['dateNaissance'], formValue['email'], formValue['photoProfil'], formValue['motDePasse']);
    console.log('register');
  }
}
