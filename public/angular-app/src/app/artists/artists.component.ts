import { Component, OnInit } from '@angular/core';
import { RoutesConfig } from 'src/config/routes-config';
import { environment } from 'src/environments/environment';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../models/artist';
import { Filter } from '../models/filter';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  total!:number;
  disableNext: boolean = false;

  pageSize:number = environment.defaultPageSize;
  pageNumber: number = 1;
  pageSizeList:number[] = [];

  addArtistRoute:string = RoutesConfig.addArtistRoute;
  editArtistRoute:string = RoutesConfig.editArtistRoute;
  artistDetailRoute:string = RoutesConfig.artistDetailRoute;

  //labels
  addButtonText:string = environment.add_label;
  nextButtonText:string = environment.next_label;
  previousButtonText:string = environment.previous_label;
  artists_label:string = environment.artists_label;
  artist_label:string = environment.artist_label;
  display_total_label:string = environment.display_total_label;
  records_label:string = environment.records_label;
  of_label:string = environment.of_label;
  page_label:string = environment.page_label;
  edit_label:string = environment.edit_label;
  delete_label:string = environment.delete_label;
  list_label:string = environment.list_label;

  constructor(private _artistsService:ArtistsDataService) { }

  ngOnInit(): void {
    this._fetchTotalCount();
    this._fetchArtists();
  }

  onDelete(artistId:string){
    this._artistsService.deleteArtist(artistId).subscribe(() => {
      this._fetchTotalCount()
      this._fetchArtists();
    })
  }

  _fetchTotalCount(){
    this._artistsService.getTotalCount().subscribe(total => {
      this.total = total;

      //create pageSize
      for(let i = 1; i <= Math.ceil(total / this.pageSize); i++){
        this.pageSizeList.push(this.pageSize * i);
      }
    });
  }

  _fetchArtists(){
    const count = this.pageSize;
    const offset = (this.pageNumber - 1) * count;
    const filter = new Filter(offset,count,"","","","","");
    this._artistsService.getArtists(filter).subscribe(artists => {
      this.artists = artists;
      this.toggleNextBtn();
    });
  }

  onPageSizeChange(size: number){
    this.pageSize = size;
    this.pageNumber = 1;
    this._fetchArtists();
  }

  onPrevious(){
    this.pageNumber --;
    this._fetchArtists();
  }

  onNext(){
    this.pageNumber ++;
    this._fetchArtists();
  }

  toggleNextBtn(){
    if(this.pageNumber < Math.ceil(this.total / this.pageSize)){
      this.disableNext = false;
    } else {
      this.disableNext = true;
    }
  }
}
