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
    const identity =
  await ctx.auth.getUserIdentity();

if (!identity) {
  throw new Error(
    "Unauthorized"
  );
}

const admin =
  await ctx.db
    .query("users")
    .withIndex(
      "by_clerk_id",
      (q) =>
        q.eq(
          "clerkId",
          identity.subject
        )
    )
    .first();

if (
  !admin ||
  admin.email !==
  process.env.EXPO_PUBLIC_ADMIN_EMAIL
) {
  throw new Error(
    "Admin access only"
  );
}
    const users = await ctx.db
      .query("users")
      .collect();

    return users.sort((a, b) =>
      a.username.localeCompare(
        b.username
      )
    );
  },
});

/* =========================
   📊 GLOBAL STATS
========================= */
export const getGlobalStats = query({
  handler: async (ctx) => {
    const identity =
  await ctx.auth.getUserIdentity();

if (!identity) {
  throw new Error(
    "Unauthorized"
  );
}

const admin =
  await ctx.db
    .query("users")
    .withIndex(
      "by_clerk_id",
      (q) =>
        q.eq(
          "clerkId",
          identity.subject
        )
    )
    .first();

if (
  !admin ||
  admin.email !==
    "YOUR_REAL_EMAIL@gmail.com"
) {
  throw new Error(
    "Admin access only"
  );
}
    const users = await ctx.db
      .query("users")
      .collect();

    const posts = await ctx.db
      .query("posts")
      .collect();

    const comments = await ctx.db
      .query("comments")
      .collect();

    const messages = await ctx.db
      .query("messages")
      .collect();

    const likes = await ctx.db
      .query("likes")
      .collect();

    const bookmarks = await ctx.db
      .query("bookmarks")
      .collect();

    return {
      users: users.length,
      posts: posts.length,
      comments: comments.length,
      messages: messages.length,
      likes: likes.length,
      bookmarks:
        bookmarks.length,
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
      const userId = args.userId;
const identity =
  await ctx.auth.getUserIdentity();

if (!identity) {
  throw new Error(
    "Unauthorized"
  );
}

const admin =
  await ctx.db
    .query("users")
    .withIndex(
      "by_clerk_id",
      (q) =>
        q.eq(
          "clerkId",
          identity.subject
        )
    )
    .first();

if (
  admin?.email !==
  "YOUR_ADMIN_EMAIL@gmail.com"
) {
  throw new Error(
    "Not admin"
  );
}
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
        /* COMMENTS ON POST */
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

        /* LIKES ON POST */
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
        await ctx.storage.delete(
  p.storageId
);

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
         BOOKMARKS
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
          m.senderId === userId ||
          m.receiverId === userId
        ) {
          await ctx.db.delete(
            m._id
          );
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
          r.senderId === userId ||
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
         FINAL USER DELETE
      ========================= */

      await ctx.db.delete(userId);

      return true;
    },
  });