import { Component, OnInit } from '@angular/core';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../artists/artists.component';

export class Filter {
  #offset!:number;
  #count!: number;
  #search!: string;
  #latitude!: string;
  #longitude!: string;
  #minDist!:string;
  #maxDist!:string;

  constructor(offset:number, count:number, search:string, latitude:string, longitude:string, minDist:string, maxDist:string){
    this.#offset = offset;
    this.#count = count;
    this.#search = search;
    this.#latitude = latitude;
    this.#longitude = longitude;
    this.#minDist = minDist;
    this.#maxDist = maxDist;
  }

  toQueryString(){
    let query = this.#offset ? `offset=${this.#offset}` : '';
    query = this.#count ? (query ? `${query}&` : '') + `count=${this.#count}` : query; 

    query = this.#search ? (query ? `${query}&` : '') + `search=${this.#search}` : query; 
    query = this.#latitude ? (query ? `${query}&` : '') + `latitude=${this.#latitude}` : query; 
    query = this.#longitude ? (query ? `${query}&` : '') + `longitude=${this.#longitude}` : query; 
    query = this.#minDist ? (query ? `${query}&` : '') + `minDist=${this.#minDist}` : query; 
    query = this.#maxDist ? (query ? `${query}&` : '') + `maxDist=${this.#maxDist}` : query; 

    query = query ? ("?" + query) : '';
    return query;
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  pageSize!:number;
  pageNumber: number = 1;

  searchName!: string;
  searchLatitude!: string;
  searchLongitude!: string;
  minDistance!:string;
  maxDistance!:string;

  artists:Artist[] = [];

  constructor(private _artistsService:ArtistsDataService) { }

  ngOnInit(): void {
    this._fetchArtists();
  }

  _fetchArtists(){
    if(this.searchName || (this.searchLatitude && this.searchLongitude)){
      const filter = new Filter(0,0,this.searchName,this.searchLatitude,this.searchLongitude,this.minDistance,this.maxDistance);
      this._artistsService.getArtists(filter).subscribe(artists => {
        this.artists = artists;
      });
    }
  }

  onDelete(artistId:string){
    this._artistsService.deleteArtist(artistId).subscribe(() => {
      this._fetchArtists();
    })
  }

  onKeyEnter(){
    this._fetchArtists();
  }
}
