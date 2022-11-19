import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { User } from '../register/register.component';
import { UserDataService } from '../user-data.service';

export class LoginToken {
  success:boolean = false;
  token:string = "";
}

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
    localStorage.removeItem("token");
  }

  logout(){
    this._removeToken();
    this.user.reset();
  }

  _initializeForm(): void{
    this.user = new User("","","","");
  }
}
