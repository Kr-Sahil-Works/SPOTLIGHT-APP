import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "../users/users.core";

/* =========================
   👤 USER POSTS
========================= */
export const getPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
handler: async (ctx, args) => {
  const currentUser =
    await getAuthenticatedUserQuery(
      ctx
    );

  const user = args.userId
    ? await ctx.db.get(
        args.userId
      )
    : currentUser;

  if (!user) {
    return [];
  }

  const posts =
    await ctx.db
      .query("posts")
      .withIndex(
        "by_user",
        (q) =>
          q.eq(
            "userId",
            args.userId ??
              user._id
          )
      )
      .order("desc")
      .take(30);

  return await Promise.all(
    posts.map(
      async (post) => {
        const like =
          currentUser
            ? await ctx.db
                .query(
                  "likes"
                )
              .withIndex(
  "by_user_and_post",
                  (q) =>
                    q
                      .eq(
                        "userId",
                        currentUser._id
                      )
                      .eq(
                        "postId",
                        post._id
                      )
                )
                .first()
            : null;

        const bookmark =
          currentUser
            ? await ctx.db
                .query(
                  "bookmarks"
                )
              .withIndex(
  "by_user_and_post",
                  (q) =>
                    q
                      .eq(
                        "userId",
                        currentUser._id
                      )
                      .eq(
                        "postId",
                        post._id
                      )
                )
                .first()
            : null;

 return {
  ...post,

  isLiked:
    !!like,

  isBookmarked:
    !!bookmark,

  author: {
    _id:
      String(user._id),

    username:
      user.username,

    image:
      user.image,
  },
};
      }
    )
  );
},
});