// convex/gunluk.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. EKLEME (Yeni kayıt oluştur)
export const ekle = mutation({
    args: {
        duygu: v.string(), // Zorunlu
        aktiviteler: v.optional(v.array(v.string())), // İsteğe bağlı
        not: v.optional(v.string()), // İsteğe bağlı (Yeni ekledik)
        tarih: v.number(), // Zorunlu
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("gunluk", args);
    },
});

// 2. LİSTELEME (Geçmiş kayıtları getir)
export const getir = query({
    args: {},
    handler: async (ctx) => {
        // Tarihe göre yeniden eskiye sırala (desc)
        return await ctx.db.query("gunluk").order("desc").collect();
    },
});

// 3. SİLME (Kaydı kaldır)
export const sil = mutation({
    args: { id: v.id("gunluk") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// 4. GÜNCELLEME (Kaydı düzenle)
export const guncelle = mutation({
    args: {
        id: v.id("gunluk"), // Hangi kayıt?
        duygu: v.optional(v.string()), // Yeni duygu
        aktiviteler: v.optional(v.array(v.string())), // Yeni aktiviteler
        not: v.optional(v.string()), // Yeni not (Burası çok önemli!)
    },
    handler: async (ctx, args) => {
        // ID'yi ayır, geri kalan verileri güncelle
        const { id, ...guncelVeriler } = args;
        await ctx.db.patch(id, guncelVeriler);
    },
});