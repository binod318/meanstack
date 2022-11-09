import { Component, OnInit } from '@angular/core';
import { ArtistsDataService } from '../artists-data.service';

export class Artist {
  #_id!:string;
  #artistName!:string;
  #bornYear!:number;
  #nation!:string;
  #gender!:string;
  #bands!:[string];
  #firstSong!:string;

  get _id() { return this.#_id; }
  set _id(_id: string) { this.#_id = _id; }
  get artistName() { return this.#artistName; }
  set artistName(artistName: string) { this.#artistName = artistName; }
  get bornYear() { return this.#bornYear; }
  set bornYear(bornYear: number) { this.#bornYear = bornYear; }
  get nation() { return this.#nation; }
  set nation(nation: string) { this.#nation = nation; }
  get gender() { return this.#gender; }
  set gender(gender: string) { this.#gender = gender; }
  get bands() { return this.#bands; }
  set bands(bands: [string]) { this.#bands = bands; }
  get firstSong() { return this.#firstSong; }
  set firstSong(firstSong: string) { this.#firstSong = firstSong; }

  constructor(
    _id:string,
    artistName:string,
    bornYear:number,
    nation:string,
    gender:string,
    bands:[string],
    firstSong:string
  ){
      this.#_id = _id;
      this.#artistName = artistName;
      this.#bornYear = bornYear;
      this.#nation = nation;
      this.#gender = gender;
      this.#bands = bands;
      this.#firstSong = firstSong;
  }
}

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  constructor(private _artistsService:ArtistsDataService) { }

  ngOnInit(): void {
    this._artistsService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

}
