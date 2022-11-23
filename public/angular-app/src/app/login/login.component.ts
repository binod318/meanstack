import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { User } from '../models/user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }

  username!:string;
  user!: User;

  greeting_label:string = environment.greeting_label;
  login_label:string = environment.login_label;
  logout_label:string = environment.logout_label;
  username_label:string = environment.username_label;
  password_label:string = environment.password_label;

  @ViewChild('loginForm')
  loginForm!: NgForm;

  constructor(private _userService:UserDataService, private _authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.username = this._authenticationService.name;
    this._initializeForm()
  }

  reset(){
    this.user.reset();
  }

  login(): void{
    if(this.loginForm.valid){
      this._userService.login(this.user).subscribe({
        next: (result) => {
          this._authenticationService.token = result.token;
          this.username = this._authenticationService.name;
        },
        error: () => {},
        complete: () => {}
      });
    }
      
  }

  _removeToken(){
    localStorage.removeItem(environment.token_key);
  }

  logout(){
    this._removeToken();
    this.user.reset();
  }

  _initializeForm(): void{
    this.user = new User("","","","");
  }
}
