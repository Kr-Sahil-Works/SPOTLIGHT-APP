import { mutation } from "../_generated/server";

export const cleanupDeletedUsers = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

    const users = await ctx.db.query("users").collect();

    const toDelete = users.filter(
      (u) =>
        u.isDeleted &&
        u.deletedAt &&
        now - u.deletedAt > THIRTY_DAYS
    );

    for (const user of toDelete) {
      const userId = user._id;

      /* 🔥 DELETE ALL DATA */

      // posts
      const posts = await ctx.db
        .query("posts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const p of posts) {
        await ctx.db.delete(p._id);
      }

      // messages
      const messages = await ctx.db
        .query("messages")
        .collect();

      for (const m of messages) {
        if (m.senderId === userId || m.receiverId === userId) {
          await ctx.db.delete(m._id);
        }
      }

      // bookmarks
      const bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const b of bookmarks) {
        await ctx.db.delete(b._id);
      }

      // followRequests
      const requests = await ctx.db
        .query("followRequests")
        .collect();

      for (const r of requests) {
        if (r.senderId === userId || r.receiverId === userId) {
          await ctx.db.delete(r._id);
        }
      }

      // 🔥 delete user
      await ctx.db.delete(userId);
    }
  },
});