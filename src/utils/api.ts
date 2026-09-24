import { Doa, Surah, TafsirData } from "./types";

const QURAN_BASE_V2 = "https://equran.id/api/v2";
const QURAN_BASE = "https://equran.id/api";

export async function getAllSurah(): Promise<Surah[]> {
  const r = await fetch(`${QURAN_BASE_V2}/surat`);
  if (!r.ok) throw new Error("Failed to fetch surahs");
  const json = await r.json();
  return json.data;
}

export async function getDetailSurah(id: number): Promise<Surah> {
  const r = await fetch(`${QURAN_BASE_V2}/surat/${id}`);
  if (!r.ok) throw new Error("Failed to fetch surah");
  const json = await r.json();
  return json.data;
}

export async function getDetailTafsir(id: number): Promise<TafsirData> {
  const r = await fetch(`${QURAN_BASE_V2}/tafsir/${id}`);
  if (!r.ok) throw new Error("Failed to fetch tafsir");
  const json = await r.json();
  return json.data;
}

export async function getShalatSchedule(
  lat: number,
  lng: number,
): Promise<Record<string, string>> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const r = await fetch("https://quranhub.web.id/api/v2/shalat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, date: today }),
    });
    if (!r.ok) throw new Error("quranhub unavailable");
    const d = await r.json();
    return d.jadwal || d.timings || d;
  } catch {
    const r = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`,
    );
    if (!r.ok) throw new Error("Failed to fetch prayer schedule");
    const d = await r.json();
    return d.data.timings;
  }
}

export async function getLocationName(
  lat: number,
  lng: number,
): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );
    const d = await r.json();
    return (
      d.address?.city || d.address?.town || d.address?.county || "Lokasi Anda"
    );
  } catch {
    return "Lokasi Anda";
  }
}

export async function getAllDoa(): Promise<Doa[]> {
  const r = await fetch(`${QURAN_BASE}/doa`);

  const json = await r.json();
  if (json.status !== "success") throw new Error("Failed to fetch doa");
  return json.data;
}

export async function getDetailDoa(id: number): Promise<Doa> {
  const r = await fetch(`${QURAN_BASE}/doa/${id}`);
  const json = await r.json();
  if (json.status !== "success") throw new Error("Failed to fetch detail doa");
  return json.data;
}
