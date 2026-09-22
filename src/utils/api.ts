import { Doa, Surah, TafsirData } from "./types";

const QURAN_BASE = "https://equran.id/api";

export async function getAllSurah(): Promise<Surah[]> {
  const r = await fetch(`${QURAN_BASE}/surat`);
  if (!r.ok) throw new Error("Failed to fetch surahs");
  return r.json();
}

export async function getDetailSurah(id: number): Promise<Surah> {
  const r = await fetch(`${QURAN_BASE}/surat/${id}`);
  if (!r.ok) throw new Error("Failed to fetch surah");
  return r.json();
}

export async function getDetailTafsir(id: number): Promise<TafsirData> {
  const r = await fetch(`${QURAN_BASE}/tafsir/${id}`);
  if (!r.ok) throw new Error("Failed to fetch tafsir");
  return r.json();
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
  try {
    const r = await fetch("https://quranhub.web.id/api/doa");
    if (!r.ok) throw new Error();
    const d = await r.json();
    const list = Array.isArray(d) ? d : d.data || [];
    return list.map((item: Record<string, string | number>) => ({
      id: item.id as number,
      doa: (item.doa || item.nama || "") as string,
      arab: (item.arab || item.ayat || "") as string,
      latin: (item.latin || "") as string,
      artinya: (item.artinya || "") as string,
    }));
  } catch {
    const r = await fetch("https://api.myquran.com/v2/doa/semua");
    if (!r.ok) throw new Error("Failed to fetch doa");
    const d = await r.json();
    return (d.data || []).map((item: Record<string, string | number>) => ({
      id: item.id as number,
      doa: (item.doa || "") as string,
      arab: (item.arab || item.ayat || "") as string,
      latin: (item.latin || "") as string,
      artinya: (item.artinya || "") as string,
    }));
  }
}

export async function getDetailDoa(id: number): Promise<Doa> {
  try {
    const r = await fetch(`https://quranhub.web.id/api/doa/${id}`);
    if (!r.ok) throw new Error();
    const d = await r.json();
    const item = Array.isArray(d) ? d[0] : d.data?.[0] || d;
    return {
      id: item.id,
      doa: item.doa || item.nama || "",
      arab: item.arab || item.ayat || "",
      latin: item.latin || "",
      artinya: item.artinya || "",
    };
  } catch {
    const r = await fetch(`https://api.myquran.com/v2/doa/${id}`);
    if (!r.ok) throw new Error("Failed to fetch doa detail");
    const d = await r.json();
    const item = d.data?.[0] || d.data || {};
    return {
      id: item.id || id,
      doa: item.doa || "",
      arab: item.arab || item.ayat || "",
      latin: item.latin || "",
      artinya: item.artinya || "",
    };
  }
}
