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
    artistName:string,
    bornYear:number,
    nation:string,
    gender:string,
    bands:[string],
    firstSong:string
  ){
      this.#artistName = artistName;
      this.#bornYear = bornYear;
      this.#nation = nation;
      this.#gender = gender;
      this.#bands = bands;
      this.#firstSong = firstSong;
  }

  ToJson(){
    return {
      artistName: this.#artistName,
      bornYear: this.#bornYear,
      nation: this.#nation,
      gender: this.#gender,
      bands: this.#bands,
      firstSong: this.#firstSong
    }
  }
}

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  total!:number;
  countList: number[] = [];
  pageSize!:number;
  pageNumber: number = 1;
  disableNext: boolean = true;

  constructor(private _artistsService:ArtistsDataService) { }

  ngOnInit(): void {
    this._fetchTotalCount();
    this._fetchArtists();
  }

  onDelete(artistId:String){
    this._artistsService.deleteArtist(artistId).subscribe(() => {
      this._fetchArtists();
    })
  }

  _fetchTotalCount(){
    this._artistsService.getTotalCount().subscribe(total => {
      this.total = total;

      for(let i = 0; i< total; i++){
        this.countList.push(i+1);
      }
    });
  }

  _fetchArtists(){
    this._artistsService.getArtists(this.pageNumber, this.pageSize).subscribe(artists => {
      this.artists = artists;
    });
  }

  onPageSizeChange(size: number){
    this.pageSize = size;
    this.pageNumber = 1;
    this._fetchArtists();
    this.toggleNextBtn();
  }

  onPrevious(){
    this.pageNumber --;
    this.toggleNextBtn();
    this._fetchArtists();
  }

  onNext(){
    this.pageNumber ++;
    this.toggleNextBtn();
    this._fetchArtists();
  }

  toggleNextBtn(){
    console.log(this.pageNumber , Math.ceil(this.total / this.pageSize));
    
    if(this.pageNumber < Math.ceil(this.total / this.pageSize)){
      this.disableNext = false;
    } else {
      this.disableNext = true;
    }
  }
}
