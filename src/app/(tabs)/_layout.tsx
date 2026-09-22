import {
  BookmarkIcon,
  DoaIcon,
  QuranIcon,
  ShalatIcon,
} from "@/components/icons";
import { colors } from "@/themes";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.colorPrimary,
        tabBarInactiveTintColor: colors.colorSg,
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopColor: colors.border,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Quran",
          tabBarIcon: ({ color }) => <QuranIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="shalat"
        options={{
          title: "Shalat",
          tabBarIcon: ({ color }) => <ShalatIcon color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="doa"
        options={{
          title: "Doa",
          tabBarIcon: ({ color }) => <DoaIcon color={color as string} />,
        }}
      />

      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          tabBarIcon: ({ color }) => <BookmarkIcon color={color as string} />,
        }}
      />
    </Tabs>
  );
}
