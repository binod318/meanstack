import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  get isLoggedIn() {
    if (this.token)
      return true;
    else
      return false;
  }

  get token(): string {
    return localStorage.getItem('token') as string || "";
  }
  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get name() {
    if(this.token){
      return this._jwtService.decodeToken(this.token).name;
    } else {
      return "";
    }
  }

  constructor(private _jwtService: JwtHelperService) { }
}
