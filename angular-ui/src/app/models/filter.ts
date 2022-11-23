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