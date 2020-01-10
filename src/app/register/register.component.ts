import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CentralisationService} from '../service/centralisation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  image: string;
  constructor(private formBuilder: FormBuilder, private variable: CentralisationService) {     this.image = '../../images/profil.png';
  }

  ngOnInit() {
  }

}
