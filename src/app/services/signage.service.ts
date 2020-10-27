import { Terminal } from './../models/terminal.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Signage } from './../models/signage.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignageService {

  public url = 'https://localhost:5009/signage';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Signage[]> {
    return this.http.get<Signage[]>(this.url + '/GetAll');
  }

  getAllTerminals(): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(this.url + '/GetTerminals');
  }
}
