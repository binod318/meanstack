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
      this.artist = new Artist("", 0, "","",[""],"");
      this.artistForm.setValue(this.artist.ToJson());
    }
  }

  onSubmit(){
    const newArtist = new Artist(
      this.artistForm.controls['artistName'].value,
      this.artistForm.controls['bornYear'].value,
      this.artistForm.controls['nation'].value,
      this.artistForm.controls['gender'].value,
      this.artistForm.controls['bands'].value,
      this.artistForm.controls['firstSong'].value
    );

    //update
    if(this.artistId){
      newArtist._id = this.artistId;    
      this._artistsService.updateArtist(newArtist).subscribe(() => {
          this._router.navigate(["artists"]);
      });
    } else {
      this._artistsService.addArtist(newArtist).subscribe(artist => {
        //if the response has _id, it means add operation is successfull
        if(artist._id){
          this.initializeForm();
        }
      });
    }
  }
}
