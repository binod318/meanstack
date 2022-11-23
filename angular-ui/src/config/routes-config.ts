import { environment } from "src/environments/environment";

export class RoutesConfig {
    public static homeRoute:string = "";
    public static artistsRoute:string = "artists";
    public static searchRoute:string = "search";
    public static registerRoute:string = "register";
    public static profileRoute:string = "profile";
    public static addArtistRoute:string = "artists/add";
    public static editArtistRoute:string = "artists/edit/";
    public static artistDetailRoute:string = "artist/";
    public static loginRoute:string = "login";
    public static errorRoute:string = "**";

    public static artistDetailPath:string = RoutesConfig.artistDetailRoute + ":" + environment.artist_id;
    public static editArtistPath:string = RoutesConfig.editArtistRoute + ":" + environment.artist_id;
}