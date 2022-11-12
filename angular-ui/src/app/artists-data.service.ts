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

  public getTotalCount(): Observable<number> {
    const url = this._baseUrl + '/artists/totalcount';
    return this._http.get<number>(url);
  }

  public getArtists(pageNr:number, pageSize:number): Observable<Artist[]> {
    const offset = (pageNr && pageSize ? ('offset=' + ((pageNr - 1) * pageSize) + '&') : '');
    const count = (pageSize ? ('count=' + pageSize): '');
    let queryString = offset + count;
    queryString = queryString ? ("?" + queryString) : '';
 
    const url = this._baseUrl + '/artists' + queryString;
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

  public updateArtist(artist: Artist): Observable<void>{
    const url = this._baseUrl + "/artists/" + artist._id;
    return this._http.put<void>(url, artist.ToJson());
  }

  public deleteArtist(artistId: String): Observable<void>{
    const url = this._baseUrl + "/artists/" + artistId;
    return this._http.delete<void>(url);
  }
}
