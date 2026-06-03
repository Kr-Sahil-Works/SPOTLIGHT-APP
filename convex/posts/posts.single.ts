import { v } from "convex/values";
import { query } from "../_generated/server";

export const getPostById =
  query({
    args: {
      postId: v.id("posts"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const post =
        await ctx.db.get(
          args.postId
        );

      if (!post) {
        return null;
      }

      const author =
        await ctx.db.get(
          post.userId
        );

      return {
        ...post,

        isLiked: false,

        isBookmarked: false,

        author: {
          _id:
            String(
              author?._id
            ),

          username:
            author?.username ??
            "user",

          image:
            author?.image ??
            "",
        },
      };
    },
  });