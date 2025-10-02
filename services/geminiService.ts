import type { CampaignType, GeneratedVariants, Tone, Persona } from "../types";

// Thin client: delegates secure model interaction to backend API so the API key stays server-side.
export async function generateCampaignCopy(
  prompt: string,
  campaignType: CampaignType,
  tone: Tone,
  persona: Persona
): Promise<GeneratedVariants> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, campaignType, tone, persona })
  });
  if (!res.ok) {
    let message = `Server error (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return await res.json() as GeneratedVariants;
}