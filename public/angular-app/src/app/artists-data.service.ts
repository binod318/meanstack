import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UrlConfig } from 'src/config/url-config';
import { Artist } from './models/artist';
import { Filter } from './models/filter';

@Injectable({
  providedIn: 'root'
})
export class ArtistsDataService {

  constructor(private _http:HttpClient) { }

  public getTotalCount(): Observable<number> {
    const url = UrlConfig.totalCountUrl;
    return this._http.get<number>(url);
  }

  public getArtists(filter:Filter): Observable<Artist[]> {
    const url = UrlConfig.artistsUrl + filter.toQueryString();
    return this._http.get<Artist[]>(url);
  }

  public getArtist(artistId: string): Observable<Artist>{
    const url = UrlConfig.artistsUrl + artistId;
    return this._http.get<Artist>(url);
  }

  public addArtist(artist: Artist): Observable<Artist>{
    const url = UrlConfig.artistsUrl;
    return this._http.post<Artist>(url, artist.ToJson());
  }

  public updateArtist(artist: Artist): Observable<void>{
    const url = UrlConfig.artistsUrl + artist._id;
    return this._http.put<void>(url, artist.ToJson());
  }

  public partialUpdateArtist(artist: Artist): Observable<void>{
    const url = UrlConfig.artistsUrl + artist._id;
    return this._http.patch<void>(url, artist.ToJson());
  }

  public deleteArtist(artistId: String): Observable<void>{
    const url = UrlConfig.artistsUrl + artistId;
    return this._http.delete<void>(url);
  }
}
