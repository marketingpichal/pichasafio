import { supabase } from "./supabaseClient";

type Json = Record<string, unknown> | null;

export async function logAdEvent(
  event: string,
  payload: {
    user_id?: string | null;
    provider?: string;
    ad_zone?: string | number;
    required_seconds?: number;
    watched_seconds?: number;
    seconds_seen?: number;
    context?: { day?: number; exerciseName?: string } | null;
  }
) {
  try {
    const { error } = await supabase.from("ad_events").insert({
      event,
      user_id: payload.user_id ?? null,
      provider: payload.provider ?? "juicyads",
      ad_zone: payload.ad_zone?.toString() ?? null,
      required_seconds: payload.required_seconds ?? null,
      watched_seconds: payload.watched_seconds ?? payload.seconds_seen ?? null,
      context: (payload.context as Json) ?? null,
    });
    if (error) throw error;
  } catch {
    // noop
  }
}

// Estimación simple de revenue por impresión usando eCPM configurable
export function estimateRevenuePerImpressionUSD(): number {
  const ecpm = Number(import.meta.env.VITE_AD_ECPM_USD ?? 0.5); // valor por defecto
  return isFinite(ecpm) && ecpm > 0 ? ecpm / 1000 : 0.0005;
}

export async function trackUserAdImpression(userId?: string | null, provider = "juicyads") {
  try {
    if (!userId) return;
    const estimated = estimateRevenuePerImpressionUSD();
    const { error } = await supabase.rpc("increment_user_ad_stats", {
      p_user_id: userId,
      p_provider: provider,
      p_impressions_inc: 1,
      p_revenue_usd_inc: estimated,
    });
    if (error) {
      // fallback: upsert manual si no existe la función
      await supabase
        .from("ad_user_stats")
        .upsert(
          {
            user_id: userId,
            provider,
            total_impressions: 1,
            total_estimated_revenue_usd: estimated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,provider" }
        ,
        )
        .select();
    }
  } catch {
    // noop
  }
}


