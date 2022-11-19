import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }

  constructor(private _authenticationService:AuthenticationService) { }

  ngOnInit(): void {
  }

}
