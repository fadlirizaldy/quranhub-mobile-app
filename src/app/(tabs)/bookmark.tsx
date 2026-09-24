import { colors } from "@/themes";
import { getBookmarks, saveBookmarks } from "@/utils/bookmarks";
import { BookmarkedVerse } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Line, Path } from "react-native-svg";

export default function BookmarkScreen() {
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);

  useEffect(() => {
    let mounted = true;

    getBookmarks().then((stored) => {
      if (mounted) setBookmarks(stored);
    });

    return () => {
      mounted = false;
    };
  }, []);

  function handleRemove(surahId: number, ayatNumber: number) {
    setBookmarks((prev: BookmarkedVerse[]) => {
      const next = prev.filter(
        (b: BookmarkedVerse) =>
          !(b.surahId === surahId && b.ayatNumber === ayatNumber),
      );
      saveBookmarks(next);
      return next;
    });
  }

  function handleGoToSurah(surahId: number) {
    router.push(`/surah/${surahId}`);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorPrimary, colors.colorSecText]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}
      >
        {/* Circle decoration */}
        <View style={styles.circleDecoration} />

        <Text style={styles.headerTitle}>Bookmark</Text>
        <Text style={styles.headerSubtitle}>
          {bookmarks.length} ayat tersimpan
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          bookmarks.length === 0 && styles.emptyScrollContent,
          { paddingBottom: Math.max(insets.bottom + 80, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {bookmarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBadge}>
              <Svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.colorPrimary}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Bookmark</Text>
            <Text style={styles.emptySubtitle}>
              Tandai ayat favorit Anda dengan ikon bookmark saat membaca
              Al-Quran.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {bookmarks.map((b: BookmarkedVerse) => (
              <View key={`${b.surahId}-${b.ayatNumber}`} style={styles.card}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <TouchableOpacity
                    onPress={() => handleGoToSurah(b.surahId)}
                    activeOpacity={0.7}
                    style={styles.surahInfoButton}
                  >
                    <View style={styles.surahBadge}>
                      <Text style={styles.surahBadgeText}>{b.surahId}</Text>
                    </View>
                    <Text style={styles.surahTitleText}>
                      {b.surahLatin} · Ayat {b.ayatNumber}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemove(b.surahId, b.ayatNumber)}
                    activeOpacity={0.7}
                    style={styles.removeButton}
                  >
                    <Svg
                      width={13}
                      height={13}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Line x1="18" y1="6" x2="6" y2="18" />
                      <Line x1="6" y1="6" x2="18" y2="18" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <Text style={styles.ayatArabic}>{b.ayatAr}</Text>
                  <Text style={styles.ayatIndo}>{b.ayatIdn}</Text>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.dateText}>
                    Disimpan{" "}
                    {new Date(b.bookmarkedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  circleDecoration: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: colors.colorSecondary,
    opacity: 0.2,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "NunitoBold",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: "NunitoSemiBold",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  scrollContent: {
    paddingTop: 16,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00CBBF22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#374151",
    marginBottom: 4,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    backgroundColor: "#00CBBF11",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  surahInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  surahBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  surahBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#FFFFFF",
  },
  surahTitleText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: colors.colorPrimary,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ayatArabic: {
    fontFamily: "Amiri",
    fontSize: 20,
    color: "#1F2937",
    lineHeight: 40,
    textAlign: "right",
    marginBottom: 8,
  },
  ayatIndo: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: "#6B7280",
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dateText: {
    fontSize: 10,
    fontFamily: "NunitoSemiBold",
    color: "#D1D5DB",
  },
});
