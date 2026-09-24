import { colors } from "@/themes";
import { getAllDoa } from "@/utils/api";
import { Doa } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path } from "react-native-svg";

export default function DoaScreen() {
  const insets = useSafeAreaInsets();
  const [duas, setDuas] = useState<Doa[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllDoa()
      .then(setDuas)
      .catch(() => setError("Gagal memuat daftar doa"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return duas;

    return duas.filter((d: Doa) => {
      return (
        d.nama.toLowerCase().includes(keyword) ||
        d.tentang.toLowerCase().includes(keyword)
      );
    });
  }, [duas, search]);

  const handleGoToDoa = (doaId: number) => {
    router.push(`/doa/${doaId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorSecondary, colors.colorPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}
      >
        {/* Circle decoration */}
        <View style={styles.circleDecoration} />

        <Text style={styles.headerTitle}>Doa Harian</Text>
        <Text style={styles.headerSubtitle}>
          Kumpulan doa dalam kehidupan sehari-hari
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={styles.searchIcon}
          >
            <Circle cx="11" cy="11" r="8" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari doa..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
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
            <ActivityIndicator size="large" color={colors.colorSecondary} />
          </View>
        )}

        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!loading && !error && (
          <View style={styles.listContainer}>
            {(filtered ?? [])?.map((doa: Doa, idx: number) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleGoToDoa(doa.id)}
                activeOpacity={0.7}
                style={styles.card}
              >
                <View style={styles.emojiBadge}>
                  <Text style={styles.emojiText}>🤲</Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.doaTitle}>{doa.nama}</Text>
                  <Text style={styles.doaTeksArab}>{doa.ar}</Text>
                  {doa.idn ? (
                    <Text style={styles.doaArtinya} numberOfLines={1}>
                      {doa.idn}
                    </Text>
                  ) : null}
                </View>

                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.colorTg}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M9 18l6-6-6-6" />
                </Svg>
              </TouchableOpacity>
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
    backgroundColor: colors.colorTertiary,
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
  searchContainer: {
    position: "relative",
    marginTop: 16,
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingLeft: 36,
    paddingRight: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "NunitoSemiBold",
    color: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  scrollContent: {
    paddingTop: 8,
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
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emojiBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#00CBBF22",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  doaTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#1F2937",
  },
  doaTeksArab: {
    fontFamily: "Amiri",
    fontSize: 24,
    color: "#1F2937",
  },
  doaArtinya: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: "#9CA3AF",
    marginTop: 2,
  },
});
