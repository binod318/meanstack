import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Artist } from './artists/artists.component';

@Injectable({
  providedIn: 'root'
})
export class ArtistsDataService {

  private _baseUrl = 'http://localhost:3000/api';

  constructor(private _http:HttpClient) { }

  public getArtists(): Observable<Artist[]> {
    const url = this._baseUrl + '/artists';
    return this._http.get<Artist[]>(url);
  }

  public getArtist(artistId: string): Observable<Artist>{
    const url = this._baseUrl + "/artists/" + artistId;
    return this._http.get<Artist>(url);
  }

  public addArtist(artist: Artist): Observable<Artist>{
    const url = this._baseUrl + "/artists";
    return this._http.post<Artist>(url, artist.ToJson());
  }
}
