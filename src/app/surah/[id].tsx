import { colors } from "@/themes";
import { getDetailSurah } from "@/utils/api";
import { getBookmarks, saveBookmarks } from "@/utils/bookmarks";
import { Ayat, BookmarkedVerse, Surah } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

export default function SurahDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = Number(id);
  const insets = useSafeAreaInsets();

  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  // const audioRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!surahId) return;

    let isMounted = true;

    setLoading(true);
    setError("");
    setSurah(null);
    setPlaying(false);

    getBookmarks().then((stored) => {
      if (isMounted) setBookmarks(stored);
    });

    getDetailSurah(surahId)
      .then((data) => {
        if (isMounted) setSurah(data);
      })
      .catch(() => {
        if (isMounted) setError("Gagal memuat surah");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surahId]);

  // async function toggleAudio() {
  //   if (!surah?.audio) return;

  //   try {
  //     if (!audioRef.current) {
  //       const { sound } = await Audio.Sound.createAsync(
  //         { uri: surah.audio },
  //         { shouldPlay: true },
  //       );

  //       audioRef.current = sound;
  //       sound.setOnPlaybackStatusUpdate((status) => {
  //         if ("isLoaded" in status && status.isLoaded) {
  //           setPlaying(status.isPlaying);
  //         }
  //         if ("didJustFinish" in status && status.didJustFinish) {
  //           setPlaying(false);
  //         }
  //       });
  //       setPlaying(true);
  //       return;
  //     }

  //     const status = await audioRef.current.getStatusAsync();
  //     if (status.isLoaded && status.isPlaying) {
  //       await audioRef.current.pauseAsync();
  //       setPlaying(false);
  //     } else {
  //       await audioRef.current.playAsync();
  //       setPlaying(true);
  //     }
  //   } catch (error) {
  //     console.error("Audio toggle error:", error);
  //     setPlaying(false);
  //   }
  // }

  function isBookmarked(ayatNumber: number) {
    return bookmarks.some(
      (b: BookmarkedVerse) =>
        b.surahId === surahId && b.ayatNumber === ayatNumber,
    );
  }

  function handleBookmark(nomor: number) {
    if (!surah) return;
    const ayat = surah.ayat?.find((a: Ayat) => a.nomorAyat === nomor);
    if (!ayat) return;

    setBookmarks((prev: BookmarkedVerse[]) => {
      const exists = prev.some(
        (b: BookmarkedVerse) =>
          b.surahId === surah.nomor && b.ayatNumber === nomor,
      );

      const next = exists
        ? prev.filter(
            (b: BookmarkedVerse) =>
              !(b.surahId === surah.nomor && b.ayatNumber === nomor),
          )
        : [
            ...prev,
            {
              surahId: surah.nomor,
              surahName: surah.nama,
              surahLatin: surah.namaLatin,
              ayatNumber: nomor,
              ayatAr: ayat.teksArab,
              ayatIdn: ayat.teksIndonesia,
              bookmarkedAt: new Date().toISOString(),
            },
          ];

      saveBookmarks(next);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorPrimary, colors.colorTxtGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 12, 40) }]}
      >
        {/* Circle decoration */}
        <View style={styles.circleDecoration} />

        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M19 12H5M12 19l-7-7 7-7" />
            </Svg>
          </TouchableOpacity>

          {/* Title and Meta */}
          {surah && (
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{surah.namaLatin}</Text>
              <Text style={styles.headerMeta}>
                {surah.tempatTurun} · {surah.jumlahAyat} Ayat
              </Text>
            </View>
          )}

          {loading && <View style={styles.headerInfo} />}

          {/* Arabic Name */}
          {surah && <Text style={styles.headerArabic}>{surah.nama}</Text>}
        </View>

        {/* Header Action Buttons */}
        {surah && (
          <View style={styles.actionButtonsRow}>
            {/* Audio Button */}
            <TouchableOpacity
              // onPress={toggleAudio}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              {playing ? (
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Rect x="6" y="4" width="4" height="16" rx="1" />
                  <Rect x="14" y="4" width="4" height="16" rx="1" />
                </Svg>
              ) : (
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Polygon points="5 3 19 12 5 21 5 3" />
                </Svg>
              )}
              <Text style={styles.actionButtonText}>
                {playing ? "Jeda Audio" : "Putar Audio"}
              </Text>
            </TouchableOpacity>

            {/* Tafsir Button */}
            <TouchableOpacity
              onPress={() => router.push(`/tafsir/${surahId}`)}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Circle cx="12" cy="12" r="10" />
                <Line x1="12" y1="8" x2="12" y2="12" />
                <Line x1="12" y1="16" x2="12.01" y2="16" />
              </Svg>
              <Text style={styles.actionButtonText}>Tafsir</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 80, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.colorPrimary} />
          </View>
        )}

        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {surah && (
          <>
            {/* Bismillah */}
            {surah.nomor !== 9 && (
              <View style={styles.bismillahCard}>
                <Text style={styles.bismillahText}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>
              </View>
            )}

            {/* Ayat list */}
            <View style={styles.ayatList}>
              {(surah.ayat || []).map((ayat: Ayat) => {
                const bookmarked = isBookmarked(ayat.nomorAyat);
                return (
                  <View key={ayat.nomorAyat} style={styles.ayatCard}>
                    {/* Ayat Header */}
                    <View style={styles.ayatHeader}>
                      <View style={styles.ayatBadge}>
                        <Text style={styles.ayatBadgeText}>
                          {ayat.nomorAyat}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleBookmark(ayat.nomorAyat)}
                        activeOpacity={0.7}
                        style={styles.bookmarkButton}
                      >
                        <Svg
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill={bookmarked ? colors.colorPrimary : "none"}
                          stroke={bookmarked ? colors.colorPrimary : "#828282"}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </Svg>
                      </TouchableOpacity>
                    </View>

                    {/* Arabic text */}
                    <Text style={styles.ayatArabic}>{ayat.teksArab}</Text>

                    {/* Transliteration */}
                    <Text style={styles.ayatLatin}>{ayat.teksLatin}</Text>

                    {/* Translation */}
                    <Text style={styles.ayatIndo}>{ayat.teksIndonesia}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Prev / Next Bottom Navigation */}
      {surah && (
        <View
          style={[
            styles.bottomNavContainer,
            { bottom: Math.max(insets.bottom + 8, 16) },
          ]}
        >
          <View style={styles.bottomNavRow}>
            {surah.nomor > 1 && (
              <TouchableOpacity
                onPress={() => router.replace(`/surah/${surah.nomor - 1}`)}
                activeOpacity={0.8}
                style={styles.navPrevButton}
              >
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.colorPrimary}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M19 12H5M12 19l-7-7 7-7" />
                </Svg>
                <Text style={styles.navPrevText}>Surah Sebelumnya</Text>
              </TouchableOpacity>
            )}

            {surah.nomor < 114 && (
              <TouchableOpacity
                onPress={() => router.replace(`/surah/${surah.nomor + 1}`)}
                activeOpacity={0.8}
                style={styles.navNextButtonWrapper}
              >
                <LinearGradient
                  colors={[colors.colorPrimary, colors.colorTxtGreen]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.navNextButton}
                >
                  <Text style={styles.navNextText}>Surah Berikutnya</Text>
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M5 12h14M12 5l7 7-7 7" />
                  </Svg>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  circleDecoration: {
    position: "absolute",
    top: -24,
    right: -24,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.colorTertiary,
    opacity: 0.2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "NunitoBold",
    lineHeight: 22,
  },
  headerMeta: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: "NunitoSemiBold",
    textTransform: "capitalize",
    marginTop: 2,
  },
  headerArabic: {
    fontFamily: "Amiri",
    fontSize: 24,
    color: "#FFFFFF",
  },
  actionButtonsRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NunitoSemiBold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  scrollContent: {
    paddingTop: 4,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Nunito",
    textAlign: "center",
  },
  bismillahCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bismillahText: {
    fontFamily: "Amiri",
    fontSize: 24,
    color: "#1F2937",
    textAlign: "center",
  },
  ayatList: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  ayatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ayatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ayatBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  ayatBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#FFFFFF",
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ayatArabic: {
    fontFamily: "Amiri",
    fontSize: 24,
    color: "#1F2937",
    lineHeight: 46,
    textAlign: "right",
    marginBottom: 12,
  },
  ayatLatin: {
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "Nunito",
    color: "#9CA3AF",
    marginBottom: 8,
    lineHeight: 18,
  },
  ayatIndo: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#4B5563",
    lineHeight: 22,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  bottomNavContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  bottomNavRow: {
    flexDirection: "row",
    gap: 12,
  },
  navPrevButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.colorPrimary,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  navPrevText: {
    fontWeight: "700",
    fontFamily: "NunitoBold",
    fontSize: 14,
    color: colors.colorPrimary,
  },
  navNextButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  navNextButton: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navNextText: {
    fontWeight: "700",
    fontFamily: "NunitoBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
