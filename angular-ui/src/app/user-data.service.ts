import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginToken } from './login/login.component';
import { User } from './register/register.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private _baseUrl: string = "http://localhost:3000/api";

  constructor(private _http:HttpClient) { }

  public createUser(user: User): Observable<User> {
    const url = this._baseUrl + "/users/";
    return this._http.post<User>(url, user.ToJson());
  }

  public login(user: User): Observable<LoginToken>{
    const url = this._baseUrl + "/users/login";
    return this._http.post<LoginToken>(url, user.ToJson());
  }
}
