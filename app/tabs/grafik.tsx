import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Renkler } from '../../constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function GrafikSayfasi() {
    const tumKayitlar = useQuery(api.gunluk.getir) || [];

    const [secilenTarih, setSecilenTarih] = useState(new Date());

    const ayDegistir = (yon: number) => {
        const yeniTarih = new Date(secilenTarih);
        yeniTarih.setMonth(yeniTarih.getMonth() + yon);
        setSecilenTarih(yeniTarih);
    };

    const aylikKayitlar = tumKayitlar.filter(kayit => {
        const kDate = new Date(kayit.tarih);
        return (
            kDate.getMonth() === secilenTarih.getMonth() &&
            kDate.getFullYear() === secilenTarih.getFullYear()
        );
    });

    const toplam = aylikKayitlar.length;

    const sayac = {
        harika: aylikKayitlar.filter(k => k.duygu === 'harika').length,
        mutlu: aylikKayitlar.filter(k => k.duygu === 'mutlu').length,
        normal: aylikKayitlar.filter(k => k.duygu === 'normal').length,
        kotu: aylikKayitlar.filter(k => k.duygu === 'kotu').length,
        berbat: aylikKayitlar.filter(k => k.duygu === 'berbat').length,
    };

    // Yüzde bulucu
    const yuzdeBul = (sayi: number) => (toplam === 0 ? 0 : (sayi / toplam) * 100);

    const sozler = [
        "Her yeni gün bembeyaz bir sayfadır. ✍️",
        "Büyük değişimler, küçük adımlarla başlar. 🌱",
        "Güneş her sabah yeniden doğar. ☀️",
        "Kendi iç huzurun, en değerli hazinendir. 💎",
        "Zorluklar seni güçlendirmek içindir. 💪",
        "Mutluluk varış değil, yolculuktur. ✨"
    ];
    const gununSozu = sozler[Math.floor(Math.random() * sozler.length)];

    const ayIsmi = secilenTarih.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* --- HEADER (AY SEÇİCİ) --- */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerSubtitle}>İstatistikler</Text>

                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={() => ayDegistir(-1)} style={styles.arrowBtn}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>{ayIsmi}</Text>

                    <TouchableOpacity onPress={() => ayDegistir(1)} style={styles.arrowBtn}>
                        <Ionicons name="chevron-forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Süsleme */}
                <View style={styles.headerCircle} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={styles.scrollArea}>

                {/* --- ÖZET KARTLARI --- */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryNumber}>{toplam}</Text>
                        <Text style={styles.summaryLabel}>Toplam Kayıt</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        {/* En çok hissedilen duyguyu bulma mantığı (Basitçe) */}
                        <Text style={styles.summaryNumber}>
                            {toplam === 0 ? "-" : "%" + Math.round(yuzdeBul(Math.max(...Object.values(sayac))))}
                        </Text>
                        <Text style={styles.summaryLabel}>Baskın Duygu</Text>
                    </View>
                </View>

                {/* --- GRAFİK KARTI --- */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Duygu Dağılımı</Text>

                    {toplam === 0 ? (
                        <View style={styles.bosKutu}>
                            <Ionicons name="stats-chart" size={50} color="#eee" />
                            <Text style={styles.bosText}>Bu ay henüz veri yok.</Text>
                        </View>
                    ) : (
                        <>
                            {/* Harika */}
                            <BarItem label="Harika" emoji="🤩" color={Renkler.harika} percent={yuzdeBul(sayac.harika)} count={sayac.harika} />
                            {/* Mutlu */}
                            <BarItem label="Mutlu" emoji="😊" color={Renkler.mutlu} percent={yuzdeBul(sayac.mutlu)} count={sayac.mutlu} />
                            {/* Normal */}
                            <BarItem label="Normal" emoji="🙂" color={Renkler.normal} percent={yuzdeBul(sayac.normal)} count={sayac.normal} />
                            {/* Kötü */}
                            <BarItem label="Kötü" emoji="😓" color={Renkler.kotu} percent={yuzdeBul(sayac.kotu)} count={sayac.kotu} />
                            {/* Berbat */}
                            <BarItem label="Çok Kötü" emoji="😡" color={Renkler.berbat} percent={yuzdeBul(sayac.berbat)} count={sayac.berbat} />
                        </>
                    )}
                </View>

                {/* --- MOTİVASYON --- */}
                <View style={[styles.card, {backgroundColor: '#FFF8DE'}]}>
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
                        <Ionicons name="bulb" size={24} color="#f6b93b" />
                        <Text style={{fontWeight:'bold', fontSize:20, color:'#d35400', marginLeft:10}}>Günün Notu</Text>
                    </View>
                    <Text style={styles.quoteText}>"{gununSozu}"</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const BarItem = ({ label, emoji, color, percent, count }: any) => (
    <View style={styles.barRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.progressContainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                <Text style={styles.barLabel}>{label}</Text>
                <Text style={styles.barCount}>{count} gün</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: color }]} />
            </View>
        </View>
        <Text style={styles.percentText}>%{Math.round(percent)}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Renkler.arkaplan },

    // HEADER
    headerContainer: {
        backgroundColor: Renkler.anaRenk,
        height: 170,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: 50,
        alignItems: 'center',
        position: 'relative',
    },
    headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 20 },
    headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    arrowBtn: { padding: 5, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:10 },
    headerCircle: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 60 },

    scrollArea: { marginTop: -40, paddingHorizontal: 20 },

    // ÖZET KARTLARI
    summaryRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
    summaryCard: {
        flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
    },
    summaryNumber: { fontSize: 28, fontWeight: '900', color: Renkler.yaziKoyu },
    summaryLabel: { fontSize: 12, color: Renkler.yaziHafif, marginTop: 5, fontWeight:'600' },

    // GRAFİK KARTI
    card: {
        backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: Renkler.yaziKoyu, marginBottom: 20 },

    // GRAFİK ÇUBUKLARI
    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    emoji: { fontSize: 24, width: 40 },
    progressContainer: { flex: 1, marginRight: 15 },
    barLabel: { fontSize: 12, fontWeight: 'bold', color: Renkler.yaziHafif },
    barCount: { fontSize: 10, color: '#aaa' },
    progressBarBg: { height: 10, backgroundColor: '#f1f2f6', borderRadius: 5, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 5 },
    percentText: { width: 35, textAlign: 'right', fontWeight: 'bold', fontSize: 12, color: Renkler.yaziKoyu },

    // BOŞ DURUM
    bosKutu: { alignItems: 'center', padding: 20 },
    bosText: { color: '#ccc', marginTop: 10 },

    // QUOTE
    quoteText: { fontStyle: 'italic', color: '#555', fontSize: 16, lineHeight: 22 }
});