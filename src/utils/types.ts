export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  audioFull: Record<string, string>;
  ayat?: Ayat[];
}

export interface TafsirItem {
  ayat: number;
  teks: string;
}

export interface TafsirData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  keterangan: string;
  tafsir: TafsirItem[];
}

export interface Doa {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
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
