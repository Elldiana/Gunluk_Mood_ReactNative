import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Renkler } from '../../constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Renkler.vurgu,
                tabBarInactiveTintColor: '#2D3436',

                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: '700',
                    marginTop: 8,
                },

                tabBarStyle: {
                    height: 90,
                    paddingTop: 10,
                    paddingBottom: 10,
                },
            }}
        >
            <Tabs.Screen
                name="anaSayfa"
                options={{
                    title: 'Bugün',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="today-outline" size={28} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="gecmis"
                options={{
                    title: 'Geçmiş',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar-outline" size={28} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="grafik"
                options={{
                    title: 'Grafik',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="stats-chart-outline" size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
