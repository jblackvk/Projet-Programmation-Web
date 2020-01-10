import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  image: string;
  constructor(private formBuilder: FormBuilder, private variable: CentralisationService) {     this.image="../../images/profil.png";
  }

  ngOnInit() {
  }

}
