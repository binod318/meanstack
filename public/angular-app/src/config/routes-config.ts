import { environment } from "src/environments/environment";

export class RoutesConfig {
    public static homeRoute:string = "";
    public static artistsRoute:string = "artists";
    public static searchRoute:string = "search";
    public static registerRoute:string = "register";
    public static profileRoute:string = "profile";
    public static artistDetailRoute:string = "artist/";
    public static addArtistRoute:string = RoutesConfig.artistsRoute + "/add";
    public static editArtistRoute:string = RoutesConfig.artistsRoute + "/edit/";
    public static loginRoute:string = "login";
    public static errorRoute:string = "**";

    public static artistDetailPath:string = RoutesConfig.artistDetailRoute + ":" + environment.artist_id;
    public static editArtistPath:string = RoutesConfig.editArtistRoute + ":" + environment.artist_id;

    public static songRoute = "songs/";
    public static addSongRoute = RoutesConfig.artistsRoute + "/:" + environment.artist_id + "/" + RoutesConfig.songRoute + "add";
    public static editSongRoute = RoutesConfig.artistsRoute + "/:" + environment.artist_id + "/" + RoutesConfig.songRoute + "edit/" + ":" + environment.song_id;

    public static addSongPath:string = RoutesConfig.songRoute + "add";
    public static editSongPath:string = RoutesConfig.songRoute + "edit/";
}