import { createClient } from "@supabase/supabase-js";

export const environment = {
  production: true,
  api_url: "https://zkfhrkmxpowygtruytmr.supabase.co/rest/v1/",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmhya214cG93eWd0cnV5dG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMzMwMzEsImV4cCI6MjA0MjcwOTAzMX0.0-0VWZno6ggciL5u5aK-mHllB5bDueaHGCZXtosTX9k",
  supabase: createClient("https://zkfhrkmxpowygtruytmr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmhya214cG93eWd0cnV5dG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMzMwMzEsImV4cCI6MjA0MjcwOTAzMX0.0-0VWZno6ggciL5u5aK-mHllB5bDueaHGCZXtosTX9k"),
  storage_url: "https://zkfhrkmxpowygtruytmr.supabase.co/storage/v1/"
};
