import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../artists/artists.component';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.css']
})
export class ArtistFormComponent implements OnInit {

  hasSuccess:boolean = false;
  hasError:boolean = false;
  successMessage!:string;
  errorMessage!:string;

  artist!:Artist;
  artistId!:string;

  //field injection from form
  @ViewChild('artistForm')
  artistForm!:NgForm;

  constructor(private _artistsService:ArtistsDataService, 
              private _route:ActivatedRoute,
              private _router:Router) { }

  ngOnInit(): void {

    //initialize the form only after the load is complete
    setTimeout(() => {
      this.initializeForm();
    },0);
  }

  initializeForm(){
    this.artistId = this._route.snapshot.params['artistId'];

    //if artistId is passed in params then this form should work as edit form
    if(this.artistId){
      this._artistsService.getArtist(this.artistId).subscribe(artist =>{
        this.artist = new Artist(artist.artistName, artist.bornYear, artist.gender,artist.nation,artist.bands,artist.firstSong);
        this.artistForm.setValue(this.artist.ToJson());
      })
    } else {
      this.artist = new Artist("", "", "","","","");
      this.artistForm.setValue(this.artist.ToJson());
    }
  }

  onSubmit(){

    if(this.artistForm.valid){
      const newArtist = new Artist(
        this.artistForm.value.artistName,
        this.artistForm.value.bornYear,
        this.artistForm.value.nation,
        this.artistForm.value.gender,
        this.artistForm.value.bands,
        this.artistForm.value.firstSong
      );
  
      //update
      if(this.artistId){
        newArtist._id = this.artistId;    
        this._artistsService.updateArtist(newArtist).subscribe({
          next: () => {
            this.hasSuccess = true;
            this.hasError = false;
            this.successMessage = "Artist updated successfully."
          },
          error: () => {
            this.hasSuccess = false;
            this.hasError = true;
            this.errorMessage = "Failed to update artist!"
          },
          complete: () => {
            setTimeout(() => {
              this._router.navigate(["artists"]);
            }, 2000);
          }
        });
  
      } else {
        this._artistsService.addArtist(newArtist).subscribe({
          next: () => {
            this.hasSuccess = true;
            this.hasError = false;
            this.successMessage = "New artist added successfully."
          },
          error: () => {
            this.hasSuccess = false;
            this.hasError = true;
            this.errorMessage = "Failed to add new artist!"
          },
          complete: () => {
            setTimeout(() => {
              this._router.navigate(["artists"]);
            }, 2000);
          }
        });
      }
    }
  }
}
