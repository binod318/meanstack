import { environment } from "src/environments/environment";

const base_url = environment.artists_service_base_url;

export class UrlConfig {

    public static artistsUrl:string = base_url + "/artists/";
    public static totalCountUrl:string = base_url + '/artists/totalcount';

    public static songSubUrl = "/songs/";

    public static usersUrl:string = base_url + '/users/';
    public static loginUrl:string = base_url + '/users/login';

}