import { Surah } from "@/utils/types";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ListQuranProps {
  surahs: Surah[];
  loading: boolean;
  error: string;
}

const juzColors = ["#00CBBF", "#85E6C5", "#32B7C5", "#39967C", "#2AEEE2"];

const ListQuranSection = ({ surahs, loading, error }: ListQuranProps) => {
  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#00CBBF" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <View style={styles.listContainer}>
          {surahs.map((surah, i) => {
            const themeColor = juzColors[i % juzColors.length];

            return (
              <TouchableOpacity
                key={surah.nomor}
                activeOpacity={0.7}
                onPress={() => router.push(`/surah/${surah.nomor}`)}
                style={styles.card}
              >
                {/* Number badge */}
                <View
                  style={[styles.badge, { backgroundColor: themeColor + "22" }]}
                >
                  <Text style={[styles.badgeText, { color: themeColor }]}>
                    {surah.nomor}
                  </Text>
                </View>

                {/* Surah details */}
                <View style={styles.infoContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.surahName}>{surah.nama_latin}</Text>
                    <Text style={{ color: "#9CA3AF" }}>•</Text>
                    <Text style={styles.surahMeaning}>{surah.arti}</Text>
                  </View>
                  <Text style={styles.surahMeta}>
                    {surah.tempat_turun} · {surah.jumlah_ayat} ayat
                  </Text>
                </View>

                {/* Arabic Name */}
                <Text style={styles.arabicName}>{surah.nama}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 12,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  surahName: {
    fontWeight: "700",
    color: "#1F2937",
    fontSize: 14,
  },
  surahMeaning: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  surahMeta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    textTransform: "capitalize",
  },
  arabicName: {
    fontSize: 20,
    color: "#00CBBF",
  },
});

export default ListQuranSection;
