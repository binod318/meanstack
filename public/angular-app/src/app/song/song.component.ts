import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesConfig } from 'src/config/routes-config';
import { environment } from 'src/environments/environment';
import { ArtistsDataService } from '../artists-data.service';
import { Song } from '../models/song';
import { Location } from '@angular/common';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  hasSuccess:boolean = false;
  hasError:boolean = false;
  successMessage!:string;
  errorMessage!:string;

  titleLabel:string = environment.title_abel;
  rankLabel:string = environment.rank_abel;
  yearLabel:string = environment.year_label;
  albumLabel:string = environment.album_label;

  addButtonText:string = environment.add_label;
  updateButtonText:string = environment.update_label;

  song!:Song;
  artistId!:string;
  songId!:string;

  //field injection from form
  @ViewChild('songForm')
  songForm!:NgForm;

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }
  
  constructor(private _artistsService:ArtistsDataService, 
              private _route:ActivatedRoute,
              private _location:Location, 
              private _authenticationService:AuthenticationService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeForm();
    },0);
  }

  initializeForm(){
    this.artistId = this._route.snapshot.params[environment.artist_id];
    this.songId = this._route.snapshot.params[environment.song_id];

    //if songId is passed in params then this form should work as edit form
    if(this.songId){
      this._artistsService.getSong(this.artistId, this.songId).subscribe(song =>{
        this.song = new Song(song.title, song.rank, song.year, song.album);

        this.songForm.setValue(this.song.ToJson());
      })
    } else {
      this.song = new Song("", "", "", "");
      this.songForm.setValue(this.song.ToJson());
    }
  }

  onSubmit(){
    if(this.songForm.valid){
      const newSong = new Song(
        this.songForm.value.title,
        this.songForm.value.rank,
        this.songForm.value.year,
        this.songForm.value.album
      );
  
      //update
      if(this.songId){
        newSong._id = this.songId;    
        this._artistsService.updateSong(this.artistId, newSong).subscribe({
          next: () => {
            this.hasSuccess = true;
            this.hasError = false;
            this.successMessage = environment.song_update_success_message;
          },
          error: () => {
            this.hasSuccess = false;
            this.hasError = true;
            this.errorMessage = environment.song_update_fail_message;
          },
          complete: () => {
            setTimeout(() => {
              this._location.back();
            }, 2000);
          }
        });
      } else {
        this._artistsService.addSong(this.artistId, newSong).subscribe({
          next: () => {
            this.hasSuccess = true;
            this.hasError = false;
            this.successMessage = environment.song_add_success_message;
          },
          error: () => {
            this.hasSuccess = false;
            this.hasError = true;
            this.errorMessage = environment.song_add_fail_message;
          },
          complete: () => {
            setTimeout(() => {
              this._location.back();
            }, 2000);
          }
        });
      }
    }
  }
}
