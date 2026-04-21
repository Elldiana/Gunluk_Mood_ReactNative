import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getir = query({
    handler: async (ctx) => {
        return await ctx.db.query("kategoriler").collect();
    },
});

export const ekle = mutation({
    args: { baslik: v.string() },
    handler: async (ctx, args) => {
        // Aynı isimde var mı kontrol et
        const varMi = await ctx.db
            .query("kategoriler")
            .filter((q) => q.eq(q.field("baslik"), args.baslik))
            .first();

        if (!varMi) {
            await ctx.db.insert("kategoriler", { baslik: args.baslik });
        }
    },
});

export const sil = mutation({
    args: { id: v.id("kategoriler") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
export const guncelle = mutation({
    args: {
        id: v.id("kategoriler"),
        yeniBaslik: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { baslik: args.yeniBaslik });
    },
});

export const varsayilanlariYukle = mutation({
    handler: async (ctx) => {
        const mevcut = await ctx.db.query("kategoriler").first();
        if (mevcut) return; // Zaten veri varsa dur.

        await ctx.db.insert("kategoriler", { baslik: "Uyku" });
        await ctx.db.insert("kategoriler", { baslik: "Sosyal" });
        await ctx.db.insert("kategoriler", { baslik: "Hobiler" });
    },
});