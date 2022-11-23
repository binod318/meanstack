import { Component, OnInit } from '@angular/core';
import { RoutesConfig } from 'src/config/routes-config';
import { environment } from 'src/environments/environment';
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

  homeRoute:string = RoutesConfig.homeRoute;
  artistsRoute:string = RoutesConfig.artistsRoute;
  searchRoute:string = RoutesConfig.searchRoute;
  registerRoute:string = RoutesConfig.registerRoute;
  profileRoute:string = RoutesConfig.profileRoute;

  home_label:string = environment.home_label;
  artists_label:string = environment.artists_label;
  search_label:string = environment.search_label;
  register_label:string = environment.register_label;
  profile_label:string = environment.profile_label;

  constructor(private _authenticationService:AuthenticationService) { }

  ngOnInit(): void {
  }

}
