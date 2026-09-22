import { colors, spacing } from "@/themes";
import { Surah } from "@/utils/types";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

export default function Index() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");

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

        <Text className="text-white/80 text-sm font-medium">{greeting}</Text>
        <Text className="text-white text-2xl font-extrabold mt-0.5">
          Al-Quran
        </Text>
        <Text className="text-white/70 text-xs mt-1">
          114 Surah · Baca kapan saja
        </Text>

        {/* search */}
        <View className="relative mt-4" style={styles.searchContainer}>
          <Svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="11" cy="11" r="8" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" />
          </Svg>
          <TextInput
            placeholder="Cari surah..."
            value={search}
            // onChange={(e) => setSearch(e)}
            className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-gray-700 outline-none shadow-sm placeholder-gray-400"
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>
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
    paddingTop: 64,
    paddingBottom: 26,
    overflow: "hidden",
    position: "relative",
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
    marginTop: 4,
    position: "relative",
  },
  searchInput: {
    borderRadius: spacing.xl,
    backgroundColor: "#FFF",
    paddingLeft: 20,
    paddingRight: 14,
    paddingVertical: 12,
  },
});
