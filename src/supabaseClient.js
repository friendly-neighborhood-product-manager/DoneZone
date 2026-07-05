export const doneZoneConfig = {
  supabaseUrl: "https://phemaiswganfskmhjvkf.supabase.co",
  supabaseAnonKey: "sb_publishable_NLobabFzOOdEHa4YOvFyZg_BSYWcNv0",
};

export function isSupabaseConfigured() {
  return Boolean(doneZoneConfig.supabaseUrl && doneZoneConfig.supabaseAnonKey);
}
