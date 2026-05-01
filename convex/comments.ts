import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   💬 ADD COMMENT
========================= */
export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const content = args.content.trim();
if (!content) throw new ConvexError("Empty comment");
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");

    const commentId = await ctx.db.insert("comments", {
      userId: user._id,
      postId: args.postId,
      content,
      createdAt: Date.now(), // 🔥 added
    });

    // ⚠️ keep counter (UI depends on it)
    await ctx.db.patch(args.postId, {
      comments: Math.max(0, (post.comments || 0) + 1),
    });

    // 🔔 notification (not self)
    if (post.userId !== user._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: user._id,
        type: "comment",
        isRead: false,
        postId: args.postId,
        commentId,
        createdAt: Date.now(), // 🔥 added
      });
    }

    return commentId;
  },
});

/* =========================
   📥 GET COMMENTS
========================= */
export const getComments = query({
  args: {
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 30, 50);

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) =>
        q.eq("postId", args.postId)
      )
      .order("desc")
      .take(limit);

    if (comments.length === 0) return [];

    // ⚡ batch users
    const userIds = [...new Set(comments.map(c => c.userId))];

    const users = await Promise.all(
      userIds.map(id => ctx.db.get(id))
    );

    const userMap = new Map(
      users.map(u => [u?._id.toString(), u])
    );

    return comments.map((comment) => {
      const user = userMap.get(comment.userId.toString());

      return {
        ...comment,
        user: {
          fullname: user?.fullname || user?.username || "User",
          image: user?.image || "",
        },
      };
    });
  },
});