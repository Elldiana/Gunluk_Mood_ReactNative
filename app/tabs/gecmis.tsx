import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, StatusBar } from 'react-native';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Renkler } from '../../constants/Colors';
import { useState } from 'react';
import { Id } from "../../convex/_generated/dataModel";
import { Ionicons } from '@expo/vector-icons';

export default function GecmisSayfasi() {
    const kayitlar = useQuery(api.gunluk.getir) || [];
    const aktiviteListesi = useQuery(api.aktiviteler.getir) || [];

    const sil = useMutation(api.gunluk.sil);
    const guncelle = useMutation(api.gunluk.guncelle);

    const [modalAcik, setModalAcik] = useState(false);
    const [duzenlenecekId, setDuzenlenecekId] = useState<Id<"gunluk"> | null>(null);
    const [yeniDuygu, setYeniDuygu] = useState("");
    const [yeniAktiviteler, setYeniAktiviteler] = useState<string[]>([]);
    const [yeniNot, setYeniNot] = useState("");

    const duygular = [
        { id: 'harika', emoji: '🤩', renk: Renkler.harika },
        { id: 'mutlu', emoji: '😊', renk: Renkler.mutlu },
        { id: 'normal', emoji: '🙂', renk: Renkler.normal },
        { id: 'kotu', emoji: '😓', renk: Renkler.kotu },
        { id: 'berbat', emoji: '😡', renk: Renkler.berbat },
    ];

    const duzenlemeyiBaslat = (item: any) => {
        setDuzenlenecekId(item._id);
        setYeniDuygu(item.duygu);
        setYeniAktiviteler(item.aktiviteler || []);
        setYeniNot(item.not || "");
        setModalAcik(true);
    };

    const guncellemeyiKaydet = async () => {
        if (duzenlenecekId) {
            await guncelle({
                id: duzenlenecekId,
                duygu: yeniDuygu,
                aktiviteler: yeniAktiviteler,
                not: yeniNot,
            });
            setModalAcik(false);
            Alert.alert("✅ Başarılı", "Kayıt güncellendi!");
        }
    };

    const handleSil = (id: any) => {
        Alert.alert("⚠️ Sil?", "Bu anı silmek istediğine emin misin?", [
            { text: "Vazgeç", style: "cancel" },
            { text: "Sil", style: 'destructive', onPress: () => sil({ id }) }
        ]);
    };

    const aktiviteDegistir = (ad: string) => {
        if (yeniAktiviteler.includes(ad)) {
            setYeniAktiviteler(prev => prev.filter(i => i !== ad));
        } else {
            setYeniAktiviteler(prev => [...prev, ad]);
        }
    };

    const emojiBul = (id: string) => {
        const d = duygular.find(x => x.id === id);
        return d ? d.emoji : '❓';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* --- HEADER --- */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerBaslik}>Geçmiş Kayıtlar</Text>
                <Text style={styles.headerAlt}>Neler hissettiğini hatırla</Text>
                <View style={styles.headerCircle} />
            </View>

            {/* --- LİSTE --- */}
            <View style={styles.listContainer}>
                <FlatList
                    data={kayitlar}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.bosDurum}>
                            <Ionicons name="journal-outline" size={60} color="#ccc" />
                            <Text style={styles.bosYazi}>Henüz hiç kayıt girmedin.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                {/* Sol: Emoji */}
                                <View style={styles.emojiKutu}>
                                    <Text style={styles.emojiText}>{emojiBul(item.duygu)}</Text>
                                </View>

                                {/* Orta: Bilgi */}
                                <View style={styles.bilgiKutu}>
                                    <Text style={styles.tarih}>
                                        {new Date(item.tarih).toLocaleDateString('tr-TR', {day:'numeric', month:'long'})}
                                    </Text>
                                    <Text style={styles.gun}>
                                        {new Date(item.tarih).toLocaleDateString('tr-TR', {weekday:'long'})}
                                    </Text>

                                    {/* Aktiviteler */}
                                    <View style={styles.aktiviteSatiri}>
                                        {item.aktiviteler?.map((akt, i) => (
                                            <View key={i} style={styles.etiket}>
                                                <Text style={styles.etiketText}>{akt}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Sağ: İkonlu Butonlar */}
                                <View style={styles.butonGrubu}>
                                    <TouchableOpacity onPress={() => duzenlemeyiBaslat(item)} style={styles.iconBtnEdit}>
                                        <Ionicons name="pencil" size={18} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSil(item._id)} style={styles.iconBtnDelete}>
                                        <Ionicons name="trash" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Not Varsa Göster */}
                            {item.not ? (
                                <View style={styles.notKutusu}>
                                    <Ionicons name="document-text-outline" size={16} color={Renkler.yaziHafif} style={{marginRight:5}} />
                                    <Text style={styles.notYazisi}>{item.not}</Text>
                                </View>
                            ) : null}
                        </View>
                    )}
                />
            </View>

            {/* --- MODAL (Düzenleme) --- */}
            <Modal visible={modalAcik} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalKutu}>
                        <Text style={styles.modalBaslik}>Kaydı Düzenle</Text>

                        <Text style={styles.modalAltBaslik}>Duygu Durumu</Text>
                        <View style={styles.modalEmojiRow}>
                            {duygular.map(d => (
                                <TouchableOpacity key={d.id} onPress={() => setYeniDuygu(d.id)}
                                                  style={[styles.modalEmojiBtn, yeniDuygu === d.id && {backgroundColor: d.renk, borderColor: d.renk}]}>
                                    <Text style={{fontSize:24}}>{d.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.modalAltBaslik}>Aktiviteler</Text>
                        <View style={styles.modalAktiviteRow}>
                            {/* BURAYI DEĞİŞTİRDİK: Artık veritabanından gelen listeyi dönüyor */}
                            {aktiviteListesi.map(akt => (
                                <TouchableOpacity
                                    key={akt._id}
                                    onPress={() => aktiviteDegistir(akt.ad)} // 'akt.ad' kullanıyoruz
                                    style={[
                                        styles.modalAktBtn,
                                        yeniAktiviteler.includes(akt.ad) && {backgroundColor: Renkler.anaRenk, borderColor: Renkler.anaRenk}
                                    ]}
                                >
                                    <Text style={yeniAktiviteler.includes(akt.ad) ? {color:'white'} : {color:'#555'}}>
                                        {akt.emoji} {akt.ad}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.modalAltBaslik}>Not</Text>
                        <TextInput
                            style={styles.modalInput} value={yeniNot} onChangeText={setYeniNot} placeholder="Notu güncelle..." multiline
                            autoCorrect={false} spellCheck={false}
                        />

                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => setModalAcik(false)} style={styles.btnIptal}>
                                <Text style={{color:'#666', fontWeight:'bold'}}>Vazgeç</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={guncellemeyiKaydet} style={styles.btnKaydet}>
                                <Text style={{color:'white', fontWeight:'bold'}}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Renkler.arkaplan },

    // HEADER TASARIMI
    headerContainer: {
        backgroundColor: Renkler.anaRenk,
        height: 160,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: 50,
        alignItems: 'center',
        position: 'relative',
    },
    headerCircle: {
        position: 'absolute', top: -30, left: -30, width: 100, height: 100,
        backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 50,
    },
    headerBaslik: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    headerAlt: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 },

    // LİSTE ALANI
    listContainer: { flex: 1, paddingHorizontal: 20, marginTop: -30 },

    // KART TASARIMI
    card: {
        backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
    },
    emojiKutu: {
        width: 55, height: 55, backgroundColor: '#f5f6fa', borderRadius: 18,
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    emojiText: { fontSize: 28 },

    bilgiKutu: { flex: 1 },
    tarih: { fontWeight: 'bold', fontSize: 16, color: Renkler.yaziKoyu },
    gun: { fontSize: 12, color: Renkler.yaziHafif, marginBottom: 5 },

    aktiviteSatiri: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    etiket: { backgroundColor: '#f1f2f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    etiketText: { fontSize: 10, color: '#666', fontWeight:'600' },

    // BUTONLAR (IONICONS)
    butonGrubu: { flexDirection: 'column', gap: 8, marginLeft: 10 },
    iconBtnEdit: {
        backgroundColor: '#feca57', width: 32, height: 32, borderRadius: 10,
        alignItems:'center', justifyContent:'center'
    },
    iconBtnDelete: {
        backgroundColor: '#ff6b6b', width: 32, height: 32, borderRadius: 10,
        alignItems:'center', justifyContent:'center'
    },

    // NOT ALANI
    notKutusu: {
        marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f2f6',
        flexDirection:'row', alignItems:'center'
    },
    notYazisi: { fontSize: 13, color: Renkler.yaziKoyu, fontStyle: 'italic', flex:1 },

    // BOŞ DURUM
    bosDurum: { alignItems:'center', marginTop: 50 },
    bosYazi: { marginTop:10, color: Renkler.yaziHafif, fontSize:16 },

    // MODAL STİLLERİ
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalKutu: { backgroundColor: 'white', borderRadius: 24, padding: 25, elevation: 5 },
    modalBaslik: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: Renkler.yaziKoyu },
    modalAltBaslik: { fontSize: 14, fontWeight: 'bold', color: Renkler.yaziHafif, marginTop: 15, marginBottom: 10 },

    modalEmojiRow: { flexDirection: 'row', justifyContent: 'space-between' },
    modalEmojiBtn: { padding: 8, borderRadius: 12, borderWidth: 2, borderColor: '#eee' },

    modalAktiviteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    modalAktBtn: { flexDirection:'row', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems:'center' },

    modalInput: { backgroundColor: '#f5f6fa', borderRadius: 12, padding: 15, height: 80, textAlignVertical: 'top', marginTop: 5 },

    modalFooter: { flexDirection: 'row', gap: 15, marginTop: 25 },
    btnIptal: { flex: 1, backgroundColor: '#dfe6e9', padding: 15, borderRadius: 15, alignItems: 'center' },
    btnKaydet: { flex: 1, backgroundColor: Renkler.anaRenk, padding: 15, borderRadius: 15, alignItems: 'center' }
});