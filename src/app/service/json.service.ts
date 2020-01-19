import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  private body = [];
  constructor(private http: HttpClient) { }
  getJson(url: string): Observable<HttpResponse<any>> {
    return this.http.get(url, {observe: 'response'});
  }

}
