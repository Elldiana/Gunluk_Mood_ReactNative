import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal, StatusBar } from 'react-native';
import { Renkler } from '../../constants/Colors';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";

export default function AnaSayfa() {

    const [secilenDuygu, setSecilenDuygu] = useState("");
    const [secilenAktiviteler, setSecilenAktiviteler] = useState<string[]>([]);
    const [not, setNot] = useState("");

    const kaydet = useMutation(api.gunluk.ekle);

    const aktiviteListesi = useQuery(api.aktiviteler.getir)|| [];
    const kategoriListesi = useQuery(api.kategoriler.getir) || [];

    const varsayilanAktiviteleriYukle = useMutation(api.aktiviteler.varsayilanlariYukle);
    const varsayilanKategorileriYukle = useMutation(api.kategoriler.varsayilanlariYukle);

    const aktiviteEkle = useMutation(api.aktiviteler.ekle);
    const aktiviteSil = useMutation(api.aktiviteler.sil);

    const kategoriEkle = useMutation(api.kategoriler.ekle);
    const kategoriSil = useMutation(api.kategoriler.sil);
    const kategoriGuncelle = useMutation(api.kategoriler.guncelle);

    //  MODAL STATE ---
    const [modalAcik, setModalAcik] = useState(false);
    const [modalTip, setModalTip] = useState<"aktivite" | "kategori-ekle" | "kategori-duzenle">("aktivite");

    const [yeniAd, setYeniAd] = useState("");
    const [yeniEmoji, setYeniEmoji] = useState("✨");
    const [hedefKategori, setHedefKategori] = useState("");

    const [duzenlenecekId, setDuzenlenecekId] = useState<Id<"kategoriler"> | null>(null);

    useEffect(() => {
        if (kategoriListesi !== undefined && kategoriListesi.length === 0) varsayilanKategorileriYukle();
        if (aktiviteListesi !== undefined && aktiviteListesi.length === 0) varsayilanAktiviteleriYukle();
    }, [kategoriListesi, aktiviteListesi]);


    const duygular = [
        { id: 'harika', emoji: '🤩', label: 'Harika', renk: Renkler.harika },
        { id: 'mutlu', emoji: '😊', label: 'Mutlu', renk: Renkler.mutlu },
        { id: 'normal', emoji: '🙂', label: 'Normal', renk: Renkler.normal },
        { id: 'kotu', emoji: '😓', label: 'Kötü', renk: Renkler.kotu },
        { id: 'berbat', emoji: '😡', label: 'Çok Kötü', renk: Renkler.berbat },
    ];

    // --- İŞLEMLER ---

    const handleAktiviteSec = (ad: string) => {
        if (secilenAktiviteler.includes(ad)) {
            setSecilenAktiviteler(prev => prev.filter(item => item !== ad));
        } else {
            setSecilenAktiviteler(prev => [...prev, ad]);
        }
    };

    const handleAktiviteSil = (id: Id<"aktiviteler">, ad: string) => {
        Alert.alert("⚠️ Aktiviteyi Sil", `'${ad}' aktivitesini silmek istiyor musun?`, [
            { text: "Vazgeç", style: "cancel" },
            { text: "Sil", style: 'destructive', onPress: () => aktiviteSil({ id }) }
        ]);
    };

    const handleKategoriSil = (id: Id<"kategoriler">, baslik: string) => {
        Alert.alert("⚠️ Bölümü Sil", `'${baslik}' bölümünü tamamen kaldırmak istiyor musun?`, [
            { text: "Vazgeç", style: "cancel" },
            { text: "Evet", style: 'destructive', onPress: () => kategoriSil({ id }) }
        ]);
    };

    const handleKategoriDuzenleBaslat = (id: Id<"kategoriler">, mevcutBaslik: string) => {
        setDuzenlenecekId(id);
        setYeniAd(mevcutBaslik);
        setModalTip("kategori-duzenle");
        setModalAcik(true);
    };

    const handleFormKaydet = async () => {
        if (!yeniAd) return alert("⚠️ Lütfen bir isim yazın!");

        if (modalTip === "aktivite") {
            await aktiviteEkle({ ad: yeniAd, emoji: yeniEmoji, kategori: hedefKategori });
        }
        else if (modalTip === "kategori-ekle") {
            await kategoriEkle({ baslik: yeniAd });
        }
        else if (modalTip === "kategori-duzenle" && duzenlenecekId) {
            // İsim Güncelleme İşlemi
            await kategoriGuncelle({ id: duzenlenecekId, yeniBaslik: yeniAd });
        }
        setModalAcik(false);
        setYeniAd("");
        setYeniEmoji("✨");
        setDuzenlenecekId(null);
    };

    const handleGunlukKaydet = async () => {
        if (!secilenDuygu) {
            Alert.alert("Seçim Yap", "⚠️ Bugün nasıl hissettiğini seçmedin.");
            return; // Uyarıyı gösterdikten sonra çık
        }

        await kaydet({
            duygu: secilenDuygu,
            aktiviteler: secilenAktiviteler,
            not: not,
            tarih: Date.now()
        });

        Alert.alert("Başarılı", "Günlük kaydedildi! ✅");
        setSecilenDuygu("");
        setSecilenAktiviteler([]);
        setNot("");
    };

    const getModalTitle = () => {
        if (modalTip === "aktivite") return `Yeni '${hedefKategori}' Aktivitesi`;
        if (modalTip === "kategori-duzenle") return "Bölüm İsmini Değiştir";
        return "Yeni Bölüm Oluştur";
    };

    return (
        <View style={{flex: 1, backgroundColor: Renkler.arkaplan}}>
            <StatusBar barStyle="light-content" />

            <ScrollView contentContainerStyle={{paddingBottom: 150}}>

                {/* --- HEADER --- */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTarih}>Bugün</Text>
                    <Text style={styles.headerBaslik}>Nasıl Hissediyorsun?</Text>
                    <View style={styles.headerCircle} />
                </View>

                {/* İÇERİK */}
                <View style={styles.contentContainer}>

                    {/* DUYGULAR */}
                    <View style={styles.card}>
                        <View style={styles.duyguRow}>
                            {duygular.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.duyguBtn,
                                        secilenDuygu === item.id
                                            ? {backgroundColor: item.renk, transform:[{scale:1.1}], shadowColor: item.renk}
                                            : {backgroundColor: Renkler.beyaz}
                                    ]}
                                    onPress={() => setSecilenDuygu(item.id)}>
                                    <Text style={{fontSize:32}}>{item.emoji}</Text>
                                    <Text style={[styles.duyguLabel, secilenDuygu === item.id && {color:'white', fontWeight:'bold'}]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Neler Yaptın?</Text>

                    {/* KATEGORİLER */}
                    {kategoriListesi.map((kategori) => {
                        const buKategoridekiAktiviteler =
                            aktiviteListesi.filter(a => a.kategori === kategori.baslik);

                        return (
                            <View key={kategori._id} style={styles.card}>
                                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 15, alignItems:'center'}}>
                                    <TouchableOpacity
                                        onPress={() => handleKategoriDuzenleBaslat(kategori._id, kategori.baslik)}
                                        onLongPress={() => handleKategoriSil(kategori._id, kategori.baslik)}
                                        style={{flexDirection:'row', alignItems:'center'}}
                                    >
                                        <Text style={styles.cardTitle}>{kategori.baslik}</Text>
                                        <Ionicons name="pencil-outline" size={16} color="#777" style={{marginLeft:8}} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setModalTip("aktivite");
                                        setHedefKategori(kategori.baslik);
                                        setModalAcik(true);
                                    }}>
                                        <Text style={{color: Renkler.anaRenk, fontWeight:'bold', fontSize:14}}>+ Ekle</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.ikonRow}>
                                    {buKategoridekiAktiviteler.length === 0 && (
                                        <Text style={{color:'#ccc', fontSize:12, fontStyle:'italic'}}>Henüz aktivite yok.</Text>
                                    )}

                                    {buKategoridekiAktiviteler.map((akt) => (
                                        <TouchableOpacity
                                            key={akt._id}
                                            onPress={() => handleAktiviteSec(akt.ad)}
                                            onLongPress={() => handleAktiviteSil(akt._id, akt.ad)}
                                            style={[
                                                styles.aktBtn,
                                                secilenAktiviteler.includes(akt.ad)
                                                    ? {backgroundColor: Renkler.anaRenk, borderColor: Renkler.anaRenk}
                                                    : {backgroundColor: Renkler.beyaz, borderColor: '#eee'}
                                            ]}
                                        >
                                            <Text style={{fontSize:22}}>{akt.emoji}</Text>
                                            <Text style={[styles.aktText, secilenAktiviteler.includes(akt.ad) && {color:'white'}]} numberOfLines={1}>{akt.ad}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    {/* YENİ BÖLÜM EKLE */}
                    <TouchableOpacity
                        style={styles.yeniBolumBtn}
                        onPress={() => { setModalTip("kategori-ekle"); setModalAcik(true); }}
                    >
                        <Ionicons name="add-circle-outline" size={24} color={Renkler.yaziHafif} />
                        <Text style={styles.yeniBolumText}>Yeni Bölüm Oluştur</Text>
                    </TouchableOpacity>


                    {/* NOT ALANI */}
                    <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
                        Not Ekle <Ionicons name="document-text-outline" size={18} />
                    </Text>

                    <View style={styles.card}>
                        <TextInput
                            style={styles.input} placeholder="Bugün nasıl geçti?"
                            value={not} onChangeText={setNot} multiline
                            placeholderTextColor="#b2bec3"
                            autoCorrect={false} spellCheck={false}
                        />
                    </View>

                    {/* KAYDET */}
                    <TouchableOpacity style={styles.kaydetBtn} onPress={handleGunlukKaydet} activeOpacity={0.8}>
                        <Text style={styles.kaydetYazi}>GÜNLÜĞE EKLE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

            {/* MODAL */}
            <Modal visible={modalAcik} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalKutu}>
                        <Text style={styles.modalTitle}>{getModalTitle()}</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder={modalTip === "aktivite" ? "Aktivite" : "Bölüm Adı"}
                            value={yeniAd} onChangeText={setYeniAd}
                        />

                        {/* Sadece Aktivite ise Emoji göster */}
                        {modalTip === "aktivite" && (
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Emoji: "
                                value={yeniEmoji} onChangeText={setYeniEmoji} maxLength={2}
                            />
                        )}

                        <View style={{flexDirection:'row', gap:10, marginTop:10}}>
                            <TouchableOpacity onPress={() => setModalAcik(false)} style={styles.modalCancelBtn}>
                                <Text style={{color:'#666'}}>Vazgeç</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleFormKaydet} style={styles.modalAddBtn}>
                                <Text style={{color:'white', fontWeight:'bold'}}>
                                    {modalTip === "kategori-duzenle" ? "Güncelle" : "Ekle"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Renkler.anaRenk,
        height: 180,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: 60, alignItems: 'center',
        position: 'relative',
        zIndex: 1,
    },
    headerCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 75,
    },
    headerTarih: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16, fontWeight: '600'
    },
    headerBaslik: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5
    },
    contentContainer: { paddingHorizontal: 20,
        marginTop: -40,
        zIndex: 2
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,},
    duyguRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    duyguBtn: {
        width: 62,
        height: 85,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.05, shadowRadius:3, elevation:2
    },
    duyguLabel: {
        fontSize: 10,
        color: Renkler.yaziHafif,
        marginTop: 5,
        fontWeight:'600'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Renkler.yaziKoyu,
        marginLeft: 10,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Renkler.yaziHafif
    },
    ikonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    aktBtn: {
        width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
    },
    aktText: { fontSize: 10, color: Renkler.yaziHafif, marginTop: 3, fontWeight:'600' },
    yeniBolumBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 20,
        borderStyle: 'dashed',
        marginBottom: 20
    },
    yeniBolumText: {
        color: Renkler.yaziKoyu,
        fontWeight: 'bold',
        marginLeft: 10
    },
    input: {
        fontSize: 16,
        color: Renkler.yaziKoyu,
        height: 80,
        textAlignVertical:'top'
    },
    kaydetBtn: {
        backgroundColor: Renkler.anaRenk,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: Renkler.anaRenk, shadowOffset: {width:0, height:8}, shadowOpacity:0.4, shadowRadius:15, elevation:10
    },
    kaydetYazi: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    smallBtn: { backgroundColor: Renkler.vurgu, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    smallBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
    modalKutu: { backgroundColor: 'white', borderRadius: 24, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: Renkler.yaziKoyu, marginBottom: 20, textAlign:'center' },
    modalInput: { backgroundColor: Renkler.griArkaplan, borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
    modalCancelBtn: { flex: 1, backgroundColor: '#eee', padding: 15, borderRadius: 15, alignItems: 'center' },
    modalAddBtn: { flex: 1, backgroundColor: Renkler.anaRenk, padding: 15, borderRadius: 15, alignItems: 'center' },
});