import { colors } from "@/themes";
import { getLocationName, getShalatSchedule } from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

interface PrayerTime {
  name: string;
  arabicName: string;
  key: string;
  icon: string;
}

const PRAYERS: PrayerTime[] = [
  { name: "Subuh", arabicName: "الفجر", key: "Fajr", icon: "🌙" },
  { name: "Dzuhur", arabicName: "الظهر", key: "Dhuhr", icon: "☀️" },
  { name: "Ashar", arabicName: "العصر", key: "Asr", icon: "🌤" },
  { name: "Maghrib", arabicName: "المغرب", key: "Maghrib", icon: "🌅" },
  { name: "Isya", arabicName: "العشاء", key: "Isha", icon: "🌃" },
];

function getCurrentPrayer(timings: Record<string, string>): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let currentPrayer = "Isha";

  for (let i = PRAYERS.length - 1; i >= 0; i--) {
    const [h, m] = (timings[PRAYERS[i].key] || "00:00").split(":").map(Number);
    if (currentMinutes >= h * 60 + m) {
      currentPrayer = PRAYERS[i].key;
      break;
    }
  }
  return currentPrayer;
}

function getNextPrayer(
  timings: Record<string, string>,
): { key: string; time: string } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const p of PRAYERS) {
    const [h, m] = (timings[p.key] || "00:00").split(":").map(Number);
    if (h * 60 + m > currentMinutes) {
      return { key: p.key, time: timings[p.key] };
    }
  }
  return null;
}

export default function ShalatScreen() {
  const insets = useSafeAreaInsets();
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  function fetchSchedule() {
    setLoading(true);
    setError("");
    setLocationDenied(false);

    if (
      typeof navigator !== "undefined" &&
      navigator.geolocation &&
      Platform.OS !== "android" &&
      Platform.OS !== "ios"
    ) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const [t, loc] = await Promise.all([
              getShalatSchedule(latitude, longitude),
              getLocationName(latitude, longitude),
            ]);
            setTimings(t);
            setLocationName(loc);
          } catch {
            setError("Gagal memuat jadwal shalat");
          } finally {
            setLoading(false);
          }
        },
        async () => {
          // Fallback to Jakarta coordinates if location denied / unavailable
          try {
            const [t, loc] = await Promise.all([
              getShalatSchedule(-6.2088, 106.8456),
              getLocationName(-6.2088, 106.8456),
            ]);
            setTimings(t);
            setLocationName(loc || "Jakarta");
          } catch {
            setLocationDenied(true);
          } finally {
            setLoading(false);
          }
        },
        { timeout: 10000 },
      );
    } else {
      // Direct load with default location (Jakarta, Indonesia) or device location
      (async () => {
        try {
          const [t, loc] = await Promise.all([
            getShalatSchedule(-6.2088, 106.8456),
            getLocationName(-6.2088, 106.8456),
          ]);
          setTimings(t);
          setLocationName(loc || "Jakarta");
        } catch {
          setError("Gagal memuat jadwal shalat");
        } finally {
          setLoading(false);
        }
      })();
    }
  }

  const today = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentPrayerKey = timings ? getCurrentPrayer(timings) : null;
  const nextPrayer = timings ? getNextPrayer(timings) : null;
  const nextPrayerData = nextPrayer
    ? PRAYERS.find((p) => p.key === nextPrayer.key)
    : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.colorSecText, colors.colorTxtGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}
      >
        {/* Circle decorations */}
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        <Text style={styles.headerTitle}>Jadwal Shalat</Text>
        <Text style={styles.headerDate}>{today}</Text>

        {locationName ? (
          <View style={styles.locationRow}>
            <Svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.8 }}
            >
              <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <Circle cx="12" cy="10" r="3" />
            </Svg>
            <Text style={styles.locationText}>{locationName}</Text>
          </View>
        ) : null}

        {/* Live Clock */}
        <Text style={styles.clockText}>
          {now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        {nextPrayer && nextPrayerData && (
          <Text style={styles.nextPrayerText}>
            Shalat berikutnya:{" "}
            <Text style={styles.nextPrayerHighlight}>
              {nextPrayerData.name}
            </Text>{" "}
            pukul{" "}
            <Text style={styles.nextPrayerHighlight}>{nextPrayer.time}</Text>
          </Text>
        )}
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          !timings && styles.emptyScrollContent,
          { paddingBottom: Math.max(insets.bottom + 80, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!timings && !loading && !locationDenied && (
          <View style={styles.permissionCard}>
            <View style={styles.permissionIconBadge}>
              <Svg
                width={36}
                height={36}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.colorPrimary}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <Circle cx="12" cy="10" r="3" />
              </Svg>
            </View>
            <Text style={styles.permissionTitle}>Akses Lokasi</Text>
            <Text style={styles.permissionSubtitle}>
              Dapatkan jadwal shalat yang akurat sesuai dengan area dan zona waktu Anda.
            </Text>
            <TouchableOpacity
              onPress={fetchSchedule}
              activeOpacity={0.8}
              style={styles.permissionButtonWrapper}
            >
              <LinearGradient
                colors={[colors.colorPrimary, colors.colorTxtGreen]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionButtonText}>Lihat Jadwal Shalat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {locationDenied && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>
              Akses lokasi ditolak. Harap izinkan akses lokasi di pengaturan.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setLocationDenied(false);
                fetchSchedule();
              }}
              activeOpacity={0.7}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.colorSecText} />
            <Text style={styles.loadingText}>Mengambil jadwal shalat...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={fetchSchedule}
              activeOpacity={0.7}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {timings && (
          <View style={styles.timingsList}>
            {PRAYERS.map((prayer) => {
              const time = timings[prayer.key] || "-";
              const isCurrent = currentPrayerKey === prayer.key;

              if (isCurrent) {
                return (
                  <LinearGradient
                    key={prayer.key}
                    colors={[colors.colorPrimary, colors.colorTxtGreen]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.prayerCardCurrent}
                  >
                    <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                    <View style={styles.prayerInfo}>
                      <Text style={styles.prayerNameCurrent}>
                        {prayer.name}
                      </Text>
                      <Text style={styles.prayerArabicCurrent}>
                        {prayer.arabicName}
                      </Text>
                    </View>
                    <View style={styles.prayerTimeContainer}>
                      <Text style={styles.prayerTimeCurrent}>{time}</Text>
                      <View style={styles.badgeCurrent}>
                        <Text style={styles.badgeTextCurrent}>Sekarang</Text>
                      </View>
                    </View>
                  </LinearGradient>
                );
              }

              return (
                <View key={prayer.key} style={styles.prayerCard}>
                  <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                  <View style={styles.prayerInfo}>
                    <Text style={styles.prayerName}>{prayer.name}</Text>
                    <Text style={styles.prayerArabic}>{prayer.arabicName}</Text>
                  </View>
                  <View style={styles.prayerTimeContainer}>
                    <Text style={styles.prayerTime}>{time}</Text>
                  </View>
                </View>
              );
            })}

            {/* Refresh Button */}
            <TouchableOpacity
              onPress={fetchSchedule}
              activeOpacity={0.7}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>Perbarui Jadwal</Text>
            </TouchableOpacity>
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
  circleTopRight: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: colors.colorTertiary,
    opacity: 0.2,
  },
  circleBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 64,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.colorSecondary,
    opacity: 0.1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "NunitoBold",
  },
  headerDate: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: "NunitoSemiBold",
    marginTop: 2,
  },
  locationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontFamily: "NunitoSemiBold",
  },
  clockText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    fontFamily: "NunitoBold",
    marginTop: 12,
    letterSpacing: -0.5,
  },
  nextPrayerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: "Nunito",
    marginTop: 4,
  },
  nextPrayerHighlight: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "NunitoBold",
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
  permissionCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  permissionIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00CBBF22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#374151",
    marginBottom: 4,
    textAlign: "center",
  },
  permissionSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  permissionButtonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "NunitoBold",
    fontSize: 14,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: "Nunito",
    marginTop: 12,
  },
  errorText: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Nunito",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.colorPrimary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NunitoSemiBold",
  },
  timingsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  prayerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prayerCardCurrent: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerIcon: {
    fontSize: 24,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#1F2937",
  },
  prayerNameCurrent: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NunitoBold",
    color: "#FFFFFF",
  },
  prayerArabic: {
    fontSize: 12,
    fontFamily: "Amiri",
    color: "#9CA3AF",
    marginTop: 2,
  },
  prayerArabicCurrent: {
    fontSize: 12,
    fontFamily: "Amiri",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  prayerTimeContainer: {
    alignItems: "flex-end",
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "NunitoBold",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  prayerTimeCurrent: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "NunitoBold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  badgeCurrent: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeTextCurrent: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "NunitoSemiBold",
  },
  refreshButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#00CBBF11",
    borderWidth: 1.5,
    borderColor: "#00CBBF44",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  refreshButtonText: {
    color: colors.colorPrimary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NunitoSemiBold",
  },
});

