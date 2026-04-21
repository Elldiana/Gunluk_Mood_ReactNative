import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Renkler } from '../constants/Colors';

export default function KilitEkrani() {
    const router = useRouter();
    const [girilenSifre, setGirilenSifre] = useState("");
    const [kayitliSifre, setKayitliSifre] = useState("1234");
    const tuslar = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "sil"];

    const tusBasildi = (tus: string) => {
        if (tus === "sil") {
            setGirilenSifre(prev => prev.slice(0, -1));
            return;
        }
        if (tus === "") return;

        if (girilenSifre.length < 4) {
            const yeniSifre = girilenSifre + tus;
            setGirilenSifre(yeniSifre);

            if (yeniSifre.length === 4) {
                if (yeniSifre === kayitliSifre) {
                    router.replace("/tabs/anaSayfa");
                } else {
                    Alert.alert("Hata", "⚠️ Yanlış şifre!");
                    setGirilenSifre("");
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.baslik}>GünlükMood</Text>
            <Text style={styles.altBaslik}>Hoş Geldin!</Text>
            <View style={styles.sifreKutusu}>
                <Text style={styles.sifreYazi}>{'•'.repeat(girilenSifre.length)}</Text>
            </View>
            <View style={styles.klavye}>
                {tuslar.map((tus, index) => (
                    <TouchableOpacity key={index} style={styles.tus} onPress={() => tusBasildi(tus)}>
                        <Text style={styles.tusYazi}>{tus === "sil" ? "⌫" : tus}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Renkler.anaRenk, alignItems: 'center', justifyContent: 'center' },
    baslik: { fontSize: 32, fontWeight: 'bold', color: Renkler.arkaplan, marginBottom: 10 },
    altBaslik: { fontSize: 18, color: Renkler.arkaplan, marginBottom: 30 },
    sifreKutusu: { height: 50, marginBottom: 50, justifyContent: 'center' },
    sifreYazi: { fontSize: 40, letterSpacing: 10, color: Renkler.yaziKoyu },
    klavye: { flexDirection: 'row', flexWrap: 'wrap', width: 240, justifyContent: 'center', gap: 20 },
    tus: { width: 60, height: 60, backgroundColor: '#e3e0e0', borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    tusYazi: { fontSize: 24, fontWeight: 'bold', color: Renkler.yaziKoyu }
});