// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: "Should be true for production environment and false for other environments",
  artists_service_base_url: "BASE url for artists service",
  app_title: "angular-ui",
  artist_id: "this is a query param variable name for artistId",
  auth_header: "Header key for token",
  token_key: "key name in the localstorage of the browser",
  defaultPageSize: 0, //"this is the default size of the pageSize",

  welcome_message: "This is the welcome message on the home page",
  copyright_message: "Copyright message at the footer",

  //properties with label at the end represents the label value visible to user, 
  //which can be changed to any other language if we want to change the language of our applicaiton
  greeting_label: "Label for Greeting. Examle: hello",
  login_label: "Login label: this can be changed to view your application on different language",
  logout_label: "Logout label",
  username_label: "Username",
  password_label: "Password",
  confirm_label: "Confirm",

  home_label: "Home",
  profile_label: "Profile",

  add_label: "Add",
  update_label: "Update",
  next_label: "Next",
  previous_label: "Previous",
  ok_label: "Ok",
  edit_label: "Edit",
  cancel_label: "Cancel",
  delete_label: "Delete",
  register_label: "Register",
  reset_label: "Reset",

  name_label: "Name",
  bornYear_label: "Born year",
  gender_label: "Gender",
  nation_label: "Nation",
  firstSong_label: "First song",
  bands_label: "Bands",

  page_label: "Page",
  artist_label: "artist",
  artists_label: "Artists",
  display_total_label: "Displaying total",
  records_label: "records",
  of_label: "of",

  list_label: "list",

  search_label: "Search",
  latitude_label: "Latitude",
  longitude_label: "Longitude",
  minimum_label: "Minimum",
  maximum_label: "Maximum",
  distance_label: "Distance",
  geoSearch_label: "Geo Search",
  by_label: "by",
  for_label: "for",

  artist_add_success_message: "This message will be displayed when an artist is added successfully",
  artist_add_fail_message: "This message will be displayed when there is error while adding artist",
  artist_update_success_message: "This message will be displayed when an artist is updated successfully",
  artist_update_fail_message: "This message will be displayed when there is an error updating the artist",
  artist_delete_success_message: "This message will be displayed when an artist is deleted successfully",
  artist_delete_fail_message: "This message will be displayed when there is error while deleting artist",
  user_register_success_message: "This message will be displayed when an user is registered successfully",
  user_register_fail_message: "This message will be displayed when there is error while registering user",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
