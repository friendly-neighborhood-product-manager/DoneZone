import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const doneZoneConfig = {
  supabaseUrl: "https://phemaiswganfskmhjvkf.supabase.co",
  supabaseAnonKey: "sb_publishable_NLobabFzOOdEHa4YOvFyZg_BSYWcNv0",
  productionUrl: "https://friendly-neighborhood-product-manager.github.io/DoneZone/",
};

export const supabase = createClient(
  doneZoneConfig.supabaseUrl,
  doneZoneConfig.supabaseAnonKey,
);

export function isSupabaseConfigured() {
  return Boolean(doneZoneConfig.supabaseUrl && doneZoneConfig.supabaseAnonKey);
}

export function getAuthRedirectTo() {
  return doneZoneConfig.productionUrl;
}
