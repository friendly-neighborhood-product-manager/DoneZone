export const doneZoneConfig = {
  supabaseUrl: "",
  supabaseAnonKey: "",
};

export function isSupabaseConfigured() {
  return Boolean(doneZoneConfig.supabaseUrl && doneZoneConfig.supabaseAnonKey);
}
