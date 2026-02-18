import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { COLORS } from "@/constants/colors";
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Slot />
      </SafeAreaView>
    </ClerkProvider>
  );
}
