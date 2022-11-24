import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from 'src/config/routes-config';
import { ArtistFormComponent } from './artist-form/artist-form.component';
import { ArtistComponent } from './artist/artist.component';
import { ArtistsComponent } from './artists/artists.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { SongComponent } from './song/song.component';

const routes: Routes = [
  {
    path: RoutesConfig.homeRoute,
    component: HomeComponent
  },
  {
    path: RoutesConfig.artistsRoute,
    component: ArtistsComponent
  },
  {
    path: RoutesConfig.searchRoute,
    component: SearchComponent
  },
  {
    path: RoutesConfig.artistDetailPath,
    component: ArtistComponent
  },
  {
    path: RoutesConfig.registerRoute,
    component: RegisterComponent
  },
  {
    path: RoutesConfig.profileRoute,
    component: ProfileComponent
  },
  {
    path: RoutesConfig.addArtistRoute,
    component: ArtistFormComponent
  },
  {
    path: RoutesConfig.editArtistPath,
    component: ArtistFormComponent
  },
  {
    path: RoutesConfig.addSongRoute,
    component: SongComponent
  },
  {
    path: RoutesConfig.editSongRoute,
    component: SongComponent
  },
  {
    path: RoutesConfig.loginRoute,
    component: LoginComponent
  },
  {
    path: RoutesConfig.errorRoute,
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
