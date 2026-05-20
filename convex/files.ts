import { v } from "convex/values";
import { mutation } from "./_generated/server";

/* =========================
   📤 UPLOAD URL
========================= */
export const generateUploadUrl =
  mutation(async (ctx) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity)
      throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
  });

/* =========================
   🗑 DELETE FILE
========================= */
export const deleteStorageFile =
  mutation({
    args: {
      storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      await ctx.storage.delete(
        args.storageId
      );
    },
  });

  export const getStorageUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const url =
      await ctx.storage.getUrl(
        args.storageId
      );

    if (!url)
      throw new Error(
        "Failed to get image URL"
      );

    return url;
  },
});