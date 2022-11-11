import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../artists/artists.component';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.css']
})
export class ArtistFormComponent implements OnInit {

  artist!:Artist;

  //field injection from form
  @ViewChild('artistForm')
  artistForm!:NgForm;

  constructor(private _artistsService:ArtistsDataService) { }

  ngOnInit(): void {

    //initialize the form only after the load is complete
    setTimeout(() => {
      this.initializeForm();
    },0);
  }

  initializeForm(){
    this.artist = new Artist("", 0, "","",[""],"");
    this.artistForm.setValue(this.artist.ToJson());
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

    this._artistsService.addArtist(newArtist).subscribe(artist => {
      //if the response has _id, it means add operation is successfull
      if(artist._id){
        this.initializeForm();
      }
    })
  }
}
