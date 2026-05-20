import { v } from "convex/values";

import {
  mutation,
  query,
} from "../_generated/server";

/* =========================
   👥 ALL USERS
========================= */

export const getAllUsers = query({
  handler: async (ctx) => {
    const users =
      await ctx.db
        .query("users")
        .collect();

    return users.sort((a, b) =>
      (a.username || "")
        .toLowerCase()
        .localeCompare(
          (b.username || "")
            .toLowerCase()
        )
    );
  },
});

/* =========================
   📊 GLOBAL STATS
========================= */

export const getGlobalStats = query({
  handler: async (ctx) => {
    const [
      users,
      posts,
      comments,
      messages,
      likes,
      bookmarks,
      follows,
      notifications,
      collections,
      conversations,
      followRequests,
    ] = await Promise.all([
      ctx.db.query("users").collect(),

      ctx.db.query("posts").collect(),

      ctx.db
        .query("comments")
        .collect(),

      ctx.db
        .query("messages")
        .collect(),

      ctx.db.query("likes").collect(),

      ctx.db
        .query("bookmarks")
        .collect(),

      ctx.db
        .query("follows")
        .collect(),

      ctx.db
        .query("notifications")
        .collect(),

      ctx.db
        .query("collections")
        .collect(),

      ctx.db
        .query("conversations")
        .collect(),

      ctx.db
        .query(
          "followRequests"
        )
        .collect(),
    ]);

    return {
      users: users.length,

      posts: posts.length,

      comments:
        comments.length,

      messages:
        messages.length,

      likes: likes.length,

      bookmarks:
        bookmarks.length,

      follows:
        follows.length,

      notifications:
        notifications.length,

      collections:
        collections.length,

      conversations:
        conversations.length,

      followRequests:
        followRequests.length,
    };
  },
});

/* =========================
   ❌ DELETE USER
========================= */

export const deleteUserByAdmin =
  mutation({
    args: {
      userId: v.id("users"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const userId =
        args.userId;

      /* =========================
         POSTS
      ========================= */

      const posts =
        await ctx.db
          .query("posts")
          .withIndex(
            "by_user",
            (q) =>
              q.eq(
                "userId",
                userId
              )
          )
          .collect();

      for (const p of posts) {
        /* COMMENTS */
        const comments =
          await ctx.db
            .query("comments")
            .withIndex(
              "by_post",
              (q) =>
                q.eq(
                  "postId",
                  p._id
                )
            )
            .collect();

        for (const c of comments) {
          await ctx.db.delete(
            c._id
          );
        }

        /* LIKES */
        const likes =
          await ctx.db
            .query("likes")
            .withIndex(
              "by_post",
              (q) =>
                q.eq(
                  "postId",
                  p._id
                )
            )
            .collect();

        for (const l of likes) {
          await ctx.db.delete(
            l._id
          );
        }

        /* BOOKMARKS */
        const bookmarks =
          await ctx.db
            .query("bookmarks")
            .withIndex(
              "by_post",
              (q) =>
                q.eq(
                  "postId",
                  p._id
                )
            )
            .collect();

        for (const b of bookmarks) {
          await ctx.db.delete(
            b._id
          );
        }

        /* STORAGE */
        try {
          await ctx.storage.delete(
            p.storageId
          );
        } catch {}

        /* DELETE POST */
        await ctx.db.delete(
          p._id
        );
      }

      /* =========================
         USER COMMENTS
      ========================= */

      const allComments =
        await ctx.db
          .query("comments")
          .collect();

      for (const c of allComments) {
        if (c.userId === userId) {
          await ctx.db.delete(
            c._id
          );
        }
      }

      /* =========================
         USER LIKES
      ========================= */

      const allLikes =
        await ctx.db
          .query("likes")
          .collect();

      for (const l of allLikes) {
        if (l.userId === userId) {
          await ctx.db.delete(
            l._id
          );
        }
      }

      /* =========================
         USER BOOKMARKS
      ========================= */

      const bookmarks =
        await ctx.db
          .query("bookmarks")
          .withIndex(
            "by_user",
            (q) =>
              q.eq(
                "userId",
                userId
              )
          )
          .collect();

      for (const b of bookmarks) {
        await ctx.db.delete(
          b._id
        );
      }

      /* =========================
         MESSAGES
      ========================= */

      const messages =
        await ctx.db
          .query("messages")
          .collect();

      for (const m of messages) {
        if (
          m.senderId ===
            userId ||
          m.receiverId ===
            userId
        ) {
          await ctx.db.delete(
            m._id
          );
        }
      }

      /* =========================
   EMPTY CONVERSATIONS
========================= */

const conversations =
  await ctx.db
    .query("conversations")
    .collect();

for (const c of conversations) {
  const msgs =
    await ctx.db
      .query("messages")
      .withIndex(
        "by_conversation",
        (q) =>
          q.eq(
            "conversationId",
            c._id
          )
      )
      .take(1);

  if (msgs.length === 0) {
    await ctx.db.delete(c._id);
  }
}

      /* =========================
         FOLLOWS
      ========================= */

      const follows =
        await ctx.db
          .query("follows")
          .collect();

      for (const f of follows) {
        if (
          f.followerId ===
            userId ||
          f.followingId ===
            userId
        ) {
          await ctx.db.delete(
            f._id
          );
        }
      }

      /* =========================
         FOLLOW REQUESTS
      ========================= */

      const requests =
        await ctx.db
          .query("followRequests")
          .collect();

      for (const r of requests) {
        if (
          r.senderId ===
            userId ||
          r.receiverId ===
            userId
        ) {
          await ctx.db.delete(
            r._id
          );
        }
      }

      /* =========================
         COLLECTIONS
      ========================= */

      const collections =
        await ctx.db
          .query("collections")
          .withIndex(
            "by_user",
            (q) =>
              q.eq(
                "userId",
                userId
              )
          )
          .collect();

      for (const c of collections) {
        const saved =
          await ctx.db
            .query(
              "collectionPosts"
            )
            .withIndex(
              "by_collection",
              (q) =>
                q.eq(
                  "collectionId",
                  c._id
                )
            )
            .collect();

        for (const s of saved) {
          await ctx.db.delete(
            s._id
          );
        }

        await ctx.db.delete(
          c._id
        );
      }

      /* =========================
         PROFILE IMAGE
      ========================= */

      const user =
        await ctx.db.get(
          userId
        );

      if (
        user?.imageStorageId
      ) {
        try {
          await ctx.storage.delete(
            user.imageStorageId
          );
        } catch {}
      }

      /* =========================
   NOTIFICATIONS
========================= */

const notifications =
  await ctx.db
    .query("notifications")
    .collect();

for (const n of notifications) {
if (
  n.receiverId === userId ||
  n.senderId === userId
) {
    await ctx.db.delete(n._id);
  }
}
/* =========================
   TYPING
========================= */

const typing =
  await ctx.db
    .query("typing")
    .collect();

for (const t of typing) {
  if (t.userId === userId) {
    await ctx.db.delete(t._id);
  }
}
      /* =========================
         DELETE USER
      ========================= */

      await ctx.db.delete(
        userId
      );

      return true;
    },
  });