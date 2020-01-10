import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CentralisationService} from '../service/centralisation.service';
import {LoginModule} from '../Module/login/login.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  image: string;
  constructor(private formBuilder: FormBuilder, private variable: CentralisationService) {}

  ngOnInit() {
    this.initForm();
    this.image = '../../images/profil.png';
  }
  initForm() {
    this.registerForm = this.formBuilder.group({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      passConfirm: '',
      sexe: '',
      dateDeNaissance: '',
      photoDeProfil: '',
    });
  }
  getPhoto() {
  }

  register() {
  }

  onSubmit() {
    const formValue = this.registerForm.value;
    const registrerer = new LoginModule(this.variable);
    registrerer.Enregistrer(formValue['nom'], formValue['prenom'],
      formValue['sexe'], formValue['dateDeNaissance'],
      formValue['email'], formValue['photoDeProfil'], formValue['motDePasse'] );
  }
}
