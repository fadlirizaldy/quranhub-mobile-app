import ListQuranSection from "@/components/list-quran-section";
import { colors, spacing } from "@/themes";
import { getAllSurah } from "@/utils/api";
import { Surah } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

export default function Index() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllSurah()
      .then(setSurahs)
      .catch(() => setError("Gagal memuat daftar surah"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      String(s.nomor).includes(search),
  );

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Sore";

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorPrimary, colors.colorTxtGreen]}
        start={{ x: 0, y: 0 }} // 0% start point (Top-Left roughly for 135deg)
        end={{ x: 1, y: 1 }} // 105% / Bottom-Right end point
        style={styles.containerHeader}
      >
        {/* Cicle Decoration */}
        <View
          className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20"
          style={styles.cicleDecorationRight}
        />
        <View
          className="absolute -bottom-10 right-16 w-24 h-24 rounded-full opacity-15"
          style={styles.cicleDecorationLeft}
        />

        <View>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.titleText}>Al-Quran</Text>
          <Text style={styles.subtitleText}>114 Surah · Baca kapan saja</Text>
        </View>

        {/* search */}
        <View className="relative mt-4" style={styles.searchContainer}>
          <Svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={styles.searchIcon}
          >
            <Circle cx="11" cy="11" r="8" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" />
          </Svg>
          <TextInput
            placeholder="Cari surah..."
            value={search}
            onChangeText={(newText) => setSearch(newText)}
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      {/* List */}
      <ListQuranSection surahs={filtered} loading={loading} error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorPg,
  },
  containerHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
    fontFamily: "Nunito",
  },
  greetingText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5,
  },
  subtitleText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 6,
  },
  cicleDecorationRight: {
    position: "absolute",
    width: 150,
    height: 150,
    right: -30,
    top: -38,
    borderRadius: "100%",
    opacity: 0.2,
    backgroundColor: colors.colorTertiary,
  },
  cicleDecorationLeft: {
    backgroundColor: colors.colorSecondary,
    position: "absolute",
    bottom: -60,
    right: 60,
    width: 100,
    height: 100,
    borderRadius: "100%",
    opacity: 0.15,
  },

  searchContainer: {
    marginTop: 15,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 10,
    top: 14,
    color: colors.colorSg,
  },
  searchInput: {
    borderRadius: spacing.lg,
    backgroundColor: "#FFF",
    paddingLeft: 36,
    paddingRight: 14,
    paddingVertical: 12,
  },
});
