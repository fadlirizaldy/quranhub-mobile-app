export interface Ayat {
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  ayat?: Ayat[];
}

export interface TafsirItem {
  ayat: number;
  teks: string;
}

export interface TafsirData {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  keterangan: string;
  tafsir: TafsirItem[];
}

export interface Doa {
  id: number;
  doa: string;
  arab: string;
  latin: string;
  artinya: string;
}

export interface BookmarkedVerse {
  surahId: number;
  surahName: string;
  surahLatin: string;
  ayatNumber: number;
  ayatAr: string;
  ayatIdn: string;
  bookmarkedAt: string;
}

export type Tab = "quran" | "shalat" | "dua" | "bookmark";

export type Screen =
  | { tab: "quran"; view: "list" }
  | { tab: "quran"; view: "detail"; surahId: number }
  | { tab: "quran"; view: "tafsir"; surahId: number }
  | { tab: "shalat"; view: "main" }
  | { tab: "dua"; view: "list" }
  | { tab: "dua"; view: "detail"; doaId: number }
  | { tab: "bookmark"; view: "main" };
