import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthenticatedUser,
  getAuthenticatedUserQuery,
} from "./users/users.core";

/* =========================
   CREATE COLLECTION
========================= */

export const createCollection = mutation({
  args: {
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    return await ctx.db.insert("collections", {
      userId: user._id,
      name: args.name,
      createdAt: Date.now(),
    });
  },
});

/* =========================
   GET COLLECTIONS
========================= */

export const getCollections = query({
  handler: async (ctx) => {
    const user =
      await getAuthenticatedUserQuery(
        ctx
      );

    if (!user) return [];

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .order("desc")
      .collect();

    return await Promise.all(
      collections.map(async (c) => {
        const savedPosts =
          await ctx.db
            .query("collectionPosts")
            .withIndex(
              "by_collection",
              (q) =>
                q.eq(
                  "collectionId",
                  c._id
                )
            )
            .collect();

        let coverImage = null;

        if (savedPosts.length > 0) {
          const firstPost =
            await ctx.db.get(
              savedPosts[0].postId
            );

          coverImage =
            firstPost?.imageUrl ??
            null;
        }

        return {
          ...c,
          coverImage,
          postsCount:
            savedPosts.length,
        };
      })
    );
  },
});
/* =========================
   ADD POSTS TO COLLECTION
========================= */

export const addPostsToCollection = mutation({
  args: {
    collectionId: v.id("collections"),
    postIds: v.array(v.id("posts")),
  },

  handler: async (ctx, args) => {
    let addedCount = 0;

    for (const postId of args.postIds) {
      const existing = await ctx.db
        .query("collectionPosts")
        .withIndex(
          "by_collection_and_post",
          (q) =>
            q
              .eq(
                "collectionId",
                args.collectionId
              )
              .eq("postId", postId)
        )
        .first();

      if (!existing) {
        await ctx.db.insert(
          "collectionPosts",
          {
            collectionId:
              args.collectionId,
            postId,
            addedAt: Date.now(),
          }
        );

        addedCount++;
      }
    }

    return {
      added: addedCount,
      skipped:
        args.postIds.length - addedCount,
    };
  },
});

/* =========================
   GET COLLECTION POSTS
========================= */

export const getCollectionPosts = query({
  args: {
    collectionId: v.id("collections"),
  },

  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("collectionPosts")
      .withIndex("by_collection", (q) =>
        q.eq("collectionId", args.collectionId)
      )
      .collect();

    const posts = await Promise.all(
      saved.map((s) => ctx.db.get(s.postId))
    );

    return posts.filter(Boolean);
  },
});

export const deleteCollection = mutation({
  args: {
    collectionId: v.id("collections"),
  },

  handler: async (ctx, args) => {
    const saved =
      await ctx.db
        .query("collectionPosts")
        .withIndex(
          "by_collection",
          (q) =>
            q.eq(
              "collectionId",
              args.collectionId
            )
        )
        .collect();

    /* DELETE SAVED POSTS */
    for (const item of saved) {
      await ctx.db.delete(item._id);
    }

    /* DELETE COLLECTION */
    await ctx.db.delete(
      args.collectionId
    );

    return true;
  },
});

export const removePostFromCollection =
  mutation({
    args: {
      collectionId: v.id("collections"),
      postId: v.id("posts"),
    },

    handler: async (ctx, args) => {
      const existing =
        await ctx.db
          .query("collectionPosts")
          .withIndex(
            "by_collection_and_post",
            (q) =>
              q
                .eq(
                  "collectionId",
                  args.collectionId
                )
                .eq(
                  "postId",
                  args.postId
                )
          )
          .first();

      if (!existing) return false;

      await ctx.db.delete(
        existing._id
      );

      return true;
    },
  });