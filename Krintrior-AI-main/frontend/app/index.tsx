import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/src/contexts/AuthContext";
import { colors } from "@/src/theme/colors";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  return (
    <View style={styles.container} testID="splash-screen">
      <Text style={styles.brand}>KRINTERIOR</Text>
      <Text style={styles.tag}>AI INTERIOR STUDIO</Text>
      <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  brand: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 4,
  },
  tag: {
    marginTop: 6,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 6,
    fontWeight: "700",
  },
});
