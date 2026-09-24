import { colors } from "@/themes";
import { getDetailDoa } from "@/utils/api";
import { Doa } from "@/utils/types";
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
import Svg, { Path } from "react-native-svg";

export default function DoaDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doaId = Number(id);
  const insets = useSafeAreaInsets();

  const [doa, setDoa] = useState<Doa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doaId) return;

    setLoading(true);
    setError("");
    getDetailDoa(doaId)
      .then(setDoa)
      .catch(() => setError("Gagal memuat doa"))
      .finally(() => setLoading(false));
  }, [doaId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorSecondary, colors.colorPrimary]}
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
            <Text style={styles.headerTitle} numberOfLines={1}>
              {doa?.nama || "Detail Doa"}
            </Text>
            <Text style={styles.headerMeta}>Doa Harian</Text>
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
            <ActivityIndicator size="large" color={colors.colorSecondary} />
          </View>
        )}

        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {doa && (
          <View style={styles.contentList}>
            {/* Arabic Section */}
            <View style={styles.card}>
              <Text
                style={[styles.sectionLabel, { color: colors.colorPrimary }]}
              >
                ARAB
              </Text>
              <Text style={styles.arabicText}>{doa.ar || doa.nama}</Text>
            </View>

            {/* Latin Section */}
            {doa.tr ? (
              <View style={styles.card}>
                <Text
                  style={[styles.sectionLabel, { color: colors.colorTxtGreen }]}
                >
                  LATIN
                </Text>
                <Text style={styles.latinText}>{doa.tr}</Text>
              </View>
            ) : null}

            {/* Translation Section */}
            {doa.idn ? (
              <View style={styles.card}>
                <Text
                  style={[styles.sectionLabel, { color: colors.colorSecText }]}
                >
                  ARTINYA
                </Text>
                <Text style={styles.artinyaText}>{doa.idn}</Text>
              </View>
            ) : null}
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
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  arabicText: {
    fontFamily: "Amiri",
    fontSize: 24,
    color: "#1F2937",
    lineHeight: 46,
    textAlign: "right",
  },
  latinText: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontStyle: "italic",
    color: "#4B5563",
    lineHeight: 22,
  },
  artinyaText: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#4B5563",
    lineHeight: 22,
  },
});
