import { Song } from "./song";

export class Artist {
    #_id!:string;
    #artistName!:string;
    #bornYear!:string;
    #nation!:string;
    #gender!:string;
    #bands!:string;
    #firstSong!:string;
    #coordinates!:number[];
    songs!:Song[];
  
    get _id() { return this.#_id; }
    set _id(_id: string) { this.#_id = _id; }
    get artistName() { return this.#artistName; }
    set artistName(artistName: string) { this.#artistName = artistName; }
    get bornYear() { return this.#bornYear; }
    set bornYear(bornYear: string) { this.#bornYear = bornYear; }
    get nation() { return this.#nation; }
    set nation(nation: string) { this.#nation = nation; }
    get gender() { return this.#gender; }
    set gender(gender: string) { this.#gender = gender; }
    get bands() { return this.#bands; }
    set bands(bands: string) { this.#bands = bands; }
    get firstSong() { return this.#firstSong; }
    set firstSong(firstSong: string) { this.#firstSong = firstSong; }
    get coordinates() { return this.#coordinates; }
    set coordinates(coordinates: number[]) { this.#coordinates = coordinates; }
  
    constructor(
      id: string,
      artistName:string,
      bornYear:string,
      nation:string,
      gender:string,
      bands:string,
      firstSong:string,
      coordinates:number[]
    ){
        this.#_id = id;
        this.#artistName = artistName;
        this.#bornYear = bornYear;
        this.#nation = nation;
        this.#gender = gender;
        this.#bands = bands;
        this.#firstSong = firstSong;
        this.#coordinates = coordinates;
    }
  
    ToJson(){
      return {
        artistName: this.#artistName ? this.#artistName : null,
        bornYear: this.#bornYear ? this.#bornYear : null,
        nation: this.#nation ? this.#nation : null,
        gender: this.#gender ? this.#gender : null,
        bands: this.#bands ? this.#bands : null,
        firstSong: this.#firstSong ? this.#firstSong : null,
        coordinates: this.#coordinates ? this.#coordinates : null
      }
    }
  }
  