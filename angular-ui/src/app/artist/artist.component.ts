import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../artists/artists.component';
import { AuthenticationService } from '../authentication.service';

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

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }

  constructor(private _artistsService:ArtistsDataService, private _route:ActivatedRoute, private _router:Router, private _authenticationService:AuthenticationService) { 
    this.artist = new Artist("", "", "","","","");
  }

  ngOnInit(): void {
    const artistId = this._route.snapshot.params['artistId'];
    this._artistsService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
    })
  }

  deleteArtist(){
    const artistId = this._route.snapshot.params['artistId'];
    this._artistsService.deleteArtist(artistId).subscribe({
      next: () => {
          this.hasSuccess = true;
          this.hasError = false;
          this.successMessage = "Artist deleted successfully."
        },
        error: () => {
          this.hasSuccess = false;
          this.hasError = true;
          this.errorMessage = "Failed to delete artist!"
        },
      complete: () => {
        setTimeout(() => {
          this._router.navigate(["artists"]);
        }, 2000);
      }
    });
  }

}
