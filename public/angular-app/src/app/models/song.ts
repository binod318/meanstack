export class Song {
    #_id!:string;
    #title!:string;
    #rank!:string;
    #year!:string;
    #album!:string;
  
    get _id() { return this.#_id; }
    set _id(_id: string) { this.#_id = _id; }
    get title() { return this.#title; }
    set title(title: string) { this.#title = title; }
    get rank() { return this.#rank; }
    set rank(rank: string) { this.#rank = rank; }
    get year() { return this.#year; }
    set year(year: string) { this.#year = year; }
    get album() { return this.#album; }
    set album(album: string) { this.#album = album; }
  
    constructor(
      title:string,
      rank:string,
      year:string,
      album:string
    ){
        this.#title = title;
        this.#rank = rank;
        this.#year = year;
        this.#album = album;
    }
  
    ToJson(){
      return {
        title: this.#title ? this.#title : null,
        rank: this.#rank ? this.#rank : null,
        year: this.#year ? this.#year : null,
        album: this.#album ? this.#album : null,
      }
    }
  }
  