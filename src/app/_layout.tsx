import { colors } from "@/themes";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Amiri: require("@/assets/fonts/Amiri-Regular.ttf"),
    AmiriBold: require("@/assets/fonts/Amiri-Bold.ttf"),

    Nunito: require("@/assets/fonts/Nunito-Regular.ttf"),
    NunitoSemiBold: require("@/assets/fonts/Nunito-Medium.ttf"),
    NunitoBold: require("@/assets/fonts/Nunito-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.colorPg,
          paddingTop: 0,
        },
      }}
    />
  );
}
