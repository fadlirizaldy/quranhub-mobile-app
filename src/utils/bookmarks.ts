import AsyncStorage from "@react-native-async-storage/async-storage";

import { BookmarkedVerse } from "@/utils/types";

const BOOKMARKS_KEY = "quran-bookmarks-v1";

export async function getBookmarks(): Promise<BookmarkedVerse[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as BookmarkedVerse[]) : [];
  } catch (error) {
    console.warn("Failed to load bookmarks:", error);
    return [];
  }
}

export async function saveBookmarks(bookmarks: BookmarkedVerse[]) {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.warn("Failed to save bookmarks:", error);
  }
}
