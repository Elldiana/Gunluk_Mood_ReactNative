import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
});

export default function RootLayout() {
    return (
        <ConvexProvider client={convex}>
            <Stack>
                {/* Kilit Ekranı */}
                <Stack.Screen name="index" options={{ headerShown: false }} />

                {/* Senin parantezsiz 'tabs' klasörün */}
                <Stack.Screen name="tabs" options={{ headerShown: false }} />
            </Stack>
        </ConvexProvider>
    );
}