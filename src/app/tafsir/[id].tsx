import { colors } from "@/themes";
import { getDetailTafsir } from "@/utils/api";
import { TafsirData, TafsirItem } from "@/utils/types";
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
import Svg, { Path, Polyline } from "react-native-svg";

export default function TafsirPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = Number(id);
  const insets = useSafeAreaInsets();

  const [tafsir, setTafsir] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);

  useEffect(() => {
    if (!surahId) return;

    setLoading(true);
    setError("");
    getDetailTafsir(surahId)
      .then(setTafsir)
      .catch(() => setError("Gagal memuat tafsir"))
      .finally(() => setLoading(false));
  }, [surahId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorTxtGreen, colors.colorPrimary]}
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

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Tafsir</Text>
            {tafsir && (
              <Text style={styles.headerMeta}>
                {tafsir.namaLatin} · {tafsir.jumlahAyat} Ayat
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.colorTxtGreen} />
          </View>
        )}

        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {tafsir && (
          <View style={styles.contentList}>
            {/* Keterangan */}
            {tafsir.keterangan ? (
              <View style={styles.keteranganCard}>
                <Text style={styles.keteranganText}>
                  {tafsir.keterangan.replace(/<[^>]*>/g, "")}
                </Text>
              </View>
            ) : null}

            {/* Tafsir Ayat Accordion */}
            {tafsir.tafsir.map((item: TafsirItem) => {
              const isItemExpanded = expanded === item.ayat;

              return (
                <View key={item.ayat} style={styles.accordionCard}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      setExpanded(isItemExpanded ? null : item.ayat)
                    }
                    style={styles.accordionHeader}
                  >
                    <View style={styles.ayatBadge}>
                      <Text style={styles.ayatBadgeText}>{item.ayat}</Text>
                    </View>

                    <Text style={styles.accordionTitle}>
                      Tafsir Ayat {item.ayat}
                    </Text>

                    <View
                      style={[
                        styles.iconContainer,
                        isItemExpanded && styles.iconRotated,
                      ]}
                    >
                      <Svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#828282"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Polyline points="6 9 12 15 18 9" />
                      </Svg>
                    </View>
                  </TouchableOpacity>

                  {isItemExpanded && (
                    <View style={styles.accordionBody}>
                      <Text style={styles.tafsirText}>
                        {item?.teks?.replace(/<[^>]*>/g, "")}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
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
    backgroundColor: colors.colorSecondary,
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
    marginTop: 2,
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
  contentList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  keteranganCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  keteranganText: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: "#6B7280",
    lineHeight: 18,
  },
  accordionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  accordionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  accordionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NunitoSemiBold",
    color: "#374151",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  tafsirText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#4B5563",
    lineHeight: 22,
    paddingTop: 12,
  },
});
