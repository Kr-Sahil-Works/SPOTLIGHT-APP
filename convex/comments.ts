import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   💬 ADD COMMENT (OPTIMIZED)
========================= */
export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");

    const commentId = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId: args.postId,
      content: args.content,
    });

    // ⚡ faster patch (no re-read)
    await ctx.db.patch(args.postId, {
      comments: (post.comments || 0) + 1,
    });

    // 🔔 notification (only if not self)
    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }

    return commentId;
  },
});

/* =========================
   📥 GET COMMENTS (OPTIMIZED)
========================= */
export const getComments = query({
  args: {
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20; // ⚡ prevent huge loads

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .take(limit); // ⚡ instead of collect()

    // ⚡ batch user fetch
    const users = await Promise.all(
      comments.map((c) => ctx.db.get(c.userId))
    );

    return comments.map((comment, i) => {
      const user = users[i];
      return {
        ...comment,
        user: {
          fullname: user?.fullname || "User",
          image: user?.image || "",
        },
      };
    });
  },
});