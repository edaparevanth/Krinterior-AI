import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/src/contexts/AuthContext";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

function CenterCreateButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      testID="tab-create-fab"
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.fabWrap}
    >
      <View style={styles.fab}>
        <Ionicons name="sparkles" size={26} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/(auth)/login");
  }, [user, loading, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9F968A",
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: 78,
          paddingBottom: 12,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: fonts.sansSemi },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "albums" : "albums-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-tab"
        options={{
          title: "",
          tabBarButton: (props) => (
            <CenterCreateButton
              onPress={() => {
                router.push("/create");
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: "Ideas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bulb" : "bulb-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen name="vastu" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    top: -22,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.background,
  },
});
