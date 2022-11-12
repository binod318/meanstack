import { Component, OnInit } from '@angular/core';
import { User } from '../register/register.component';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user!: User;

  constructor(private _userService:UserDataService) { }

  ngOnInit(): void {
    this._initializeForm()
  }

  login(): void{
    this._userService.login(this.user).subscribe(user => {
      if(user._id){
        alert('Logged in successfully!');
        this._initializeForm();
      }
    })
  }

  _initializeForm(): void{
    this.user = new User("","","","");
  }
}
