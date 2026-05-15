import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "./users.core";

export const searchUsers = query({
  args: { search: v.string() },

  handler: async (ctx, args) => {
    const currentUser =
      await getAuthenticatedUserQuery(ctx);

    if (!currentUser) return [];

    const search =
      args.search.toLowerCase().trim();

    if (!search) return [];

    // ✅ GET CONVERSATIONS
    const conversations =
      await ctx.db
        .query("conversations")
        .collect();

    // ✅ FIND CHAT USER IDS
    const chattedUserIds =
      conversations
        .filter((c) =>
          c.participants.includes(
            currentUser._id
          )
        )
        .flatMap((c) =>
          c.participants.filter(
            (id) =>
              id !== currentUser._id
          )
        );

    // ✅ REMOVE DUPLICATES
    const uniqueIds = [
      ...new Set(chattedUserIds),
    ];

    // ✅ FETCH USERS
    const users = await Promise.all(
      uniqueIds.map((id) =>
        ctx.db.get(id)
      )
    );

    // ✅ SEARCH FILTER
    return users
      .filter(
        (u) =>
          u &&
          !u.isDeleted &&
          (
            u.fullname
              .toLowerCase()
              .includes(search) ||

            u.username
              .toLowerCase()
              .includes(search)
          )
      )
      .slice(0, 15)
      .map((u) => ({
        _id: u!._id,
        username: u!.username,
        fullname: u!.fullname,
        image: u!.image,
        isOnline: u!.isOnline,
        lastSeen: u!.lastSeen,
      }));
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const currentUser =
      await getAuthenticatedUserQuery(
        ctx
      );

    if (!currentUser) return [];

    const users = await ctx.db
      .query("users")
      .take(20);

    const formatted =
      await Promise.all(
        users
          .filter(
            (u) =>
              u._id !==
                currentUser._id &&
              !u.isDeleted
          )
          .map(async (u) => {
            const follow =
              await ctx.db
                .query("follows")
                .withIndex(
                  "by_both",
                  (q) =>
                    q
                      .eq(
                        "followerId",
                        currentUser._id
                      )
                      .eq(
                        "followingId",
                        u._id
                      )
                )
                .first();

            return {
              _id: u._id,

              username:
                u.username,

              fullname:
                u.fullname,

              image: u.image,

              isFollowing:
                !!follow,
            };
          })
      );

    return formatted;
  },
});