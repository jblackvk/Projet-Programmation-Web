import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialCompModule} from './Module/material-comp/material-comp.module';
import {CentralisationService} from './service/centralisation.service';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './service/authGuard.service';
import {NotFoundComponent} from './not-found/not-found.component';
import {LocationComponent} from './location/location.component';
import {WeatherComponent} from './weather/weather.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {JsonService} from "./service/json.service";
import {HttpClientModule} from "@angular/common/http";
import {MatAutocompleteModule} from "@angular/material";

const appRoutes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  {path: 'location', canActivate: [AuthGuard], component: LocationComponent},
  {path: 'weather', canActivate: [AuthGuard], component: WeatherComponent},
  {path: '', component: WeatherComponent},
  {path: 'NOT-FOUND', component: NotFoundComponent},
  {path: '**', redirectTo: '/NOT-FOUND'}
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    LocationComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialCompModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MatExpansionModule,
    HttpClientModule,
    MatAutocompleteModule,
  ],
  providers: [
    CentralisationService,
    AuthGuard,
    JsonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
