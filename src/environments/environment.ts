// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { createClient } from "@supabase/supabase-js";

export const environment = {
  production: false,
  api_url: "https://zkfhrkmxpowygtruytmr.supabase.co/rest/v1/",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmhya214cG93eWd0cnV5dG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMzMwMzEsImV4cCI6MjA0MjcwOTAzMX0.0-0VWZno6ggciL5u5aK-mHllB5bDueaHGCZXtosTX9k",
  supabase: createClient("https://zkfhrkmxpowygtruytmr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmhya214cG93eWd0cnV5dG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMzMwMzEsImV4cCI6MjA0MjcwOTAzMX0.0-0VWZno6ggciL5u5aK-mHllB5bDueaHGCZXtosTX9k"),
  storage_url: "https://zkfhrkmxpowygtruytmr.supabase.co/storage/v1/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
