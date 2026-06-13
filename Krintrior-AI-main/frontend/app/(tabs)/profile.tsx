import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/contexts/AuthContext";
import { colors, radii, space } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.full_name || user?.email || "K").charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.full_name || "Designer"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.list}>
          <Row icon="albums" label="My Projects" onPress={() => router.push("/(tabs)/projects")} />
          <Row icon="sparkles" label="Vastu Shastra" onPress={() => router.push("/(tabs)/vastu")} />
          <Row icon="add-circle" label="Create New Design" onPress={() => router.push("/create")} />
        </View>

        <TouchableOpacity testID="signout-btn" onPress={handleSignOut} style={styles.signOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>KRINTERIOR AI · v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.85}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.xl, gap: space.lg },
  title: { fontFamily: fonts.serifBlack, fontSize: 34, color: colors.textMain, letterSpacing: -1 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: space.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "900" },
  name: { marginTop: 12, fontSize: 18, fontWeight: "800", color: colors.textMain },
  email: { marginTop: 4, color: colors.textMuted },
  list: { backgroundColor: colors.white, borderRadius: radii.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.borderLight },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontWeight: "700", color: colors.textMain },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: "#FEE2E2",
  },
  signOutText: { color: colors.error, fontWeight: "800" },
  footer: { textAlign: "center", color: colors.textSubtle, fontSize: 12 },
});
