import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UrlConfig } from 'src/config/url-config';
import { LoginToken } from './models/login-token';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _http:HttpClient) { }

  public createUser(user: User): Observable<User> {
    const url = UrlConfig.usersUrl;
    return this._http.post<User>(url, user.ToJson());
  }

  public login(user: User): Observable<LoginToken>{
    const url = UrlConfig.loginUrl;
    return this._http.post<LoginToken>(url, user.ToJson());
  }
}
