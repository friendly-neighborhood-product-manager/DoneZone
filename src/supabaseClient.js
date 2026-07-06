export const doneZoneConfig = {
  supabaseUrl: "https://phemaiswganfskmhjvkf.supabase.co",
  supabaseAnonKey: "sb_publishable_NLobabFzOOdEHa4YOvFyZg_BSYWcNv0",
  productionUrl: "https://friendly-neighborhood-product-manager.github.io/DoneZone/",
};

export let supabase = null;
let supabaseLoadError = null;

export async function initSupabaseClient() {
  if (supabase || supabaseLoadError) {
    return { supabase, error: supabaseLoadError };
  }

  try {
    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );
    supabase = createClient(
      doneZoneConfig.supabaseUrl,
      doneZoneConfig.supabaseAnonKey,
    );
  } catch (error) {
    supabaseLoadError = error;
  }

  return { supabase, error: supabaseLoadError };
}

export function isSupabaseConfigured() {
  return Boolean(supabase && doneZoneConfig.supabaseUrl && doneZoneConfig.supabaseAnonKey);
}

export function getAuthRedirectTo() {
  return doneZoneConfig.productionUrl;
}
