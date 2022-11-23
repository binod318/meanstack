import { Component, OnInit } from '@angular/core';
import { RoutesConfig } from 'src/config/routes-config';
import { environment } from 'src/environments/environment';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../models/artist';
import { Filter } from '../models/filter';

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

  //labels
  artist_label:string = environment.artist_label;
  name_label:string = environment.name_label;
  search_label:string = environment.search_label;
  by_label:string = environment.by_label;
  for_label:string = environment.for_label;
  latitude_label:string = environment.latitude_label;
  longitude_label:string = environment.longitude_label;
  minimum_label:string = environment.minimum_label;
  maximum_label:string = environment.maximum_label;
  distance_label:string = environment.distance_label;
  geoSearch_label:string = environment.geoSearch_label;

  edit_label:string = environment.edit_label;
  delete_label:string = environment.delete_label;

  editArtistRoute:string = RoutesConfig.editArtistRoute;
  artistDetailRoute:string = RoutesConfig.artistDetailRoute;

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
