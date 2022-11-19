import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistFormComponent } from './artist-form/artist-form.component';
import { ArtistComponent } from './artist/artist.component';
import { ArtistsComponent } from './artists/artists.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'artists',
    component: ArtistsComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'artist/:artistId',
    component: ArtistComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'artistform',
    component: ArtistFormComponent
  },
  {
    path: 'artistform/:artistId',
    component: ArtistFormComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
