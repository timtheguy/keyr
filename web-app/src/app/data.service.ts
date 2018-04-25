import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result:any;

  constructor(private http: Http) { }

  getUsers() {
    return this.http.get("/api/users")
      .map(result => this.result = result.json().data);   
  }

  enrollUser(name){
    return this.http.post("/api/enroll", {"id":name})
      .map(result => result.json());
  }

  addMessage(message){
    return this.http.post("/api/addMessage", {"message":message})
    .map(result => this.result = result.json());
  }

  getOrganization() {
    return this.http.get("/api/organization")
      .map(result => result.json());
  }

}