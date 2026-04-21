import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({

    gunluk: defineTable({
        duygu: v.string(),
        not: v.optional(v.string()),
        aktiviteler: v.optional(v.array(v.string())),
        tarih: v.number(),
    }),
    aktiviteler: defineTable({
        ad: v.string(),
        emoji: v.string(),
        kategori: v.string(),
    }),
    kategoriler: defineTable({
        baslik: v.string(),
    }),
});