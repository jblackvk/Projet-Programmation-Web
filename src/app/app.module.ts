import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialCompModule} from './Module/material-comp/material-comp.module';
import {CentralisationService} from './service/centralisation.service';
import {RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {AuthGuard} from './service/authGuard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import {ReactiveFormsModule} from '@angular/forms';

const appRoutes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  {path: '', component: HomeComponent},
  {path: 'NOT-FOUND', component: NotFoundComponent},
  {path: '**', redirectTo: '/NOT-FOUND'}
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialCompModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
  ],
  providers: [
      CentralisationService,
      AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
