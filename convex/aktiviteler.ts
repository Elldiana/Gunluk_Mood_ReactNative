import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getir = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("aktiviteler").collect();
    },
});

export const ekle = mutation({
    args: {
        ad: v.string(),
        emoji: v.string(),
        kategori: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("aktiviteler", args);
    },
});

export const sil = mutation({
    args: { id: v.id("aktiviteler") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
export const varsayilanlariYukle = mutation({
    args: {},
    handler: async (ctx) => {
        const mevcut = await ctx.db.query("aktiviteler").take(1);
        if (mevcut.length > 0) return; // Zaten veri var, dur.

        const varsayilanlar = [
            { kategori: 'Uyku', ad: 'Erken', emoji: '😴' },
            { kategori: 'Uyku', ad: 'İyi', emoji: '🛌' },
            { kategori: 'Uyku', ad: 'Uykusuz', emoji: '👀' },
            { kategori: 'Sosyal', ad: 'Aile', emoji: '👨‍👩‍👧' },
            { kategori: 'Sosyal', ad: 'Arkadaş', emoji: '👯‍♂️' },
            { kategori: 'Sosyal', ad: 'Parti', emoji: '🎉' },
            { kategori: 'Hobiler', ad: 'Kitap', emoji: '📚' },
            { kategori: 'Hobiler', ad: 'Oyun', emoji: '🎮' },
            { kategori: 'Hobiler', ad: 'Spor', emoji: '🏃‍♂️' },
            { kategori: 'Hobiler', ad: 'Film', emoji: '🎬' },
        ];

        for (const akt of varsayilanlar) {
            await ctx.db.insert("aktiviteler", akt);
        }
    },
});