import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../models/artist';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';
import { RoutesConfig } from 'src/config/routes-config';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist!: Artist;
  hasSuccess:boolean = false;
  hasError:boolean = false;
  successMessage!:string;
  errorMessage!:string;

  //labels
  bornYearLabel:string = environment.bornYear_label;
  genderLabel:string = environment.gender_label;
  nationLabel:string = environment.nation_label;
  firstSongLabel:string = environment.firstSong_label;
  bandsLabel:string = environment.bands_label;
  delete_label:string = environment.delete_label;

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }

  constructor(private _artistsService:ArtistsDataService, private _route:ActivatedRoute, private _router:Router, private _authenticationService:AuthenticationService) { 
    this.artist = new Artist("", "", "", "","","","");
  }

  ngOnInit(): void {
    this._fetchArtist();
  }

  _fetchArtist(): void {
    const artistId = this._route.snapshot.params[environment.artist_id];
    this._artistsService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
    })
  }

  deleteArtist(){
    const artistId = this._route.snapshot.params[environment.artist_id];
    this._artistsService.deleteArtist(artistId).subscribe({
      next: () => {
          this.hasSuccess = true;
          this.hasError = false;
          this.successMessage = environment.artist_delete_success_message;
        },
        error: () => {
          this.hasSuccess = false;
          this.hasError = true;
          this.errorMessage = environment.artist_delete_fail_message;
        },
      complete: () => {
        setTimeout(() => {
          this._router.navigate([RoutesConfig.artistsRoute]);
        }, 2000);
      }
    });
  }

  confirmEdit(action: string){
    console.log(this.artist.bornYear, action, this.artist);

    if(action.split('|')[0] === 'cancel')
      this._fetchArtist();
    else {
      const updatedArtist = new Artist(this.artist._id, "", "", "", "", "","");

      //gets label from child component
      switch(action.split('|')[1]){
        case this.bornYearLabel:
          updatedArtist.bornYear = this.artist.bornYear;
          break;
        case this.genderLabel:
          updatedArtist.gender = this.artist.gender;
          break;
        case this.nationLabel:
          updatedArtist.nation = this.artist.nation;
          break;
        case this.firstSongLabel:
          updatedArtist.firstSong = this.artist.firstSong;
          break;
        // case this.bornYearLabel:
        //   updatedArtist.bornYear = this.artist.bornYear;
        //   break;
        
        default:
          break;
      }

      this._updateArtist(updatedArtist);
    }
  }

  _updateArtist(artist:Artist){
    this._artistsService.partialUpdateArtist(artist).subscribe({
      next: () => {},
      error: () => {},
      complete: () => {}
    })
  }
}
