import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistsDataService } from '../artists-data.service';
import { Artist } from '../artists/artists.component';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist!: Artist;
  constructor(private _artistsService:ArtistsDataService, private _route:ActivatedRoute) { }

  ngOnInit(): void {
    const artistId = this._route.snapshot.params['artistId'];
    this._artistsService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
    })
  }

}
